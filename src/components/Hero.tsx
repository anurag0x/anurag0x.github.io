"use client";

import { useEffect, useRef } from "react";
import { RESUME_URL } from "@/data/site";
import { on } from "@/lib/bus";

const WORDS = ["backends", "frontends", "mobile apps", "AI pipelines", "real-time apps", "anything"];
const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";
const LINK = 130;

interface Node { x: number; y: number; vx: number; vy: number; r: number }
interface Packet { a: Node; b: Node; t: number }
interface Ripple { x: number; y: number; t: number }

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrambleRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  // IST clock
  useEffect(() => {
    const el = clockRef.current!;
    const fmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
    const tick = () => { el.textContent = `Gurugram ${fmt.format(new Date())} IST`; };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  // word scramble
  useEffect(() => {
    const el = scrambleRef.current!;
    let wi = 0, alive = true, timer: ReturnType<typeof setTimeout>;
    const scramble = (to: string) => new Promise<void>((done) => {
      const from = el.textContent ?? "", len = Math.max(from.length, to.length);
      const q = Array.from({ length: len }, (_, i) => ({ from: from[i] || "", to: to[i] || "", start: (Math.random() * 18) | 0, end: ((Math.random() * 18) | 0) + 18 }));
      let f = 0;
      const step = () => {
        if (!alive) return done();
        let out = "", fin = 0;
        for (const c of q) {
          if (f >= c.end) { fin++; out += c.to; }
          else if (f >= c.start) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          else out += c.from;
        }
        el.textContent = out;
        if (fin === q.length) return done();
        f++; requestAnimationFrame(step);
      };
      step();
    });
    const loop = async () => {
      wi = (wi + 1) % WORDS.length;
      await scramble(WORDS[wi]);
      if (alive) timer = setTimeout(loop, 2200);
    };
    timer = setTimeout(loop, 2200);
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  // living network
  useEffect(() => {
    const hero = heroRef.current!, cv = canvasRef.current!, ctx = cv.getContext("2d")!;
    const ac = new AbortController(), opt = { signal: ac.signal };
    let W = 0, H = 0, nodes: Node[] = [], packets: Packet[] = [], ripples: Ripple[] = [];
    const mouse = { x: -9999, y: -9999 };
    let chaos = false, heroVisible = true, drawing = false, alive = true;

    // resizing a canvas wipes it; make sure a frame is drawn again afterwards
    function startDrawSoon() { requestAnimationFrame(() => { if (!drawing) { drawing = true; draw(); } }); }
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2), sameWidth = cv.clientWidth === W && nodes.length > 0;
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (sameWidth) { if (!drawing) startDrawSoon(); return; } // phone address bar showing/hiding: keep the dots where they are
      // Count scales with area, so phones used to get only ~20 faint dots: give small screens
      // a denser field and slightly bigger dots so the network is actually visible.
      const small = W <= 600;
      const n = Math.round(Math.min(110, Math.max(small ? 55 : 0, (W * H) / (small ? 7000 : 14000))));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + (small ? 1.1 : 0.6) }));
    };
    hero.addEventListener("mousemove", (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, opt);
    hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; }, opt);
    // phones have no mouse: let a finger pull the dots around too
    const touch = (e: TouchEvent) => { const t = e.touches[0], r = cv.getBoundingClientRect(); if (t) { mouse.x = t.clientX - r.left; mouse.y = t.clientY - r.top; } };
    hero.addEventListener("touchstart", touch, { ...opt, passive: true });
    hero.addEventListener("touchmove", touch, { ...opt, passive: true });
    hero.addEventListener("touchend", () => { mouse.x = mouse.y = -9999; }, opt);
    hero.addEventListener("click", (e) => {
      if ((e.target as Element).closest("a,button")) return;
      const r = cv.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
    }, opt);

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);
      const acid = chaos ? `hsl(${(performance.now() / 8) % 360},100%,60%)` : "#c6ff3d";
      for (const p of nodes) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 180) { p.vx += (dx / d) * 0.02; p.vy += (dy / d) * 0.02; }
        for (const rp of ripples) {
          const rx = p.x - rp.x, ry = p.y - rp.y, rd = Math.hypot(rx, ry);
          if (Math.abs(rd - rp.t * 9) < 30 && rd > 0) { p.vx += (rx / rd) * 1.2; p.vy += (ry / rd) * 1.2; }
        }
        p.vx *= 0.985; p.vy *= 0.985;
        // cap the speed so a tap's ripple nudges the dots instead of flinging them all off-screen
        const v = Math.hypot(p.vx, p.vy), maxV = W <= 600 ? 2.2 : 4;
        if (v > maxV) { p.vx *= maxV / v; p.vy *= maxV / v; }
        if (Math.hypot(p.vx, p.vy) < 0.15) { p.vx += (Math.random() - 0.5) * 0.05; p.vy += (Math.random() - 0.5) * 0.05; }
        const k = chaos ? 4 : 1;
        p.x += p.vx * k; p.y += p.vy * k;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        p.x = Math.max(0, Math.min(W, p.x)); p.y = Math.max(0, Math.min(H, p.y));
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(139,108,255,${(1 - d / LINK) * 0.35})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (packets.length < 40 && Math.random() < 0.0009) packets.push({ a, b, t: 0 });
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 200) {
          ctx.strokeStyle = `rgba(198,255,61,${(1 - md / 200) * 0.6})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = md < 200 ? acid : "rgba(242,240,234,.55)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
      }
      ctx.fillStyle = acid;
      packets = packets.filter((k) => {
        k.t += 0.02;
        const x = k.a.x + (k.b.x - k.a.x) * k.t, y = k.a.y + (k.b.y - k.a.y) * k.t;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.283); ctx.fill();
        return k.t < 1;
      });
      ripples = ripples.filter((rp) => {
        rp.t++;
        ctx.strokeStyle = `rgba(198,255,61,${Math.max(0, 1 - rp.t / 60)})`;
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.t * 9, 0, 6.283); ctx.stroke();
        return rp.t < 60;
      });
      if (heroVisible) requestAnimationFrame(draw); else drawing = false;
    };
    const startDraw = () => { if (!drawing) { drawing = true; requestAnimationFrame(draw); } };

    resize();
    addEventListener("resize", resize, opt);
    const io = new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; if (heroVisible) startDraw(); });
    io.observe(hero);
    const offChaos = on("chaos", (isOn) => {
      chaos = isOn;
      if (isOn) nodes.forEach((n) => { n.vx *= 6; n.vy *= 6; });
    });
    return () => { alive = false; ac.abort(); io.disconnect(); offChaos(); };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <canvas id="particles" ref={canvasRef} aria-hidden="true" />
      <div className="hero-inner">
        <p className="status">
          <span className="pulse" /> shipping @ <b>Animall</b>
          <span className="when"> · <span ref={clockRef}>Gurugram</span></span>
        </p>
        <h1 className="hero-title">
          <span className="line">I build</span>
          <span className="line"><span className="scramble" ref={scrambleRef}>backends</span></span>
          <span className="line">that <em>don&apos;t</em> fall over.</span>
        </h1>
        <p className="hero-sub">
          Anurag Kushwah — a tech all-rounder. Backend, frontend, mobile, AI, cloud: if it&apos;s tech, I can build it. 3+ years shipping with
          Node.js, Python, React, Flutter, Postgres, Redis &amp; Kafka.
        </p>
        <div className="hero-cta">
          <a href="#work" className="btn btn-solid magnetic">see the work ↓</a>
          <a href={RESUME_URL} download className="btn btn-ghost magnetic">download resume ⤓</a>
          <button className="btn btn-ghost magnetic" data-open="terminal">open terminal &gt;_</button>
        </div>
      </div>
      <p className="hint">psst — move your mouse. talk to the owl ↘ try the <kbd>~</kbd> key. or the konami code.</p>
    </section>
  );
}
