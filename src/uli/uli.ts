// Uli's behaviour: tap-and-talk conversations, typed questions, hands-free "Hey Uli",
// eyes that follow the pointer, wandering around the page and the little callouts.
// startUli() wires everything to the markup rendered by <Uli/> and returns a cleanup function.
import { EMAIL } from "@/data/site";
import { downloadResume, prefersReducedMotion } from "@/lib/browser";
import { on } from "@/lib/bus";
import { answer, LINES, type Act } from "./knowledge";
import { getRecognizer, type Recognizer } from "./speech";
import { Voice, type UliState } from "./voice";

// The AI brain (Gemini via the gyani Cloudflare Worker). On a local preview, ?ai=local uses `wrangler dev`.
const WORKER = "https://gyani.anuragkushwah134.workers.dev";
const LOCAL_WORKER = "http://127.0.0.1:8787";

const LABELS: Record<UliState, string> = { listening: "🎙️ Listening… just talk", thinking: "🦉 Thinking…", speaking: "🔊 Uli", idle: "" };
const LOCAL_FIRST = new Set(["greet", "bye", "thanks", "owl", "joke", "resume"]); // instant built-in replies
// Speech engines hear "Uli" many ways, so accept the common spellings.
const WAKE = /\b(?:hey|hi|hello|ok|okay|hay)\s*,?\s*(?:uli|ulli|ooli|oolie|oolee|uly|ulee|ulie|uley|ully|oli|olly|ollie|oly|hooli|huli|holy|julie|juli|uri|ule|u\s?li|u\s?lee|you\s?li|you\s?lee|lee|li|ali|lily|lilly)\b[\s,.!?-]*(.*)$/i;
const CALLOUTS = ["Psst… I talk! Tap me 🎙️", "I'm Uli — ask me about Anurag 🦉", "Not just decoration. Tap & talk!", "I know his whole resume 👀", "Hiring? Ask me anything ✨", "Tap me — I speak with an Indian accent 😄", "Try hands-free: say “Hey Uli” 👂"];

const local = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const session = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
};

