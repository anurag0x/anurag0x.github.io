"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ORBITS, STACK_GROUPS } from "@/data/stack";

export function Stack() {
  const orbitRef = useRef<HTMLDivElement>(null);

  // planets are positioned with calc(var(--orb) * r), so keep --orb equal to the orbit's width
  useEffect(() => {
    const el = orbitRef.current!;
    const ro = new ResizeObserver(() => el.style.setProperty("--orb", el.clientWidth + "px"));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="stack" className="section stack">
      <div className="section-tag">04 / stack</div>
      <h2 className="big reveal">The <em>orbit</em>.</h2>
      <p className="muted reveal">Node.js at the core. Everything else in orbit. Hover to freeze time.</p>
      <div className="orbit-wrap reveal">
        <div className="orbit" ref={orbitRef}>
          <div className="core">Node.js</div>
          {ORBITS.map((o) => [
            <div key={`ring-${o.r}`} className="ring" style={{ width: `${o.r * 200}%`, height: `${o.r * 200}%` }} />,
            <div key={`spin-${o.r}`} className="ring-spin" style={{ "--dur": `${o.dur}s` } as CSSProperties}>
              {o.items.map((name, i) => {
                const a = (360 / o.items.length) * i;
                return (
                  <div key={name} className="planet" style={{ transform: `rotate(${a}deg) translateX(calc(var(--orb) * ${o.r})) rotate(${-a}deg)` }}>
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>,
          ])}
        </div>
      </div>
      <div className="reveal grid grid-cols-1 gap-3 tab:grid-cols-2 desk:grid-cols-5">
        {STACK_GROUPS.map((g) => (
          <div
            key={g.name}
            className="group rounded-2xl tab:last:col-span-2 desk:last:col-span-1 border border-solid border-line bg-ink-2 p-5 transition-colors duration-300 hover:border-acid/60"
          >
            <h3 className="mb-3 flex items-center gap-2 font-mono text-[13px] font-normal text-acid">
              <span className="size-1.5 rounded-full bg-acid shadow-[0_0_10px_var(--color-acid)]" />
              {g.name}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.split(" · ").map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-solid border-line px-2.5 py-1 text-[12.5px] leading-tight text-muted group-hover:text-paper"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
