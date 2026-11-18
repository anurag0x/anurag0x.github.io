/* Uli — Anurag's wise owl. Eyes follow the pointer; answers by voice or text from resume data.
   Everything runs in the browser: no server, no API keys. */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EMAIL = "anuragkushwah134@gmail.com";

  /* ---------------- knowledge base ---------------- */
  // @voice-lines-start  (everything up to @voice-lines-end is read by the voice-recording script)
  // Each intent: keywords (single words or phrases) and one or more answers.
  const KB = [
    { id: "greet", keys: ["hi", "hello", "hey", "namaste", "hola", "yo", "sup", "good morning", "good evening"],
      a: ["Namaste! 🦉 I'm Uli, Anurag's wise little owl. Ask me about his work, skills, projects, or how to reach him."] },
    { id: "owl", keys: ["who are you", "your name", "what are you", "uli", "uluka", "owl", "bot"],
      a: ["I'm Uli! My name comes from Uluka, the owl who carries Goddess Lakshmi. Anurag built me into his portfolio, and I know all about his work."] },
    { id: "about", keys: ["who is anurag", "about", "introduce", "tell me about", "summary", "yourself", "him", "anurag"],
      a: ["Anurag Kushwah is a tech all-rounder: backend, frontend, mobile, AI and cloud — if it's tech, he can build it. He has 3+ years of experience shipping scalable systems with Node.js, TypeScript, Python, PostgreSQL, MongoDB, Redis and Kafka, and he's currently a Software Engineer at Animall. Lately he's deep into AI and LLM systems: document ingestion, embeddings, vector search and RAG."] },
    { id: "allround", keys: ["all rounder", "allrounder", "full stack", "fullstack", "frontend", "front end", "mobile", "flutter", "react", "app", "apps", "anything", "everything", "versatile", "generalist", "can he"],
      a: ["Short answer: yes, he can build it. Anurag is a true tech all-rounder — backend APIs and microservices, React and Next.js frontends, Flutter mobile apps, AI and RAG pipelines, real-time voice and chat, and cloud deployments on GCP and AWS. Give him a problem, not a stack."] },
    { id: "current", keys: ["current", "currently", "now", "animall", "today", "present", "job", "where does he work", "working"],
      a: ["He's currently a Software Engineer at Animall, building the backend for the Animall Bhai app, which helps India's dairy farmers. That means Node.js and Express APIs on PostgreSQL and Redis, real-time voice calls and chat with Agora and Socket.IO, push-notification and Exotel IVR pipelines on Cloud Tasks, and AI-powered support using the Claude API."] },
    { id: "experience", keys: ["experience", "career", "companies", "worked", "work history", "background", "previous", "past", "jobs"],
      a: ["Here's the journey: Masai School as a Software Developer, then Kapiva Ayurveda as SDE 1, then Kenpath Technologies as an SDE, and now Animall as a Software Engineer. That's 3+ years shipping production backends. Ask me about any one of them!"] },
    { id: "years", keys: ["how many years", "years of experience", "how long", "how experienced", "yoe", "senior"],
      a: ["3+ years of professional experience, across four companies: Masai, Kapiva, Kenpath and now Animall."] },
    { id: "kenpath", keys: ["kenpath"],
      a: ["At Kenpath Technologies he was a Software Development Engineer. He built Python services for AI-powered document processing — a pipeline that takes PDFs through extraction, language detection, translation, review, chunking and embeddings, then indexes them in the Qdrant vector database for RAG. He also set up Docker-based CI/CD, traced LLM workflows with Langfuse, and worked with Beckn Network integrations."] },
    { id: "kapiva", keys: ["kapiva", "ayurveda", "carestudio", "telehealth", "healthcare", "commerce", "checkout", "orders"],
      a: ["At Kapiva he was SDE 1, building production backends across healthcare and commerce — Node.js, Express, MongoDB, PostgreSQL, Redis and Kafka, handling 100k+ requests a day. Highlights: CareStudio, a telehealth platform with an API gateway over 6+ microservices and Kafka event flows for 10,000+ consultations a month; Nidaan, which uses LLMs to turn doctor-patient calls into feedback; a call-audit platform for 5,000+ calls a month; checkout services for 1,000+ orders a day; Microsoft Entra ID SSO with RBAC; and 25 to 35 percent faster APIs. He also helped launch Kapiva's UK store."] },
    { id: "masai", keys: ["masai"],
      a: ["He studied full-stack web development at Masai School, then worked there as a Software Developer — building React, Node.js, Express and MongoDB features for learning and student-management platforms used by thousands of students."] },
    { id: "skills", keys: ["skills", "skill", "tech", "stack", "technologies", "languages", "tools", "know", "good at", "expert", "frameworks"],
      a: ["His toolkit: Backend — Node.js, Express, NestJS, Python, TypeScript, REST, WebSockets, JWT, OAuth and SSO. Data — PostgreSQL, MongoDB, MySQL, Redis, Kafka and Qdrant. AI — LLMs, RAG, embeddings, vector search and Langfuse. Infra — GCP, AWS, Docker, GitHub Actions and Nginx. Frontend — React, Next.js and Tailwind."] },
    { id: "ai", keys: ["ai", "llm", "llms", "rag", "embedding", "embeddings", "vector", "qdrant", "langfuse", "genai", "generative", "machine learning", "ml", "claude", "gpt", "prompt"],
      a: ["AI is a big part of his recent work. At Kenpath he built a document ingestion pipeline with embeddings in Qdrant for RAG, traced with Langfuse. At Kapiva he built Nidaan, which analyses doctor-patient call recordings with LLMs. And at Animall he's building AI-powered support with the Claude API."] },
    { id: "projects", keys: ["projects", "project", "built", "build", "portfolio", "side project", "made", "shipped"],
      a: ["Some highlights: real-time calls and chat at Animall; a document ingestion pipeline with Qdrant and Langfuse at Kenpath; CareStudio telehealth, Nidaan and a call-audit platform at Kapiva. On the side: Spendwise, an expense tracker, and Hypergo, a video player. Scroll to the Work section to see them all!"] },
    { id: "backend", keys: ["backend", "microservices", "api", "apis", "gateway", "kafka", "redis", "postgres", "postgresql", "scalable", "scale", "system design", "architecture", "event driven"],
      a: ["Backend is his home turf: API gateways with dynamic routing over 6+ microservices, Kafka event-driven workflows, Redis caching and query tuning that made APIs 25 to 35 percent faster, and services handling 100k+ requests a day."] },
    { id: "impact", keys: ["impact", "numbers", "achievements", "achievement", "metrics", "results", "proud", "best work", "performance"],
      a: ["Some numbers he's proud of: 100k+ requests a day, 10,000+ telehealth consultations a month, 5,000+ calls audited a month, 1,000+ orders a day, and APIs made 25 to 35 percent faster."] },
    { id: "education", keys: ["education", "degree", "college", "university", "study", "studied", "davv", "bsc", "graduate", "qualification"],
      a: ["He has a B.Sc. in Computer Science from Devi Ahilya Vishwavidyalaya in Indore, plus a full-time full-stack web development program at Masai School."] },
    { id: "location", keys: ["where", "location", "live", "lives", "based", "city", "from", "hometown", "native", "gurugram", "gurgaon", "dhar", "amjhera"],
      a: ["He's based in Gurugram, Haryana. His hometown is Amjhera, in Dhar district, Madhya Pradesh."] },
    { id: "contact", keys: ["contact", "email", "mail", "reach", "hire", "hiring", "available", "talk", "connect", "message", "job offer", "opportunity"],
      a: [`The best way to reach him is email: ${EMAIL}. You can also find him on LinkedIn and GitHub — links are in the contact section. I've copied the email to your clipboard, just in case. 😉`], act: "copy" },
    { id: "links", keys: ["github", "linkedin", "twitter", "social", "socials", "profile"],
      a: ["GitHub: github.com/anurag0x. LinkedIn: linkedin.com/in/anuraagkushwah. Twitter: @anuraag0x."] },
    { id: "resume", keys: ["resume", "cv", "pdf", "download"],
      a: [`Want his latest resume? Email him at ${EMAIL} and he'll send it over. Meanwhile, I can tell you anything that's on it — try asking about his experience or skills.`] },
    { id: "thanks", keys: ["thanks", "thank you", "thx", "cool", "nice", "great", "awesome", "ok", "okay"],
      a: ["Hoo-ray! Anything else you'd like to know?", "My pleasure! 🦉 Ask away if you're curious about anything else."] },
    { id: "bye", keys: ["bye", "goodbye", "see you", "later", "exit", "close"],
      a: ["Bye for now! Hoot me up any time. 🦉"], act: "close" },
    { id: "joke", keys: ["joke", "funny", "fun fact", "laugh"],
      a: ["Why did the owl join the backend team? Because it's great at handling night-time requests. Hoo-hoo!", "Anurag once made an API 35 percent faster. I can turn my head 270 degrees. We both optimise."] },
  ];
  const FALLBACK = "Hmm, that one flew over my feathers. 🦉 I know about Anurag's experience, skills, AI work, projects, education, location and how to contact him — try one of those!";
  const LINES = {
    hi: "Namaste! I'm Uli, Anurag's wise owl. Just talk to me — ask what he does, his skills, or how to hire him.",
    hiNoMic: "Namaste! I'm Uli. My ears don't work in this browser, so please type your question below.",
    mic: "I need microphone permission to hear you. Allow it in the address bar, or type instead.",
    miss: "I didn't catch that. Try again?",
  };
  // what actually gets spoken (emoji stripped, email and symbols said naturally)
  const spoken = (text) => text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .replace(EMAIL, "his email, which is right here on screen")
    .replace(/(\d+)k\+/g, "$1 thousand plus")
    .replace(/(\d),(\d{3})\+/g, "$1$2 plus")
    .replace(/(\d)\+/g, "$1 plus")
    .replace(/\s+/g, " ").trim();
  // FNV-1a hash → file name of the pre-recorded clip
  const clipId = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); };
  // @voice-lines-end
  const STOP = new Set("a an the is are was were do does did of to in on for and or me tell what whats which can could would please about his he hes with at by it you your i".split(" "));

  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s+]/g, " ").replace(/\s+/g, " ").trim();
  const answer = (q) => {
    const text = " " + norm(q) + " ";
    const words = new Set(text.trim().split(" ").filter((w) => w && !STOP.has(w)));
    let best = null, bestScore = 0;
    for (const intent of KB) {
      let score = 0;
      for (const k of intent.keys) {
        if (k.includes(" ")) { if (text.includes(" " + k + " ")) score += 3; }
        else if (words.has(k)) score += 2;
        else if (k.length > 4 && [...words].some((w) => w.length > 3 && (w.startsWith(k) || k.startsWith(w)))) score += 1;
      }
      // generic intents should only win when nothing specific matched
      if (["about", "thanks", "greet"].includes(intent.id)) score *= 0.6;
      if (score > bestScore) { bestScore = score; best = intent; }
    }
    if (!best) return { text: FALLBACK };
    return { id: best.id, text: best.a[Math.random() * best.a.length | 0], act: best.act };
  };

  /* ---------------- markup ---------------- */
  const OWL_SVG = `
  <svg viewBox="0 0 120 130" class="owl-svg" aria-hidden="true">
    <path d="M4 124 Q60 116 116 124" stroke="#5a3d28" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M100 122 q10 -10 16 -4 q-6 8 -16 4 Z" fill="#6aa84f"/>
    <g class="owl-bob">
      <path class="owl-tuft owl-tuft-l" d="M24 40 C16 28 14 16 18 6 C26 14 34 22 42 30 Z" fill="#6b4329"/>
      <path class="owl-tuft owl-tuft-r" d="M96 40 C104 28 106 16 102 6 C94 14 86 22 78 30 Z" fill="#6b4329"/>
      <ellipse cx="60" cy="72" rx="44" ry="48" fill="#8a5a3c"/>
      <path class="owl-wing owl-wing-l" d="M18 60 Q2 88 22 112 Q30 88 28 64 Z" fill="#6b4329"/>
      <path class="owl-wing owl-wing-r" d="M102 60 Q118 88 98 112 Q90 88 92 64 Z" fill="#6b4329"/>
      <path d="M14 84 q6 4 10 0 M14 94 q6 4 10 0 M96 84 q6 4 10 0 M96 94 q6 4 10 0" stroke="#4e2f1c" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="94" rx="27" ry="24" fill="#ead6b4"/>
      <path d="M46 86 l4 4 l4 -4 M56 86 l4 4 l4 -4 M66 86 l4 4 l4 -4 M51 96 l4 4 l4 -4 M61 96 l4 4 l4 -4 M56 106 l4 4 l4 -4" stroke="#b5875a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <circle cx="42" cy="54" r="21" fill="#f1e2c6"/>
      <circle cx="78" cy="54" r="21" fill="#f1e2c6"/>
      <path d="M26 38 Q42 30 58 42 M94 38 Q78 30 62 42" stroke="#6b4329" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g class="owl-eye" data-eye="l">
        <circle class="owl-iris" cx="42" cy="54" r="14" fill="#f5a524"/>
        <g class="owl-pupil"><circle cx="42" cy="54" r="7.5" fill="#140d08"/><circle cx="44.6" cy="51.4" r="2.4" fill="#fff"/></g>
        <rect class="owl-lid" x="27" y="39" width="30" height="30" rx="15" fill="#8a5a3c"/>
      </g>
      <g class="owl-eye" data-eye="r">
        <circle class="owl-iris" cx="78" cy="54" r="14" fill="#f5a524"/>
        <g class="owl-pupil"><circle cx="78" cy="54" r="7.5" fill="#140d08"/><circle cx="80.6" cy="51.4" r="2.4" fill="#fff"/></g>
        <rect class="owl-lid" x="63" y="39" width="30" height="30" rx="15" fill="#8a5a3c"/>
      </g>
      <path class="owl-beak" d="M54 66 Q60 62 66 66 Q63 74 60 80 Q57 74 54 66 Z" fill="#e09a2d"/>
      <path d="M46 118 l-3 6 M50 118 v7 M54 118 l3 6 M66 118 l-3 6 M70 118 v7 M74 118 l3 6" stroke="#e09a2d" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`;


  /* ---------------- voice-first UI: tap the owl and talk ---------------- */
  const root = document.createElement("div");
  root.className = "owl-root";
  root.innerHTML = `
    <div class="owl-bubble" role="status" aria-live="polite" hidden>
      <div class="owl-status"></div>
      <div class="owl-caption"></div>
      <form class="owl-type" autocomplete="off" hidden>
        <input class="owl-in" placeholder="Type your question…" aria-label="Ask Uli a question" />
        <button aria-label="Ask">↑</button>
      </form>
      <div class="owl-actions">
        <button class="owl-kbd" type="button">⌨️ type instead</button>
        <button class="owl-stop" type="button">■ stop</button>
      </div>
    </div>
    <button class="owl-btn" aria-label="Talk to Uli, Anurag's owl. Tap and speak.">${OWL_SVG}<span class="owl-ring"></span></button>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const bubble = $(".owl-bubble"), statusEl = $(".owl-status"), caption = $(".owl-caption");
  const typeForm = $(".owl-type"), input = $(".owl-in"), btn = $(".owl-btn");
  const pupils = [...root.querySelectorAll(".owl-pupil")];
  const lids = [...root.querySelectorAll(".owl-lid")];

  /* eyes follow the pointer */
  let px = innerWidth / 2, py = innerHeight / 2, lookOverride = null;
  addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
  const look = () => {
    pupils.forEach((p) => {
      const eye = p.parentNode.querySelector("circle").getBoundingClientRect();
      const cx = eye.left + eye.width / 2, cy = eye.top + eye.height / 2;
      let dx, dy;
      if (lookOverride) [dx, dy] = lookOverride;
      else {
        const ang = Math.atan2(py - cy, px - cx), dist = Math.min(1, Math.hypot(px - cx, py - cy) / 220);
        dx = Math.cos(ang) * 5 * dist; dy = Math.sin(ang) * 5 * dist;
      }
      p.style.transform = `translate(${dx}px,${dy}px)`;
    });
    requestAnimationFrame(look);
  };
  look();
  const blink = () => {
    lids.forEach((l) => l.classList.add("shut"));
    setTimeout(() => lids.forEach((l) => l.classList.remove("shut")), 140);
    setTimeout(blink, 2500 + Math.random() * 4000);
  };
  setTimeout(blink, 2000);

  /* state + bubble */
  const LABELS = { listening: "🎙️ Listening… just talk", thinking: "🦉 Thinking…", speaking: "🔊 Uli", idle: "" };
  const setState = (s) => {
    root.dataset.state = s;
    lookOverride = s === "thinking" ? [2, -4] : null;
    statusEl.textContent = LABELS[s] || "";
  };
  const show = (text) => { bubble.hidden = false; if (text !== undefined) caption.textContent = text; };
  setState("idle");

  /* voice out: Indian English */
  const synth = window.speechSynthesis;
  let voice = null;
  const pickVoice = () => {
    if (!synth) return;
    const vs = synth.getVoices();
    voice =
      vs.find((v) => /en[-_]IN/i.test(v.lang) && /Tara|Veena|Neerja|Heera|Isha|Kajal|Female/i.test(v.name)) ||
      vs.find((v) => /en[-_]IN/i.test(v.lang)) ||
      vs.find((v) => /India|Rishi|Veena|Prabhat|Neerja|Heera|Ravi/i.test(v.name)) ||
      vs.find((v) => /^en/i.test(v.lang)) || null;
  };
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }
  // Pre-recorded clips (Tara, Indian English) so every visitor hears the same natural voice.
  // Falls back to the browser's own voice only if a clip is missing.
  let audio = null;
  const playClip = (clean) => new Promise((resolve) => {
    if (audio) { audio.pause(); audio = null; }
    const a = new Audio(`voice/${clipId(clean)}.m4a`);
    audio = a;
    let started = false;
    a.onplaying = () => (started = true);
    a.onended = a.onpause = () => resolve(true);
    a.onerror = () => resolve(started ? true : false);
    a.play().catch(() => resolve(false));
  });
  const speak = (text, recorded = true) => new Promise(async (done) => {
    const clean = spoken(text);
    setState("speaking");
    if (recorded && await playClip(clean)) return done();
    if (!active && root.dataset.state !== "speaking") return done();
    if (!synth) { setTimeout(done, Math.min(4000, 600 + clean.length * 25)); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : "en-IN";
    u.rate = 0.98; u.pitch = 1.0;
    let finished = false;
    const end = () => { if (!finished) { finished = true; done(); } };
    u.onend = u.onerror = end;
    // Safari sometimes never fires onend for long utterances
    setTimeout(end, 1500 + clean.length * 90);
    synth.speak(u);
  });

  /* voice in */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, active = false, greeted = false, misses = 0;

  const listen = () => new Promise((resolve) => {
    if (!SR) return resolve({ error: "unsupported" });
    rec = new SR();
    rec.lang = "en-IN"; rec.interimResults = true; rec.maxAlternatives = 1; rec.continuous = false;
    let finalText = "", interim = "", error = null;
    rec.onstart = () => { setState("listening"); show(""); };
    rec.onresult = (e) => {
      interim = "";
      for (const r of e.results) { if (r.isFinal) finalText += r[0].transcript; else interim += r[0].transcript; }
      caption.textContent = "“" + (finalText || interim) + "”";
    };
    rec.onerror = (e) => { error = e.error; };
    rec.onend = () => { rec = null; resolve({ text: (finalText || interim).trim(), error }); };
    try { rec.start(); } catch { resolve({ error: "busy" }); }
  });

  /* ---------------- smart answers (Gemini via Cloudflare Worker) ---------------- */
  // Set to the deployed worker's /chat URL. Empty = built-in answers only.
  const AI_URL = "https://gyani.anuragkushwah134.workers.dev/chat";
  const history = []; // [{role: "user"|"model", text}]
  const LOCAL_FIRST = new Set(["greet", "bye", "thanks", "owl", "joke"]); // instant, recorded-voice replies
  const askAI = async (q) => {
    if (!AI_URL) return null;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    try {
      const r = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history.slice(-8), { role: "user", text: q }] }),
        signal: ctrl.signal,
      });
      if (!r.ok) return null;
      const d = await r.json();
      return typeof d.reply === "string" && d.reply.trim() ? d.reply.trim() : null;
    } catch { return null; } finally { clearTimeout(t); }
  };

  const respond = async (q) => {
    setState("thinking");
    show("“" + q + "”");
    const local = answer(q);
    let text = null, act, fromAI = false;
    if (!(local.id && LOCAL_FIRST.has(local.id))) { text = await askAI(q); fromAI = !!text; }
    if (!text) { text = local.text; act = local.act; }
    else if (/\b(email|contact|reach|hire)\b/i.test(q)) act = "copy";
    history.push({ role: "user", text: q }, { role: "model", text });
    if (history.length > 16) history.splice(0, history.length - 16);
    show(text);
    if (act === "copy") { try { await navigator.clipboard.writeText(EMAIL); } catch {} }
    await speak(text, !fromAI);
    return act;
  };

  let conversation = async () => {
    active = true;
    root.classList.add("open");
    if (!greeted) {
      greeted = true;
      const hi = SR ? LINES.hi : LINES.hiNoMic;
      show(hi);
      await speak(hi);
    }
    if (!SR) { return typeMode(); }
    while (active) {
      const { text, error } = await listen();
      if (!active) break;
      if (error === "not-allowed" || error === "service-not-allowed") {
        const m = LINES.mic;
        show(m); await speak(m); return typeMode();
      }
      if (!text) {
        if (++misses >= 2) { stop("Tap me whenever you want to talk again 🦉"); break; }
        const m = LINES.miss;
        show(m); await speak(m); continue;
      }
      misses = 0;
      const act = await respond(text);
      if (act === "close") { stop(); break; }
    }
  };

  const typeMode = () => {
    typeForm.hidden = false;
    setState("idle");
    statusEl.textContent = "⌨️ Ask me anything";
    setTimeout(() => input.focus(), 30);
  };

  const stop = (msg) => {
    active = false; misses = 0;
    if (rec) { try { rec.abort(); } catch {} rec = null; }
    if (synth) synth.cancel();
    if (audio) { audio.pause(); audio = null; }
    setState("idle");
    root.classList.remove("open");
    if (msg) { show(msg); statusEl.textContent = ""; setTimeout(() => { if (!active && typeForm.hidden) bubble.hidden = true; }, 3500); }
    else if (typeForm.hidden) bubble.hidden = true;
  };

  btn.addEventListener("click", () => {
    if (active) stop();
    else { typeForm.hidden = true; conversation(); }
  });
  $(".owl-stop").addEventListener("click", () => { typeForm.hidden = true; stop(); });
  $(".owl-kbd").addEventListener("click", () => {
    active = false;
    if (rec) { try { rec.abort(); } catch {} }
    if (synth) synth.cancel();
    if (audio) { audio.pause(); audio = null; }
    bubble.hidden = false;
    typeMode();
  });
  typeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim(); input.value = "";
    if (!q) return;
    const act = await respond(q);
    if (act === "close") { typeForm.hidden = true; stop(); return; }
    if (!bubble.hidden) typeMode();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !bubble.hidden) { typeForm.hidden = true; stop(); } });

  /* ---------------- callouts: "I'm actually something" ---------------- */
  const tag = document.createElement("button");
  tag.className = "owl-callout";
  tag.hidden = true;
  root.appendChild(tag);
  const CALLOUTS = ["Psst… I talk! Tap me 🎙️", "I'm Uli — ask me about Anurag 🦉", "Not just decoration. Tap & talk!", "I know his whole resume 👀", "Hiring? Ask me anything ✨", "Tap me — I speak with an Indian accent 😄"];
  let ci = Math.random() * CALLOUTS.length | 0;
  const callout = () => {
    tag.textContent = CALLOUTS[ci++ % CALLOUTS.length];
    tag.hidden = false;
    clearTimeout(callout.t);
    callout.t = setTimeout(() => (tag.hidden = true), 3800);
  };
  tag.addEventListener("click", () => { tag.hidden = true; if (!active) { typeForm.hidden = true; conversation(); } });

  /* ---------------- wandering ---------------- */
  const SIZE = () => btn.getBoundingClientRect().width || 84;
  const pos = { x: 0, y: 0 };
  const placeBubble = () => {
    root.classList.toggle("b-left", pos.x + SIZE() / 2 < innerWidth / 2);
    root.classList.toggle("b-below", pos.y < 300);
  };
  const moveTo = (x, y, instant) => {
    const s = SIZE();
    x = Math.max(12, Math.min(innerWidth - s - 12, x));
    y = Math.max(72, Math.min(innerHeight - s - 18, y));
    const dist = Math.hypot(x - pos.x, y - pos.y);
    if (!instant && dist > 8) {
      root.classList.toggle("face-left", x < pos.x);
      root.classList.add("flying");
      clearTimeout(moveTo.t);
      moveTo.t = setTimeout(() => {
      root.classList.remove("flying"); root.classList.add("hop");
      setTimeout(() => root.classList.remove("hop"), 450);
      if (!active && bubble.hidden && Math.random() < 0.7) callout();
    }, 2600);
    }
    root.classList.toggle("no-anim", !!instant);
    pos.x = x; pos.y = y;
    root.style.transform = `translate(${x}px,${y}px)`;
    placeBubble();
  };
  const home = (instant) => moveTo(innerWidth - SIZE() - 18, innerHeight - SIZE() - 18, instant);
  home(true);
  addEventListener("resize", () => (active ? home(true) : moveTo(pos.x, pos.y, true)));

  let hovering = false;
  btn.addEventListener("pointerenter", () => (hovering = true));
  btn.addEventListener("pointerleave", () => (hovering = false));
  const wander = () => {
    const busy = active || hovering || !bubble.hidden || document.hidden;
    if (!busy && !reduced) {
      const s = SIZE(), margin = 24;
      // mostly hug the edges, sometimes perch somewhere in the middle
      const r = Math.random();
      let x, y;
      if (r < 0.35) { x = Math.random() < 0.5 ? margin : innerWidth - s - margin; y = 90 + Math.random() * (innerHeight - s - 120); }
      else if (r < 0.75) { x = margin + Math.random() * (innerWidth - s - margin * 2); y = innerHeight - s - 18; }
      else { x = margin + Math.random() * (innerWidth - s - margin * 2); y = 90 + Math.random() * (innerHeight - s - 120); }
      // on phones keep to the lower part of the screen so it never covers what you are reading
      if (innerWidth <= 600) y = innerHeight - s - 18 - Math.random() * Math.min(160, innerHeight * 0.2);
      moveTo(x, y);
    }
    setTimeout(wander, 7000 + Math.random() * 6000);
  };
  setTimeout(wander, 6000);

  // start a conversation from home base so the bubble always fits
  const _conversation = conversation;
  conversation = async () => { home(); await new Promise((r) => setTimeout(r, pos.x === innerWidth - SIZE() - 18 ? 0 : 400)); return _conversation(); };

  /* one-time teaser */
  let teased = false;
  try { teased = sessionStorage.getItem("owl-teased") === "1"; } catch {}
  if (!teased) setTimeout(() => {
    if (active || !bubble.hidden) return;
    statusEl.textContent = "";
    show("Tap me and just talk! 🦉 Ask me anything about Anurag.");
    try { sessionStorage.setItem("owl-teased", "1"); } catch {}
    setTimeout(() => { if (!active && typeForm.hidden) bubble.hidden = true; }, 6000);
  }, 4500);

  // hooks for the terminal + command palette
  window.openOwl = () => { if (!active) { typeForm.hidden = true; conversation(); } };
  window.askOwl = (q) => { bubble.hidden = false; respond(q).then(() => { if (!bubble.hidden) typeMode(); }); };
})();
