(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  /* ---------- data ---------- */
  const EMAIL = "anuragkushwah134@gmail.com";
  const LINKS = {
    github: "https://github.com/anurag0x",
    linkedin: "https://www.linkedin.com/in/anuraagkushwah",
    twitter: "https://twitter.com/anuraag0x",
  };

  // Experience rendered as a trace. start/len are % of the waterfall (no dates on purpose).
  const SPANS = [
    { id: "masai", name: "Masai School", kind: "svc", depth: 0, start: 0, len: 22, color: "#8b6cff",
      attrs: { role: "Software Developer", stack: ["React", "Node.js", "Express", "MongoDB"], did: "Full-stack features for learning & student-management platforms used by thousands of students" } },
    { id: "kapiva", name: "Kapiva Ayurveda", kind: "svc", depth: 0, start: 20, len: 44, color: "#ff4fa3",
      attrs: { role: "Software Development Engineer I", stack: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis", "Kafka", "GCP"], did: "Production backends across healthcare & commerce, 100k+ requests/day", wins: ["25–35% faster APIs via caching + query tuning", "Entra ID SSO, JWT & RBAC across doctor/agent/admin apps", "Helped launch the UK D2C store"] } },
    { id: "carestudio", name: "CareStudio · api-gateway", kind: "op", depth: 1, start: 24, len: 22, color: "#ff4fa3",
      attrs: { what: "Telehealth & doctor consultation platform", did: ["API gateway with dynamic routing over 6+ microservices", "Prescription engine, scheduling & slot management", "Kafka event flows for prescriptions, orders, notifications"], scale: "10,000+ consultations/month" } },
    { id: "nidaan", name: "Nidaan · llm.analyze", kind: "llm", depth: 1, start: 40, len: 14, color: "#ff4fa3",
      attrs: { what: "AI-powered doctor call feedback", did: "LLM analysis of doctor–patient call recordings into structured quality feedback" } },
    { id: "commerce", name: "commerce · checkout", kind: "op", depth: 1, start: 48, len: 14, color: "#ff4fa3",
      attrs: { what: "Checkout & order management", scale: "1,000+ orders/day", stack: ["Node.js", "Kafka", "GCP"] } },
    { id: "kenpath", name: "Kenpath Technologies", kind: "svc", depth: 0, start: 63, len: 16, color: "#38bdf8",
      attrs: { role: "Software Development Engineer", stack: ["Python", "Docker", "Qdrant", "Langfuse"], did: ["Python services for AI document processing & ingestion", "Docker-based CI/CD pipelines", "Beckn Network integrations"] } },
    { id: "ingest", name: "doc-ingest · embed → qdrant", kind: "llm", depth: 1, start: 65, len: 13, color: "#38bdf8",
      attrs: { pipeline: ["extract", "detect language", "translate", "review", "chunk", "embed", "index in Qdrant"], observability: "Langfuse traces", for: "RAG workflows" } },
    { id: "animall", name: "Animall", kind: "svc", depth: 0, start: 79, len: 21, color: "#c6ff3d", live: true,
      attrs: { role: "Software Engineer", status: "in progress", building: "Backend for the Animall Bhai app — helping India's dairy farmers", stack: ["Node.js", "Express", "PostgreSQL", "Redis", "Socket.IO", "Agora", "Cloud Tasks"] } },
    { id: "calls", name: "realtime · calls + chat", kind: "op", depth: 1, start: 81, len: 19, color: "#c6ff3d", live: true,
      attrs: { what: "Voice calls & chat", stack: ["Agora", "Socket.IO", "Redis adapter"], note: "signalling delivered across pods" } },
    { id: "notify", name: "notify · fcm + exotel ivr", kind: "op", depth: 1, start: 83, len: 17, color: "#c6ff3d", live: true,
      attrs: { what: "Push-notification & IVR campaign pipelines", stack: ["Cloud Tasks", "node-cron", "Firebase", "Exotel"] } },
    { id: "support", name: "support · claude.messages", kind: "llm", depth: 1, start: 86, len: 14, color: "#c6ff3d", live: true,
      attrs: { what: "AI-powered support & chat", stack: ["Claude API"] } },
  ];

  const PROJECTS = [
    { cat: "backend", org: "Animall", badge: "live", title: "Real-time calls & chat", desc: "Voice calling and chat for a farmer-facing app, with call signalling that has to arrive no matter which pod you hit.", metric: "Agora · Socket.IO · Redis", tags: ["Node.js", "Socket.IO", "Agora", "Redis"] },
    { cat: "backend", org: "Animall", badge: "live", title: "Notification & IVR pipelines", desc: "Scheduled push campaigns and Exotel IVR dispatch, queued through Cloud Tasks with run-locks so nobody gets spammed twice.", metric: "Cloud Tasks · FCM · Exotel", tags: ["Node.js", "PostgreSQL", "Cloud Tasks"] },
    { cat: "ai", org: "Animall", badge: "live", title: "AI support", desc: "LLM-powered support and chat features built on the Claude API.", metric: "Claude API", tags: ["Node.js", "LLM"] },
    { cat: "ai", org: "Kenpath", title: "Doc ingestion pipeline", desc: "PDFs in, searchable knowledge out: extraction, language detection, translation, review, chunking and embeddings, traced end to end.", metric: "Qdrant · Langfuse · RAG", tags: ["Python", "Qdrant", "Langfuse", "Docker"] },
    { cat: "backend", org: "Kapiva", title: "CareStudio telehealth", desc: "API gateway with dynamic routing over 6+ microservices, a prescription engine, and Kafka event flows.", metric: "10,000+ consultations / month", tags: ["Node.js", "Kafka", "Microservices"] },
    { cat: "ai", org: "Kapiva", title: "Nidaan", desc: "Turns doctor–patient call recordings into structured, actionable quality feedback with LLM analysis.", metric: "LLM call analysis", tags: ["LLM", "Node.js"] },
    { cat: "backend", org: "Kapiva", title: "DocAssist Audit", desc: "Call-audit platform and doctor-performance dashboards; migrated telephony ingestion from Python to Node.js.", metric: "5,000+ calls audited / month", tags: ["React", "Node.js", "MongoDB"] },
    { cat: "backend", org: "Kapiva", title: "Checkout & orders", desc: "Checkout and order-management services with async Kafka workflows, deployed on GCP.", metric: "1,000+ orders / day", tags: ["Node.js", "Kafka", "GCP"] },
    { cat: "backend", org: "Kapiva", title: "SSO & access control", desc: "Microsoft Entra ID SSO, JWT and RBAC for role-scoped access across doctor, agent and admin apps.", metric: "−25–35% API latency (Redis + indexing)", tags: ["Entra ID", "JWT", "RBAC", "Redis"] },
    { cat: "side", org: "side project", title: "Spendwise", desc: "Track spending and investments in one place.", metric: "MERN", tags: ["React", "Node.js", "MongoDB"], live: "https://spendwise-blond.vercel.app/", code: "https://github.com/anurag0x/heady-rabbits-89576" },
    { cat: "side", org: "side project", title: "Hypergo", desc: "A customizable video player with a slick, keyboard-friendly UI.", metric: "React · TS · Redux", tags: ["React", "TypeScript", "Tailwind"], code: "https://github.com/anurag0x/hypergo" },
    { cat: "side", org: "side project", title: "AJIO clone", desc: "A fashion e-commerce storefront, built from scratch.", metric: "HTML · CSS · JS", tags: ["HTML", "CSS", "JS"], live: "https://ajio-clone-bay.vercel.app/", code: "https://github.com/anurag0x/AJIO-Clone" },
  ];

  const ORBITS = [
    { r: 0.30, dur: 40, items: ["Express", "NestJS", "TypeScript", "Python"] },
    { r: 0.43, dur: 60, items: ["PostgreSQL", "Redis", "Kafka", "MongoDB", "Socket.IO"] },
    { r: 0.56, dur: 85, items: ["Qdrant", "RAG", "Langfuse", "Claude API", "GCP", "AWS", "Docker", "React"] },
  ];

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let toastTimer;
  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
  };

  $("#year").textContent = new Date().getFullYear();

  /* ---------- clock ---------- */
  const clock = $("#clock");
  const tick = () => {
    try {
      clock.textContent = "Gurugram " + new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()) + " IST";
    } catch { clock.textContent = "Gurugram"; }
  };
  tick(); setInterval(tick, 15000);

  /* ---------- scramble text ---------- */
  const words = ["backends", "frontends", "mobile apps", "AI pipelines", "real-time apps", "anything"];
  const scr = $("#scramble");
  const glyphs = "!<>-_\\/[]{}—=+*^?#01";
  let wi = 0;
  const scramble = (to) => new Promise((done) => {
    const from = scr.textContent, len = Math.max(from.length, to.length);
    const q = [...Array(len)].map((_, i) => ({ from: from[i] || "", to: to[i] || "", start: Math.random() * 18 | 0, end: (Math.random() * 18 | 0) + 18 }));
    let f = 0;
    const step = () => {
      let out = "", fin = 0;
      for (const c of q) {
        if (f >= c.end) { fin++; out += c.to; }
        else if (f >= c.start) out += glyphs[Math.random() * glyphs.length | 0];
        else out += c.from;
      }
      scr.textContent = out;
      if (fin === q.length) return done();
      f++; requestAnimationFrame(step);
    };
    step();
  });
  if (!reduced) {
    const loop = async () => { wi = (wi + 1) % words.length; await scramble(words[wi]); setTimeout(loop, 2200); };
    setTimeout(loop, 2200);
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- target-lock cursor ---------- */
  if (finePointer && !reduced) {
    document.body.classList.add("lock-cursor");
    const core = document.createElement("div"); core.className = "cur-core";
    const lock = document.createElement("div"); lock.className = "cur-lock"; lock.innerHTML = "<i></i><i></i><i></i><i></i>";
    document.body.append(lock, core);
    const TARGETS = "a,button,.card,.play-card,.span-row,.planet span,.chip,.owl-teaser";
    let mx = -100, my = -100, lastBitX = 0, lastBitY = 0, target = null, spin = 0;
    const box = { x: -100, y: -100, w: 30, h: 30 };
    addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      const t = e.target.closest ? e.target.closest(TARGETS) : null;
      target = t;
      const inField = !!(e.target.closest && e.target.closest("input,textarea"));
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
    }, { passive: true });
    document.addEventListener("pointerleave", () => { core.classList.add("cur-hidden"); lock.classList.add("cur-hidden"); });
    document.addEventListener("pointerenter", () => { core.classList.remove("cur-hidden"); lock.classList.remove("cur-hidden"); });
    addEventListener("pointerdown", () => lock.classList.add("press"));
    addEventListener("pointerup", () => lock.classList.remove("press"));
    const frame = () => {
      let tx, ty, tw, th;
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect(), pad = 6;
        tx = r.left - pad; ty = r.top - pad; tw = r.width + pad * 2; th = r.height + pad * 2;
        if (tw > 520 || th > 420) { tx = mx - 22; ty = my - 22; tw = th = 44; } // big cards: smaller lock around pointer
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
  }

  /* ---------- hero: living network ---------- */
  const cv = $("#particles"), ctx = cv.getContext("2d");
  let W = 0, H = 0, DPR = 1, nodes = [], packets = [], ripples = [];
  const mouse = { x: -9999, y: -9999 };
  let chaos = false;
  const resize = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.round(Math.min(110, (W * H) / 14000));
    nodes = [...Array(n)].map(() => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6 }));
  };
  const LINK = 130;
  const hero = $(".hero");
  hero.addEventListener("mousemove", (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });
  hero.addEventListener("click", (e) => {
    if (e.target.closest("a,button")) return;
    const r = cv.getBoundingClientRect();
    ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
  });
  const draw = () => {
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
      const sp = Math.hypot(p.vx, p.vy);
      if (sp < 0.15) { p.vx += (Math.random() - 0.5) * 0.05; p.vy += (Math.random() - 0.5) * 0.05; }
      p.x += p.vx * (chaos ? 4 : 1); p.y += p.vy * (chaos ? 4 : 1);
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
  let heroVisible = true, drawing = false;
  const startDraw = () => { if (!drawing && !reduced) { drawing = true; requestAnimationFrame(draw); } };
  resize();
  addEventListener("resize", resize);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; if (heroVisible) startDraw(); }).observe(hero);
  if (reduced) { draw(); }

  /* ---------- reveal + counters ---------- */
  const countUp = (el) => {
    const target = +el.dataset.count, suf = el.dataset.suffix || "";
    if (reduced) { el.textContent = target + suf; return; }
    const t0 = performance.now();
    const f = (t) => {
      const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(target * e) + suf;
      if (k < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      io.unobserve(e.target);
    }
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- trace ---------- */
  const spansEl = $("#spans"), insp = $("#inspector");
  spansEl.innerHTML = SPANS.map((s) => `
    <button class="span-row" data-id="${s.id}" aria-label="Inspect ${esc(s.name)}">
      <span class="span-name" style="padding-left:${s.depth * 18}px">${s.depth ? "└ " : ""}<span class="kind">${s.kind}</span>${esc(s.name)}</span>
      <span class="span-track"><span class="span-bar${s.live ? " live" : ""}" style="left:${s.start}%;width:${s.len}%;background-color:${s.color};transition-delay:${SPANS.indexOf(s) * 70}ms"></span></span>
    </button>`).join("");
  const pretty = (o, ind = 0) => {
    const pad = "  ".repeat(ind);
    if (Array.isArray(o)) return "[\n" + o.map((v) => pad + "  " + pretty(v, ind + 1)).join(",\n") + "\n" + pad + "]";
    if (o && typeof o === "object") return "{\n" + Object.entries(o).map(([k, v]) => `${pad}  <span class="k">"${esc(k)}"</span>: ${pretty(v, ind + 1)}`).join(",\n") + "\n" + pad + "}";
    if (typeof o === "number") return `<span class="n">${o}</span>`;
    return `<span class="s">"${esc(o)}"</span>`;
  };
  const inspect = (id) => {
    const s = SPANS.find((x) => x.id === id);
    $$(".span-row").forEach((r) => r.classList.toggle("active", r.dataset.id === id));
    insp.innerHTML = `<span class="k">span</span> ${esc(s.name)}  <span class="s">${s.live ? "● running" : "✓ 200"}</span>\n` + pretty(s.attrs);
  };
  spansEl.addEventListener("click", (e) => { const r = e.target.closest(".span-row"); if (r) inspect(r.dataset.id); });
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { $("#traceView").classList.add("in"); inspect("animall"); o.disconnect(); } }, { threshold: 0.3 }).observe($("#traceView"));

  /* ---------- project cards ---------- */
  const cardsEl = $("#cards");
  cardsEl.innerHTML = PROJECTS.map((p) => `
    <article class="card reveal" data-cat="${p.cat}">
      <div class="meta"><span>${esc(p.org)}</span>${p.badge ? `<span class="badge">● ${p.badge}</span>` : `<span>${p.cat === "side" ? "side" : p.cat}</span>`}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <div class="metric">${esc(p.metric)}</div>
      <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      ${p.live || p.code ? `<div class="links">${p.live ? `<a href="${p.live}" target="_blank" rel="noopener">live ↗</a>` : ""}${p.code ? `<a href="${p.code}" target="_blank" rel="noopener">code ↗</a>` : ""}</div>` : ""}
    </article>`).join("");
  $$(".card", cardsEl).forEach((c) => {
    io.observe(c);
    if (!finePointer || reduced) return;
    c.addEventListener("mousemove", (e) => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
      c.style.transform = `perspective(900px) rotateX(${(y / r.height - 0.5) * -7}deg) rotateY(${(x / r.width - 0.5) * 7}deg)`;
    });
    c.addEventListener("mouseleave", () => (c.style.transform = ""));
  });
  const filterTo = (f) => {
    $$(".chip").forEach((b) => b.classList.toggle("active", b.dataset.filter === f));
    $$(".card", cardsEl).forEach((c) => c.classList.toggle("hide", f !== "all" && c.dataset.cat !== f));
  };
  $$(".chip").forEach((b) => b.addEventListener("click", () => filterTo(b.dataset.filter)));

  /* ---------- orbit ---------- */
  const orbit = $("#orbit");
  ORBITS.forEach((o) => {
    const ring = document.createElement("div");
    ring.className = "ring";
    ring.style.width = ring.style.height = o.r * 200 + "%";
    orbit.appendChild(ring);
    const spin = document.createElement("div");
    spin.className = "ring-spin";
    spin.style.animationDuration = o.dur + "s";
    o.items.forEach((name, i) => {
      const a = (360 / o.items.length) * i;
      const p = document.createElement("div");
      p.className = "planet";
      p.style.transform = `rotate(${a}deg) translateX(calc(var(--orb) * ${o.r})) rotate(${-a}deg)`;
      const s = document.createElement("span");
      s.textContent = name;
      s.style.animationDuration = o.dur + "s";
      p.appendChild(s);
      spin.appendChild(p);
    });
    orbit.appendChild(spin);
  });
  const sizeOrbit = () => orbit.style.setProperty("--orb", orbit.clientWidth + "px");
  sizeOrbit(); addEventListener("resize", sizeOrbit);

  /* ---------- email ---------- */
  $("#copyEmail").addEventListener("click", async () => {
    if (await copy(EMAIL)) toast("email copied — say hi 👋");
    else location.href = "mailto:" + EMAIL;
  });

  /* ---------- overlays ---------- */
  let lastFocus = null;
  const open = (id) => {
    closeAll();
    lastFocus = document.activeElement;
    const el = $("#" + id);
    el.hidden = false;
    if (id === "terminal") { $("#termIn").focus(); if (!termBody.childElementCount) boot(); }
    if (id === "palette") { palIn.value = ""; renderPal(); palIn.focus(); }
  };
  const closeAll = () => { $$(".overlay").forEach((o) => (o.hidden = true)); };
  const close = () => { closeAll(); lastFocus && lastFocus.focus && lastFocus.focus(); };
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) return open(o.dataset.open);
    if (e.target.closest("[data-close]") || e.target.classList.contains("overlay")) close();
  });

  /* ---------- terminal ---------- */
  const termBody = $("#termBody"), termIn = $("#termIn");
  const hist = []; let hi = 0;
  const print = (html, cls = "out") => { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; termBody.appendChild(d); termBody.scrollTop = termBody.scrollHeight; };
  const boot = () => {
    print(`<span class="acc">anurag-os v3.0</span> — booted in 0.42s · uptime: 3+ years`);
    print(`type <span class="acc">help</span> to see what this thing can do.\n`);
  };
  const go = (hash) => { close(); setTimeout(() => $(hash).scrollIntoView({ behavior: reduced ? "auto" : "smooth" }), 50); };
  const CMDS = {
    help: () => `<span class="acc">available commands</span>
  whoami        who is this guy
  experience    career, as a trace
  projects      things I've shipped
  skills        the stack
  contact       get in touch
  owl [question] ask Uli, the wise owl
  github | linkedin | twitter
  ls, cat, date, echo, history, clear, exit
  <span class="vio">secrets</span>     sudo hire-me · coffee · chaos · matrix`,
    whoami: () => `Anurag Kushwah — tech all-rounder, software engineer @ Animall.
3+ years building backends, real-time systems and AI pipelines.
📍 Gurugram · 🏡 Amjhera, Dhar (MP) · 🎓 DAVV Indore, Masai School`,
    experience: () => SPANS.filter((s) => !s.depth).map((s) => `${s.live ? '<span class="acc">●</span>' : "✓"} ${s.name.padEnd(22)} ${s.attrs.role}`).join("\n") + `\n\n<span class="vio">→ run 'goto trace' to see the full waterfall</span>`,
    projects: () => PROJECTS.map((p) => `• ${p.title.padEnd(28)} <span class="vio">${p.metric}</span>`).join("\n"),
    skills: () => `backend   Node.js Express NestJS Python TypeScript Socket.IO
data      PostgreSQL MongoDB MySQL Redis Kafka Qdrant
ai/llm    RAG embeddings vector-search Langfuse Claude-API
infra     GCP AWS Docker GitHub-Actions Nginx Cloud-Tasks
front     React Next.js Redux Tailwind Flutter`,
    contact: () => { copy(EMAIL); return `📧 ${EMAIL} <span class="acc">(copied to clipboard)</span>\n🔗 github.com/anurag0x · linkedin.com/in/anuraagkushwah`; },
    email: () => CMDS.contact(),
    github: () => { open_(LINKS.github); return "opening github…"; },
    linkedin: () => { open_(LINKS.linkedin); return "opening linkedin…"; },
    twitter: () => { open_(LINKS.twitter); return "opening twitter…"; },
    ls: () => `about.md  experience.trace  projects/  skills.json  <span class="acc">secrets.txt</span>`,
    cat: (a) => a[0] === "secrets.txt" ? "nice try. try 'sudo hire-me' instead 😉" : a[0] === "about.md" ? CMDS.whoami() : a[0] === "skills.json" ? CMDS.skills() : a[0] ? `cat: ${esc(a[0])}: it's a directory of dreams` : "cat: missing file operand",
    date: () => new Date().toString(),
    echo: (a) => esc(a.join(" ")),
    history: () => hist.map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`).join("\n") || "(empty)",
    goto: (a) => { const t = { about: "#about", trace: "#trace", work: "#work", stack: "#stack", play: "#play", contact: "#contact" }[a[0]]; if (t) { go(t); return ""; } return "usage: goto about|trace|work|stack|contact"; },
    sudo: (a) => a.join(" ") === "hire-me" ? (confetti(), `<span class="acc">[sudo] permission granted.</span>\n✨ excellent decision. ${EMAIL} is on your clipboard.`) + (copy(EMAIL), "") : `sudo: ${esc(a.join(" ") || "")}: nice try`,
    coffee: () => `      ( (\n       ) )\n    ........\n    |      |]\n    \\      /\n     \`----'\n  brewing… converting caffeine → code ☕`,
    chaos: () => (toggleChaos(), chaos ? "⚠️  chaos mode ON. type 'chaos' again to restore order." : "order restored."),
    matrix: () => (matrix(), "wake up, Neo…"),
    "rm": (a) => a.join(" ").includes("-rf") ? "🔥 nice try. prod is protected (I learned that the hard way)." : "rm: missing operand",
    owl: (a) => { close(); if (a.length && window.askOwl) window.askOwl(a.join(" ")); else if (window.openOwl) window.openOwl(); return ""; },
    exit: () => (close(), ""),
  };
  const open_ = (u) => window.open(u, "_blank", "noopener");
  $("#termForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = termIn.value.trim(); termIn.value = "";
    print(`<span class="acc">❯</span> ${esc(raw)}`, "cmd");
    if (!raw) return;
    hist.push(raw); hi = hist.length;
    const [c, ...args] = raw.split(/\s+/);
    if (c === "clear") { termBody.innerHTML = ""; return; }
    const fn = CMDS[c.toLowerCase()];
    const out = fn ? fn(args) : `command not found: ${esc(c)}. try <span class="acc">help</span>`;
    if (out) print(out);
  });
  termIn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hist.length) { hi = Math.max(0, hi - 1); termIn.value = hist[hi]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); termIn.value = hist[hi] || ""; e.preventDefault(); }
    if (e.key === "Tab") {
      e.preventDefault();
      const m = Object.keys(CMDS).concat("clear").filter((k) => k.startsWith(termIn.value));
      if (m.length === 1) termIn.value = m[0] + " ";
      else if (m.length) print(m.join("  "));
    }
  });

  /* ---------- command palette ---------- */
  const palIn = $("#palIn"), palList = $("#palList");
  const ACTIONS = [
    { label: "Go to About", hint: "section", run: () => go("#about") },
    { label: "Go to Experience trace", hint: "section", run: () => go("#trace") },
    { label: "Go to Work", hint: "section", run: () => go("#work") },
    { label: "Go to Stack orbit", hint: "section", run: () => go("#stack") },
    { label: "Go to Beyond code (who I am, sports & games)", hint: "section", run: () => go("#play") },
    { label: "Go to Contact", hint: "section", run: () => go("#contact") },
    { label: "Copy email address", hint: "action", run: async () => { close(); toast((await copy(EMAIL)) ? "email copied 👋" : EMAIL); } },
    { label: "Open GitHub", hint: "link", run: () => { close(); open_(LINKS.github); } },
    { label: "Open LinkedIn", hint: "link", run: () => { close(); open_(LINKS.linkedin); } },
    { label: "Open terminal", hint: "~", run: () => open("terminal") },
    { label: "Talk to Uli the owl", hint: "voice", run: () => { close(); window.openOwl && window.openOwl(); } },
    { label: "Filter work: AI / LLM", hint: "filter", run: () => { filterTo("ai"); go("#work"); } },
    { label: "Toggle chaos mode", hint: "secret", run: () => { close(); toggleChaos(); } },
    { label: "Make it rain", hint: "secret", run: () => { close(); confetti(); } },
  ];
  let palSel = 0, palItems = ACTIONS;
  const renderPal = () => {
    const q = palIn.value.toLowerCase();
    palItems = ACTIONS.filter((a) => a.label.toLowerCase().includes(q));
    palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
    palList.innerHTML = palItems.map((a, i) => `<li role="option" data-i="${i}" class="${i === palSel ? "sel" : ""}" aria-selected="${i === palSel}">${esc(a.label)}<span>${a.hint}</span></li>`).join("") || `<li>no matches<span>¯\\_(ツ)_/¯</span></li>`;
  };
  palIn.addEventListener("input", () => { palSel = 0; renderPal(); });
  palIn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { palSel = (palSel + 1) % Math.max(1, palItems.length); renderPal(); e.preventDefault(); }
    if (e.key === "ArrowUp") { palSel = (palSel - 1 + palItems.length) % Math.max(1, palItems.length); renderPal(); e.preventDefault(); }
    if (e.key === "Enter" && palItems[palSel]) palItems[palSel].run();
  });
  palList.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) palItems[+li.dataset.i].run(); });
  palList.addEventListener("mousemove", (e) => { const li = e.target.closest("li[data-i]"); if (li && +li.dataset.i !== palSel) { palSel = +li.dataset.i; renderPal(); } });

  /* ---------- keys ---------- */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let kp = 0;
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#palette").hidden ? open("palette") : close(); return; }
    if (e.key === "Escape") { close(); return; }
    const typing = !!(e.target.matches && e.target.matches("input,textarea"));
    if (!typing && (e.key === "`" || e.key === "~")) { e.preventDefault(); open("terminal"); return; }
    if (!typing) {
      kp = e.key === KONAMI[kp] ? kp + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (kp === KONAMI.length) { kp = 0; toggleChaos(); }
    }
  });

  /* ---------- fx ---------- */
  function toggleChaos() {
    chaos = !chaos;
    document.body.classList.toggle("chaos", chaos);
    toast(chaos ? "🌀 CHAOS MODE — konami/‘chaos’ again to stop" : "order restored");
    if (chaos) { nodes.forEach((n) => { n.vx *= 6; n.vy *= 6; }); confetti(); }
  }

  function overlayCanvas() {
    const c = document.createElement("canvas");
    Object.assign(c.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: 170 });
    c.width = innerWidth; c.height = innerHeight;
    document.body.appendChild(c);
    return c;
  }

  function confetti() {
    if (reduced) return;
    const c = overlayCanvas(), g = c.getContext("2d");
    const cols = ["#c6ff3d", "#8b6cff", "#ff4fa3", "#38bdf8", "#f2f0ea"];
    const bits = [...Array(160)].map(() => ({ x: c.width / 2, y: c.height * 0.6, vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 18 - 6, s: Math.random() * 6 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, col: cols[Math.random() * cols.length | 0] }));
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

  function matrix() {
    if (reduced) return;
    close();
    const c = overlayCanvas(), g = c.getContext("2d");
    c.style.background = "rgba(0,0,0,.85)";
    const fs = 16, cols = Math.ceil(c.width / fs), drops = Array(cols).fill(0).map(() => Math.random() * -40);
    const chars = "アカサタナハマヤラワ0123456789ANURAG<>/{}";
    let f = 0;
    const step = () => {
      g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = "#c6ff3d"; g.font = fs + "px JetBrains Mono, monospace";
      drops.forEach((d, i) => {
        g.fillText(chars[Math.random() * chars.length | 0], i * fs, d * fs);
        drops[i] = d * fs > c.height && Math.random() > 0.975 ? 0 : d + 1;
      });
      if (++f < 260) requestAnimationFrame(step); else { c.style.transition = "opacity .6s"; c.style.opacity = 0; setTimeout(() => c.remove(), 600); }
    };
    step();
  }

  // console greeting for the curious
  console.log("%c hey, you found the console 👀 ", "background:#c6ff3d;color:#07070a;font:600 14px monospace;padding:6px 10px;border-radius:6px");
  console.log("%cpress ` to open the terminal, or just email " + EMAIL, "color:#8b6cff;font:12px monospace");
})();

// frosted nav once the page scrolls
(() => {
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// "ask the owl" buttons
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ask]");
  if (b && window.askOwl) window.askOwl(b.dataset.ask);
});
