"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { FILTERS, PROJECTS, type ProjectFilter } from "@/data/projects";
import { on } from "@/lib/bus";
import { hasFinePointer } from "@/lib/browser";

const tiltOn = () => hasFinePointer();

function tilt(e: MouseEvent<HTMLElement>) {
  if (!tiltOn()) return;
  const c = e.currentTarget, r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  c.style.setProperty("--mx", x + "px");
  c.style.setProperty("--my", y + "px");
  c.style.transform = `perspective(900px) rotateX(${(y / r.height - 0.5) * -7}deg) rotateY(${(x / r.width - 0.5) * 7}deg)`;
}

export function Work() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  useEffect(() => on("work:filter", setFilter), []);

  return (
    <section id="work" className="section">
      <div className="section-tag">03 / work</div>
      <h2 className="big reveal">Services I&apos;ve <em>shipped</em>.</h2>
      <div className="filters reveal" role="tablist">
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip${filter === f.id ? " active" : ""}`} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
      </div>
      <div className="cards">
        {PROJECTS.map((p) => (
          <article
            key={p.title}
            className={`card reveal${filter !== "all" && p.cat !== filter ? " hide" : ""}`}
            onMouseMove={tilt}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
          >
            <div className="meta">
              <span>{p.org}</span>
              {p.badge ? <span className="badge">● {p.badge}</span> : <span>{p.cat}</span>}
            </div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="metric">{p.metric}</div>
            <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
            {(p.live || p.code) && (
              <div className="links">
                {p.live && <a href={p.live} target="_blank" rel="noopener">live ↗</a>}
                {p.code && <a href={p.code} target="_blank" rel="noopener">code ↗</a>}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
