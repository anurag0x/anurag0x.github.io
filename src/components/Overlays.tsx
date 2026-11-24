"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { EMAIL, LINKS, type SectionId } from "@/data/site";
import { copyEmail, downloadResume, draftEmail, esc, openTab, scrollToSection } from "@/lib/browser";
import { emit, on, type Overlay } from "@/lib/bus";
import { COMMANDS } from "./terminal-commands";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

interface Line { html: string; cls: "out" | "cmd" }
interface Action { label: string; hint: string; run: () => void }

export function Overlays() {
  const [open, setOpen] = useState<Overlay | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const chaosOn = useRef(false);

  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus?.();
  }, []);
  const show = useCallback((o: Overlay) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpen(o);
  }, []);

  useEffect(() => {
    const offs = [on("overlay:open", show), on("overlay:close", close), on("chaos", (v) => { chaosOn.current = v; })];
    // any element with data-open="terminal|palette" opens that overlay
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      const o = t.closest<HTMLElement>("[data-open]");
      if (o) show(o.dataset.open as Overlay);
    };
    let kp = 0;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((cur) => (cur === "palette" ? null : ((lastFocus.current = document.activeElement as HTMLElement), "palette")));
        return;
      }
      if (e.key === "Escape") { close(); return; }
      const typing = (e.target as Element).matches?.("input,textarea");
      if (typing) return;
      if (e.key === "`" || e.key === "~") { e.preventDefault(); show("terminal"); return; }
      kp = e.key === KONAMI[kp] ? kp + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (kp === KONAMI.length) { kp = 0; emit("chaos:toggle"); }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { offs.forEach((f) => f()); document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, [show, close]);

  const onBackdrop = (e: React.MouseEvent) => { if (e.target === e.currentTarget) close(); };

  return (
    <>
      <div className="overlay" role="dialog" aria-modal="true" aria-label="Terminal" hidden={open !== "terminal"} onClick={onBackdrop}>
        {open === "terminal" && <Terminal close={close} chaosOn={() => chaosOn.current} />}
      </div>
      <div className="overlay" role="dialog" aria-modal="true" aria-label="Command palette" hidden={open !== "palette"} onClick={onBackdrop}>
        {open === "palette" && <Palette close={close} openTerminal={() => setOpen("terminal")} />}
      </div>
    </>
  );
}

// Terminal output survives closing and reopening, like the original.
const termLines: Line[] = [];
const termHistory: string[] = [];

function Terminal({ close, chaosOn }: { close: () => void; chaosOn: () => boolean }) {
  const [lines, setLines] = useState<Line[]>(() => {
    if (!termLines.length) {
      termLines.push(
        { html: `<span class="acc">anurag-os v4.0</span> — booted in 0.42s · uptime: 3+ years · now on Next.js + TypeScript`, cls: "out" },
        { html: `type <span class="acc">help</span> to see what this thing can do.\n`, cls: "out" },
      );
    }
    return [...termLines];
  });
  const [value, setValue] = useState("");
  const hi = useRef(termHistory.length);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { const b = bodyRef.current; if (b) b.scrollTop = b.scrollHeight; }, [lines]);

  const print = (...add: Line[]) => { termLines.push(...add); setLines([...termLines]); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const raw = value.trim();
    setValue("");
    const echo: Line = { html: `<span class="acc">❯</span> ${esc(raw)}`, cls: "cmd" };
    if (!raw) return print(echo);
    termHistory.push(raw);
    hi.current = termHistory.length;
    const [c, ...args] = raw.split(/\s+/);
    if (c === "clear") { termLines.length = 0; setLines([]); return; }
    const fn = COMMANDS[c.toLowerCase()];
    const out = fn ? fn(args, { close, history: () => termHistory, chaosOn }) : `command not found: ${esc(c)}. try <span class="acc">help</span>`;
    print(echo, ...(out ? [{ html: out, cls: "out" as const }] : []));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && termHistory.length) { hi.current = Math.max(0, hi.current - 1); setValue(termHistory[hi.current]); e.preventDefault(); }
    if (e.key === "ArrowDown") { hi.current = Math.min(termHistory.length, hi.current + 1); setValue(termHistory[hi.current] ?? ""); e.preventDefault(); }
    if (e.key === "Tab") {
      e.preventDefault();
      const m = Object.keys(COMMANDS).concat("clear").filter((k) => k.startsWith(value));
      if (m.length === 1) setValue(m[0] + " ");
      else if (m.length) print({ html: m.join("  "), cls: "out" });
    }
  };

  return (
    <div className="term">
      <div className="term-bar">
        <i /><i /><i /><span>anurag@portfolio: ~</span>
        <button className="close" onClick={close} aria-label="Close terminal">×</button>
      </div>
      <div className="term-body" ref={bodyRef}>
        {lines.map((l, i) => <div key={i} className={l.cls} dangerouslySetInnerHTML={{ __html: l.html }} />)}
      </div>
      <form className="term-input" autoComplete="off" onSubmit={submit}>
        <span className="prompt">anurag@portfolio:~$</span>
        <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey} spellCheck={false} aria-label="Terminal command" />
      </form>
    </div>
  );
}

