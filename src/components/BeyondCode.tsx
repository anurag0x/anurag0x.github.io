interface PlayCard { emoji: string; title: string; tag: string; kind?: string; text?: string; chips?: string[]; variant?: "main" | "more" }

const GAMES: PlayCard[] = [
  { emoji: "🎮", title: "BGMI", tag: "● main game", kind: "esports", variant: "main", chips: ["mobile", "esports", "squad"],
    text: "Battlegrounds Mobile India — squad up, drop hot, play for the chicken dinner. Into mobile games and esports in general." },
  { emoji: "🥅", title: "FIFA", tag: "console" },
  { emoji: "🥊", title: "Tekken", tag: "fighter" },
];

const SPORTS: PlayCard[] = [
  { emoji: "💪", title: "Fitness", tag: "gym & workouts" },
  { emoji: "⚽", title: "Football", tag: "field" },
  { emoji: "🏏", title: "Cricket", tag: "field" },
  { emoji: "🏐", title: "Volleyball", tag: "court" },
  { emoji: "🎱", title: "Pool & Snooker", tag: "table" },
  { emoji: "♾️", title: "…and anything I set my mind to", tag: "no limits", variant: "more",
    text: "If I want to, I can do it. No limit on learning new things, in any field." },
];

function Card({ c }: { c: PlayCard }) {
  return (
    <article className={`play-card${c.variant ? " " + c.variant : ""} reveal`}>
      <div className="play-top">
        <span className="play-tag">{c.tag}</span>
        {c.kind && <span className="play-kind">{c.kind}</span>}
      </div>
      <div className="play-emoji" aria-hidden="true">{c.emoji}</div>
      <h3>{c.title}</h3>
      {c.text && <p>{c.text}</p>}
      {c.chips && <div className="play-chips">{c.chips.map((x) => <span key={x}>{x}</span>)}</div>}
    </article>
  );
}

export function BeyondCode() {
  return (
    <section id="play" className="section play">
      <div className="section-tag">05 / beyond code</div>
      <h2 className="big reveal">Beyond the code: <em>who I am</em>.</h2>
      <div className="person">
        <div className="person-copy reveal">
          <p>I&apos;m a pretty normal guy who just loves a good problem.</p>
          <p>
            Bugs, new tech, a tough match, a tricky level — to me, every problem or situation is a chance to <b>learn something new</b>, get new
            exposure, and find a new solution. That&apos;s how I keep growing.
          </p>
          <div className="traits">
            <span>🤝 Team player</span><span>🧠 Curious learner</span><span>🧘 Calm under pressure</span>
          </div>
        </div>
        <blockquote className="motto reveal">
          <span className="motto-mark" aria-hidden="true">“</span>
          <p>Every problem or situation is a way to <em>new learnings</em>, new exposures and new solutions.</p>
          <cite><b>— <em>Anuraag</em></b><span>my mindset, on and off the keyboard</span></cite>
        </blockquote>
      </div>

      <h3 className="sub reveal">How I play <span>— an all-round athlete; if there&apos;s a game, I&apos;m in</span></h3>
      <div className="play-group">
        <h4 className="group-title reveal">🎮 Esports &amp; games</h4>
        <div className="play-grid games">{GAMES.map((c) => <Card key={c.title} c={c} />)}</div>
      </div>
      <div className="play-group">
        <h4 className="group-title reveal">🏅 Sports</h4>
        <div className="play-grid sports">{SPORTS.map((c) => <Card key={c.title} c={c} />)}</div>
      </div>
      <p className="play-cta reveal">
        Ask the owl ↘ <button className="link-btn" data-ask="What is Anurag like as a person?">“What is he like as a person?”</button>
      </p>
    </section>
  );
}
