"use client";

// Page-wide behaviour that isn't tied to one section: scroll reveals and counters, magnetic buttons,
// the target-lock cursor, the frosted nav, chaos mode, confetti/matrix and "ask the owl" links.
import { useEffect } from "react";
import { EMAIL } from "@/data/site";
import { emit, on } from "@/lib/bus";
import { hasFinePointer, prefersReducedMotion } from "@/lib/browser";
import { confetti, matrix } from "@/lib/fx";

function countUp(el: HTMLElement, reduced: boolean) {
  const target = Number(el.dataset.count), suf = el.dataset.suffix || "";
  if (reduced) { el.textContent = target + suf; return; }
  const t0 = performance.now();
  const f = (t: number) => {
    const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 4);
    el.textContent = Math.round(target * e) + suf;
    if (k < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

function lockCursor(signal: AbortSignal) {
  document.body.classList.add("lock-cursor");
  const core = document.createElement("div"); core.className = "cur-core";
  const lock = document.createElement("div"); lock.className = "cur-lock"; lock.innerHTML = "<i></i><i></i><i></i><i></i>";
  document.body.append(lock, core);
  const TARGETS = "a,button,.card,.play-card,.span-row,.planet span,.chip,.owl-teaser";
  let mx = -100, my = -100, lastBitX = 0, lastBitY = 0, spin = 0, target: Element | null = null;
  const box = { x: -100, y: -100, w: 30, h: 30 };
  const opt = { signal, passive: true };
  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    const el = e.target as Element;
    target = el.closest?.(TARGETS) ?? null;
    const inField = !!el.closest?.("input,textarea");
    core.classList.toggle("cur-hidden", inField);
    lock.classList.toggle("cur-hidden", inField);
    if (Math.hypot(mx - lastBitX, my - lastBitY) > 26) {
      lastBitX = mx; lastBitY = my;
      const b = document.createElement("span");
      b.className = "cur-bit";
      b.textContent = Math.random() < 0.5 ? "0" : "1";
      b.style.left = mx + "px"; b.style.top = my + "px";
      b.style.setProperty("--bx", (Math.random() - 0.5) * 30 + "px");
      b.style.setProperty("--by", -(Math.random() * 24 + 8) + "px");
      document.body.appendChild(b);
      b.addEventListener("animationend", () => b.remove());
    }
  }, opt);
  document.addEventListener("pointerleave", () => { core.classList.add("cur-hidden"); lock.classList.add("cur-hidden"); }, opt);
  document.addEventListener("pointerenter", () => { core.classList.remove("cur-hidden"); lock.classList.remove("cur-hidden"); }, opt);
  addEventListener("pointerdown", () => lock.classList.add("press"), opt);
  addEventListener("pointerup", () => lock.classList.remove("press"), opt);
  const frame = () => {
    if (signal.aborted) return;
    let tx: number, ty: number, tw: number, th: number;
    if (target?.isConnected) {
      const r = target.getBoundingClientRect(), pad = 6;
      tx = r.left - pad; ty = r.top - pad; tw = r.width + pad * 2; th = r.height + pad * 2;
      if (tw > 520 || th > 420) { tx = mx - 22; ty = my - 22; tw = th = 44; } // big cards: smaller lock around the pointer
    } else { tx = mx - 15; ty = my - 15; tw = th = 30; }
    const k = target ? 0.28 : 0.2;
    box.x += (tx - box.x) * k; box.y += (ty - box.y) * k; box.w += (tw - box.w) * k; box.h += (th - box.h) * k;
    spin = target ? spin * 0.8 : (spin + 1.6) % 360;
    lock.classList.toggle("locked", !!target);
    lock.style.transform = `translate(${box.x}px,${box.y}px) rotate(${spin}deg)`;
    lock.style.width = box.w + "px"; lock.style.height = box.h + "px";
    lock.style.transformOrigin = `${box.w / 2}px ${box.h / 2}px`;
    core.style.transform = `translate(${mx}px,${my}px) rotate(45deg) scale(${target ? 0.6 : 1})`;
    requestAnimationFrame(frame);
  };
  frame();
  signal.addEventListener("abort", () => { core.remove(); lock.remove(); document.body.classList.remove("lock-cursor"); });
}

export function Effects() {
  useEffect(() => {
    const reduced = prefersReducedMotion(), fine = hasFinePointer();
    const ac = new AbortController(), { signal } = ac;

    // reveal on scroll (+ count-up stats). data-in, not a class, so React re-renders never wipe it.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute("data-in", "");
        e.target.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => countUp(el, reduced));
        io.unobserve(e.target);
      }
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    if (fine && !reduced) {
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
        }, { signal });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; }, { signal });
      });
      lockCursor(signal);
    }

    // frosted nav once the page scrolls
    const nav = document.querySelector(".nav");
    const onScroll = () => nav?.classList.toggle("scrolled", scrollY > 40);
    addEventListener("scroll", onScroll, { passive: true, signal });
    onScroll();

    // "ask the owl" buttons
    document.addEventListener("click", (e) => {
      const b = (e.target as Element).closest<HTMLElement>("[data-ask]");
      if (b?.dataset.ask) emit("owl:ask", b.dataset.ask);
    }, { signal });

    let chaos = false;
    const offs = [
      on("chaos:toggle", () => {
        chaos = !chaos;
        document.body.classList.toggle("chaos", chaos);
        emit("toast", chaos ? "🌀 CHAOS MODE — konami/‘chaos’ again to stop" : "order restored");
        emit("chaos", chaos);
        if (chaos) confetti();
      }),
      on("confetti", confetti),
      on("matrix", matrix),
    ];

    console.log("%c hey, you found the console 👀 ", "background:#c6ff3d;color:#07070a;font:600 14px monospace;padding:6px 10px;border-radius:6px");
    console.log("%cpress ` to open the terminal, or just email " + EMAIL, "color:#8b6cff;font:12px monospace");

    return () => { ac.abort(); io.disconnect(); offs.forEach((f) => f()); document.body.classList.remove("chaos"); };
  }, []);
  return null;
}