export function startUli(root: HTMLElement): () => void {
  const reduced = prefersReducedMotion();
  const ac = new AbortController(), { signal } = ac;
  let disposed = false;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(() => { timers.delete(id); if (!disposed) fn(); }, ms);
    timers.add(id);
    return id;
  };
  const cancel = (id: ReturnType<typeof setTimeout> | undefined) => { if (id !== undefined) { clearTimeout(id); timers.delete(id); } };
  const sleep = (ms: number) => new Promise<void>((r) => later(r, ms));

  const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const bubble = $(".owl-bubble"), statusEl = $(".owl-status"), caption = $(".owl-caption");
  const typeForm = $<HTMLFormElement>(".owl-type"), input = $<HTMLInputElement>(".owl-in"), btn = $<HTMLButtonElement>(".owl-btn");
  const wakeBtn = $<HTMLButtonElement>(".owl-wake"), tag = $<HTMLButtonElement>(".owl-callout");
  const pupils = [...root.querySelectorAll<SVGGElement>(".owl-pupil")];
  const lids = [...root.querySelectorAll<SVGRectElement>(".owl-lid")];

  /* eyes follow the pointer, and blink now and then */
  let px = innerWidth / 2, py = innerHeight / 2, lookOverride: [number, number] | null = null;
  addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; }, { passive: true, signal });
  const look = () => {
    if (disposed) return;
    for (const p of pupils) {
      const eye = p.parentElement!.querySelector("circle")!.getBoundingClientRect();
      const cx = eye.left + eye.width / 2, cy = eye.top + eye.height / 2;
      let dx: number, dy: number;
      if (lookOverride) [dx, dy] = lookOverride;
      else {
        const ang = Math.atan2(py - cy, px - cx), dist = Math.min(1, Math.hypot(px - cx, py - cy) / 220);
        dx = Math.cos(ang) * 5 * dist; dy = Math.sin(ang) * 5 * dist;
      }
      p.style.transform = `translate(${dx}px,${dy}px)`;
    }
    requestAnimationFrame(look);
  };
  look();
  const blink = () => {
    lids.forEach((l) => l.classList.add("shut"));
    later(() => lids.forEach((l) => l.classList.remove("shut")), 140);
    later(blink, 2500 + Math.random() * 4000);
  };
  later(blink, 2000);

  /* state + bubble */
  const setState = (s: UliState) => {
    root.dataset.state = s;
    lookOverride = s === "thinking" ? [2, -4] : null;
    statusEl.textContent = LABELS[s];
  };
  const show = (text?: string) => { bubble.hidden = false; if (text !== undefined) caption.textContent = text; };
  setState("idle");

  let active = false, greeted = false, misses = 0;
  const isLocal = /^(127\.0\.0\.1|localhost)$/.test(location.hostname) && new URLSearchParams(location.search).get("ai") === "local";
  const base = isLocal ? LOCAL_WORKER : WORKER;
  const voice = new Voice(base + "/speak", { setState, show, isActive: () => active });
  ["pointerdown", "keydown"].forEach((t) => document.addEventListener(t, () => voice.unlock(), { passive: true, signal }));

  /* voice in */
  const SR = getRecognizer();
  let rec: Recognizer | null = null;
  const listen = () => new Promise<{ text?: string; error?: string | null }>((resolve) => {
    if (!SR) return resolve({ error: "unsupported" });
    const r = new SR();
    rec = r;
    r.lang = "en-IN"; r.interimResults = true; r.maxAlternatives = 1; r.continuous = false;
    let finalText = "", interim = "", error: string | null = null;
    r.onstart = () => { setState("listening"); show(""); };
    r.onresult = (e) => {
      interim = "";
      for (const res of e.results) { if (res.isFinal) finalText += res[0].transcript; else interim += res[0].transcript; }
      caption.textContent = "“" + (finalText || interim) + "”";
    };
    r.onerror = (e) => { error = e.error; };
    r.onend = () => { rec = null; resolve({ text: (finalText || interim).trim(), error }); };
    try { r.start(); } catch { resolve({ error: "busy" }); }
  });

  /* smart answers */
  const history: { role: "user" | "model"; text: string }[] = [];
  const askAI = async (q: string): Promise<string | null> => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    try {
      const r = await fetch(base + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history.slice(-8), { role: "user", text: q }] }),
        signal: ctrl.signal,
      });
      if (!r.ok) return null;
      const d = (await r.json()) as { reply?: unknown };
      return typeof d.reply === "string" && d.reply.trim() ? d.reply.trim() : null;
    } catch { return null; } finally { clearTimeout(t); }
  };

  const respond = async (q: string): Promise<Act | undefined> => {
    setState("thinking");
    show("“" + q + "”");
    const builtIn = answer(q);
    let text: string | null = null, act: Act | undefined;
    if (!(builtIn.id && LOCAL_FIRST.has(builtIn.id))) text = await askAI(q);
    if (!text) { text = builtIn.text; act = builtIn.act; }
    else if (/\b(email|contact|reach|hire)\b/i.test(q)) act = "copy";
    history.push({ role: "user", text: q }, { role: "model", text });
    if (history.length > 16) history.splice(0, history.length - 16);
    show(text);
    if (act === "copy") { try { await navigator.clipboard.writeText(EMAIL); } catch { /* no permission */ } }
    if (act === "resume") downloadResume();
    await voice.speak(text);
    return act;
  };

  const typeMode = () => {
    typeForm.hidden = false;
    setState("idle");
    statusEl.textContent = "⌨️ Ask me anything";
    later(() => input.focus(), 30);
  };

  const stop = (msg?: string) => {
    active = false; misses = 0;
    if (rec) { try { rec.abort(); } catch { /* already ended */ } rec = null; }
    voice.stop();
    setState("idle");
    root.classList.remove("open");
    if (msg) { show(msg); statusEl.textContent = ""; later(() => { if (!active && typeForm.hidden) bubble.hidden = true; }, 3500); }
    else if (typeForm.hidden) bubble.hidden = true;
    later(startWake, 800);
  };

  const runConversation = async (firstQ?: string | null, woke?: boolean) => {
    active = true;
    root.classList.add("open");
    if (firstQ) {
      greeted = true;
      if ((await respond(firstQ)) === "close") return stop();
    } else if (woke) {
      greeted = true;
      show(LINES.wake);
      await voice.speak(LINES.wake);
    } else if (!greeted) {
      greeted = true;
      const hi = SR ? LINES.hi : LINES.hiNoMic;
      show(hi);
      await voice.speak(hi);
    }
    if (!SR) return typeMode();
    while (active && !disposed) {
      const { text, error } = await listen();
      if (!active || disposed) break;
      if (error === "not-allowed" || error === "service-not-allowed") {
        show(LINES.mic); await voice.speak(LINES.mic); return typeMode();
      }
      if (!text) {
        if (++misses >= 2) { stop(wakeOn ? "Say “Hey Uli” whenever you need me 👂" : "Tap me whenever you want to talk again 🦉"); break; }
        show(LINES.miss); await voice.speak(LINES.miss); continue;
      }
      misses = 0;
      if ((await respond(text)) === "close") { stop(); break; }
    }
  };

  /* hands-free: "Hey Uli" (opt-in, remembered) */
  let wakeOn = !!SR && local.get("owl-wake") === "1";
  let wakeRec: Recognizer | null = null, wakeTimer: ReturnType<typeof setTimeout> | undefined;
  const renderWake = () => {
    root.classList.toggle("wake-on", wakeOn);
    wakeBtn.textContent = wakeOn ? "👂 Hands-free is on: say “Hey Uli”" : "🎙️ Hands-free: say “Hey Uli”";
    wakeBtn.setAttribute("aria-pressed", String(wakeOn));
    wakeBtn.hidden = !SR;
  };
  const stopWake = () => new Promise<void>((res) => {
    cancel(wakeTimer);
    if (!wakeRec) return res();
    const r = wakeRec;
    wakeRec = null;
    r.onend = () => res();
    try { r.abort(); } catch { res(); }
    setTimeout(res, 500);
  });
  const startWake = () => {
    cancel(wakeTimer);
    if (!SR || !wakeOn || active || wakeRec || document.hidden || disposed) return;
    const r = new SR();
    wakeRec = r;
    r.lang = "en-IN"; r.continuous = true; r.interimResults = false; r.maxAlternatives = 3;
    r.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (!res.isFinal) continue;
        const heard = Array.from({ length: res.length }, (_, k) => res[k].transcript.trim());
        console.debug("[Uli] heard:", heard.join(" | "));
        for (const h of heard) {
          const m = h.match(WAKE);
          if (!m) continue;
          const rest = (m[1] || "").trim();
          void stopWake().then(() => { if (!active) { typeForm.hidden = true; void conversation(rest.split(/\s+/).length >= 2 ? rest : null, true); } });
          return;
        }
      }
    };
    r.onerror = (e) => {
      if (e.error !== "no-speech" && e.error !== "aborted") console.debug("[Uli] hands-free error:", e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wakeOn = false;
        local.set("owl-wake", "0");
        renderWake();
        show("I need microphone permission for hands-free mode. You can allow it in the address bar. 🦉");
      }
    };
    r.onend = () => { if (wakeRec === r) { wakeRec = null; wakeTimer = later(startWake, 700); } };
    try { r.start(); } catch { wakeRec = null; }
  };
  wakeBtn.addEventListener("click", async () => {
    wakeOn = !wakeOn;
    local.set("owl-wake", wakeOn ? "1" : "0");
    renderWake();
    if (!wakeOn) { await stopWake(); return; }
    if (!active) { show(LINES.handsOn); await voice.speak(LINES.handsOn); setState("idle"); }
    startWake();
  }, { signal });
  document.addEventListener("visibilitychange", () => void (document.hidden ? stopWake() : startWake()), { signal });
  renderWake();

  /* wandering */
  const SIZE = () => btn.getBoundingClientRect().width || 84;
  const pos = { x: 0, y: 0 };
  let flyTimer: ReturnType<typeof setTimeout> | undefined, calloutTimer: ReturnType<typeof setTimeout> | undefined;
  let ci = (Math.random() * CALLOUTS.length) | 0;
  const callout = () => {
    tag.textContent = CALLOUTS[ci++ % CALLOUTS.length];
    tag.hidden = false;
    cancel(calloutTimer);
    calloutTimer = later(() => { tag.hidden = true; }, 3800);
  };
  const placeBubble = () => {
    root.classList.toggle("b-left", pos.x + SIZE() / 2 < innerWidth / 2);
    root.classList.toggle("b-below", pos.y < 300);
  };
  const moveTo = (x: number, y: number, instant = false) => {
    const s = SIZE();
    x = Math.max(12, Math.min(innerWidth - s - 12, x));
    y = Math.max(72, Math.min(innerHeight - s - 18, y));
    if (!instant && Math.hypot(x - pos.x, y - pos.y) > 8) {
      root.classList.toggle("face-left", x < pos.x);
      root.classList.add("flying");
      cancel(flyTimer);
      flyTimer = later(() => {
        root.classList.remove("flying"); root.classList.add("hop");
        later(() => root.classList.remove("hop"), 450);
        if (!active && bubble.hidden && Math.random() < 0.7) callout();
      }, 2600);
    }
    root.classList.toggle("no-anim", instant);
    pos.x = x; pos.y = y;
    root.style.transform = `translate(${x}px,${y}px)`;
    placeBubble();
  };
  const homeX = () => innerWidth - SIZE() - 18;
  const home = (instant = false) => moveTo(homeX(), innerHeight - SIZE() - 18, instant);
  home(true);
  addEventListener("resize", () => (active || innerWidth <= 600 ? home(true) : moveTo(pos.x, pos.y, true)), { signal });

  let hovering = false;
  btn.addEventListener("pointerenter", () => { hovering = true; }, { signal });
  btn.addEventListener("pointerleave", () => { hovering = false; }, { signal });
  const wander = () => {
    const busy = active || hovering || !bubble.hidden || document.hidden;
    // phones: Uli stays perched in her corner (only the callouts pop up); tablets and desktops: she wanders
    if (innerWidth <= 600) {
      if (!busy) { home(); if (Math.random() < 0.5) callout(); }
    } else if (!busy && !reduced) {
      const s = SIZE(), margin = 24, r = Math.random();
      let x: number, y: number;
      // mostly hug the edges, sometimes perch somewhere in the middle
      if (r < 0.35) { x = Math.random() < 0.5 ? margin : innerWidth - s - margin; y = 90 + Math.random() * (innerHeight - s - 120); }
      else if (r < 0.75) { x = margin + Math.random() * (innerWidth - s - margin * 2); y = innerHeight - s - 18; }
      else { x = margin + Math.random() * (innerWidth - s - margin * 2); y = 90 + Math.random() * (innerHeight - s - 120); }
      moveTo(x, y);
    }
    later(wander, 7000 + Math.random() * 6000);
  };
  later(wander, 6000);

  // start every conversation from home base so the bubble always fits
  const conversation = async (firstQ?: string | null, woke?: boolean) => {
    await stopWake();
    const atHome = pos.x === homeX();
    home();
    await sleep(atHome ? 0 : 400);
    return runConversation(firstQ, woke);
  };
  later(startWake, 1500); // resume hands-free if it was turned on before

  /* controls */
  btn.addEventListener("click", () => { if (active) stop(); else { typeForm.hidden = true; void conversation(); } }, { signal });
  $(".owl-stop").addEventListener("click", () => { typeForm.hidden = true; stop(); }, { signal });
  $(".owl-kbd").addEventListener("click", () => {
    active = false;
    if (rec) { try { rec.abort(); } catch { /* already ended */ } }
    voice.stop();
    bubble.hidden = false;
    typeMode();
  }, { signal });
  typeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    input.value = "";
    if (!q) return;
    if ((await respond(q)) === "close") { typeForm.hidden = true; stop(); return; }
    if (!bubble.hidden) typeMode();
  }, { signal });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !bubble.hidden) { typeForm.hidden = true; stop(); } }, { signal });
  tag.addEventListener("click", () => { tag.hidden = true; if (!active) { typeForm.hidden = true; void conversation(); } }, { signal });

  /* one-time teaser */
  if (session.get("owl-teased") !== "1") later(() => {
    if (active || !bubble.hidden) return;
    statusEl.textContent = "";
    show("Tap me and just talk! 🦉 Ask me anything about Anurag.");
    session.set("owl-teased", "1");
    later(() => { if (!active && typeForm.hidden) bubble.hidden = true; }, 6000);
  }, 4500);

  // hooks for the terminal, command palette and "ask the owl" buttons
  const offs = [
    on("owl:open", () => { if (!active) { typeForm.hidden = true; void conversation(); } }),
    on("owl:ask", (q) => { bubble.hidden = false; void respond(q).then(() => { if (!bubble.hidden) typeMode(); }); }),
  ];

  return () => {
    disposed = true;
    active = false;
    ac.abort();
    offs.forEach((f) => f());
    timers.forEach(clearTimeout);
    timers.clear();
    voice.stop();
    try { rec?.abort(); } catch { /* ended */ }
    void stopWake();
  };
}
