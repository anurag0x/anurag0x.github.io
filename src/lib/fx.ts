// Full-screen canvas effects: confetti ("sudo hire-me", chaos mode) and the matrix rain.
import { prefersReducedMotion } from "./browser";

function overlayCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  Object.assign(c.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "170" });
  c.width = innerWidth;
  c.height = innerHeight;
  document.body.appendChild(c);
  return [c, c.getContext("2d")!];
}

export function confetti(): void {
  if (prefersReducedMotion()) return;
  const [c, g] = overlayCanvas();
  const cols = ["#c6ff3d", "#8b6cff", "#ff4fa3", "#38bdf8", "#f2f0ea"];
  const bits = Array.from({ length: 160 }, () => ({
    x: c.width / 2, y: c.height * 0.6,
    vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 18 - 6,
    s: Math.random() * 6 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    col: cols[(Math.random() * cols.length) | 0],
  }));
  let f = 0;
  const step = () => {
    g.clearRect(0, 0, c.width, c.height);
    for (const b of bits) {
      b.vy += 0.45; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      g.save(); g.translate(b.x, b.y); g.rotate(b.r); g.fillStyle = b.col; g.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); g.restore();
    }
    if (++f < 180) requestAnimationFrame(step); else c.remove();
  };
  step();
}

export function matrix(): void {
  if (prefersReducedMotion()) return;
  const [c, g] = overlayCanvas();
  c.style.background = "rgba(0,0,0,.85)";
  const fs = 16;
  const drops = Array.from({ length: Math.ceil(c.width / fs) }, () => Math.random() * -40);
  const chars = "アカサタナハマヤラワ0123456789ANURAG<>/{}";
  let f = 0;
  const step = () => {
    g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "#c6ff3d"; g.font = fs + "px JetBrains Mono, monospace";
    drops.forEach((d, i) => {
      g.fillText(chars[(Math.random() * chars.length) | 0], i * fs, d * fs);
      drops[i] = d * fs > c.height && Math.random() > 0.975 ? 0 : d + 1;
    });
    if (++f < 260) requestAnimationFrame(step);
    else { c.style.transition = "opacity .6s"; c.style.opacity = "0"; setTimeout(() => c.remove(), 600); }
  };
  step();
}
