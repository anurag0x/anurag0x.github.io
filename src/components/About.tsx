const STATS = [
  { count: 3, suffix: "+", label: "years shipping" },
  { count: 100, suffix: "k+", label: "requests / day" },
  { count: 10, suffix: "k+", label: "consults / month" },
  { count: 35, suffix: "%", label: "faster APIs" },
];

export function About() {
  return (
    <section id="about" className="section about">
      <div className="section-tag">01 / about</div>
      <div className="about-grid">
        <figure className="photo reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/image/anurag.jpg" alt="Portrait of Anurag Kushwah" loading="lazy" width={1000} height={1000} />
          <figcaption>📍 Gurugram · 🏡 Amjhera, Dhar</figcaption>
        </figure>
        <div className="about-copy">
          <h2 className="big reveal">From a small town in <em>Madhya Pradesh</em> to systems handling <em>100k+</em> requests a day.</h2>
          <p className="reveal">
            I&apos;m a tech all-rounder — give me a problem, not a stack. APIs, web frontends, Flutter apps, AI pipelines, real-time systems,
            cloud deploys: I&apos;ll pick it up and ship it. My favourite parts are the hard, invisible ones: API gateways, event-driven pipelines,
            caching that shaves real milliseconds, and auth that doesn&apos;t leak. These days I&apos;m at <b>Animall</b>, building the backend that
            helps India&apos;s dairy farmers — voice calls, chat, notification and IVR pipelines, and AI-powered support.
          </p>
          <p className="reveal">
            Before that: AI document pipelines at <b>Kenpath</b>, telehealth &amp; commerce at <b>Kapiva</b>, and learning platforms at <b>Masai</b>. B.Sc. CS from DAVV Indore.
          </p>
          <div className="stats">
            {STATS.map((s) => (
              <div key={s.label} className="stat reveal">
                {/* counted up by Effects when it scrolls into view */}
                <span className="num" data-count={s.count} data-suffix={s.suffix}>0</span>
                <span className="lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
