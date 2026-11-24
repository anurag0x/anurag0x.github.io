"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SPANS, type Json } from "@/data/career";
import { esc } from "@/lib/browser";

// Pretty-prints span attributes as syntax-highlighted JSON (all values escaped).
function pretty(o: Json, ind = 0): string {
  const pad = "  ".repeat(ind);
  if (Array.isArray(o)) return "[\n" + o.map((v) => pad + "  " + pretty(v, ind + 1)).join(",\n") + "\n" + pad + "]";
  if (o && typeof o === "object")
    return "{\n" + Object.entries(o).map(([k, v]) => `${pad}  <span class="k">"${esc(k)}"</span>: ${pretty(v, ind + 1)}`).join(",\n") + "\n" + pad + "}";
  if (typeof o === "number") return `<span class="n">${o}</span>`;
  return `<span class="s">"${esc(o)}"</span>`;
}

export function Trace() {
  const viewRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setInView(true);
      setActive((a) => a ?? "animall");
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(viewRef.current!);
    return () => io.disconnect();
  }, []);

  const inspector = useMemo(() => {
    const s = SPANS.find((x) => x.id === active);
    if (!s) return "// click a span ↑";
    return `<span class="k">span</span> ${esc(s.name)}  <span class="s">${s.live ? "● running" : "✓ 200"}</span>\n` + pretty(s.attrs);
  }, [active]);

  return (
    <section id="trace" className="section">
      <div className="section-tag">02 / experience</div>
      <h2 className="big reveal">My career, as a <em>trace</em>.</h2>
      <p className="muted reveal">Every engineer&apos;s career is a distributed system. Here&apos;s mine, rendered like an LLM trace. Click a span to inspect it.</p>
      <div className={`trace reveal${inView ? " in" : ""}`} ref={viewRef}>
        <div className="trace-head">
          <span>trace_id: <b>anurag-kushwah</b></span>
          <span className="ok">● status: 200 OK</span>
        </div>
        <div>
          {SPANS.map((s, i) => (
            <button key={s.id} className={`span-row${active === s.id ? " active" : ""}`} aria-label={`Inspect ${s.name}`} onClick={() => setActive(s.id)}>
              <span className="span-name" style={{ paddingLeft: s.depth * 18 }}>
                {s.depth ? "└ " : ""}<span className="kind">{s.kind}</span>{s.name}
              </span>
              <span className="span-track">
                <span
                  className={`span-bar${s.live ? " live" : ""}`}
                  style={{ left: `${s.start}%`, width: `${s.len}%`, backgroundColor: s.color, transitionDelay: `${i * 70}ms` }}
                />
              </span>
            </button>
          ))}
        </div>
        <pre className="inspector" aria-live="polite" dangerouslySetInnerHTML={{ __html: inspector }} />
      </div>
    </section>
  );
}