function Palette({ close, openTerminal }: { close: () => void; openTerminal: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const go = (id: SectionId) => { close(); scrollToSection(id); };
  const actions: Action[] = [
    { label: "Go to About", hint: "section", run: () => go("about") },
    { label: "Go to Experience trace", hint: "section", run: () => go("trace") },
    { label: "Go to Work", hint: "section", run: () => go("work") },
    { label: "Go to Stack orbit", hint: "section", run: () => go("stack") },
    { label: "Go to Beyond code (who I am, sports & games)", hint: "section", run: () => go("play") },
    { label: "Go to Contact", hint: "section", run: () => go("contact") },
    { label: "Download resume (PDF)", hint: "file", run: () => { close(); downloadResume(); } },
    { label: "Write an email to Anurag", hint: "action", run: () => { close(); draftEmail(); } },
    { label: "Copy email address", hint: "action", run: async () => { close(); emit("toast", (await copyEmail()) ? "email copied 👋" : EMAIL); } },
    { label: "Open GitHub", hint: "link", run: () => { close(); openTab(LINKS.github); } },
    { label: "Open LinkedIn", hint: "link", run: () => { close(); openTab(LINKS.linkedin); } },
    { label: "Open terminal", hint: "~", run: openTerminal },
    { label: "Talk to Uli the owl", hint: "voice", run: () => { close(); emit("owl:open"); } },
    { label: "Filter work: AI / LLM", hint: "filter", run: () => { emit("work:filter", "ai"); go("work"); } },
    { label: "Toggle chaos mode", hint: "secret", run: () => { close(); emit("chaos:toggle"); } },
    { label: "Make it rain", hint: "secret", run: () => { close(); emit("confetti"); } },
  ];
  const items = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));
  const cur = Math.min(sel, Math.max(0, items.length - 1));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const n = Math.max(1, items.length);
    if (e.key === "ArrowDown") { setSel((cur + 1) % n); e.preventDefault(); }
    if (e.key === "ArrowUp") { setSel((cur - 1 + n) % n); e.preventDefault(); }
    if (e.key === "Enter") items[cur]?.run();
  };

  return (
    <div className="pal">
      <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey} placeholder="Type a command or jump to…" spellCheck={false} aria-label="Search commands" />
      <ul role="listbox">
        {items.length ? items.map((a, i) => (
          <li key={a.label} role="option" aria-selected={i === cur} className={i === cur ? "sel" : ""} onClick={a.run} onMouseMove={() => i !== cur && setSel(i)}>
            {a.label}<span>{a.hint}</span>
          </li>
        )) : <li>no matches<span>¯\_(ツ)_/¯</span></li>}
      </ul>
    </div>
  );
}
