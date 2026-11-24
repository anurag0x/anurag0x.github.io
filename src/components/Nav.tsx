import { RESUME_URL } from "@/data/site";

const ITEMS = [
  ["#about", "about"],
  ["#trace", "experience"],
  ["#work", "work"],
  ["#stack", "stack"],
  ["#play", "beyond code"],
  ["#contact", "contact"],
] as const;

// Buttons carry data-open; Overlays listens for those clicks, so this stays a server component.
export function Nav() {
  return (
    <header className="nav">
      <a href="#top" className="logo" aria-label="Back to top">a<span>_</span></a>
      <nav className="nav-links">
        {ITEMS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        <a href={RESUME_URL} download className="nav-resume">resume ⤓</a>
      </nav>
      <div className="nav-right">
        <button className="kbd-btn" data-open="palette" aria-label="Open menu and command palette">
          <kbd>⌘</kbd><kbd>K</kbd><span className="menu-label">☰ menu</span>
        </button>
        <button className="kbd-btn term-btn" data-open="terminal" aria-label="Open terminal">&gt;_</button>
      </div>
    </header>
  );
}
