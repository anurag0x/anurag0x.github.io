export function Footer() {
  return (
    <footer className="flex flex-col flex-wrap items-center gap-2.5 border-0 border-t border-solid border-line px-(--pad) py-7 text-center font-mono text-xs text-muted tab:flex-row tab:justify-between tab:text-left">
      <span>© {new Date().getFullYear()} Anurag Kushwah</span>
      <span>built with Next.js · TypeScript · Tailwind</span>
    </footer>
  );
}
