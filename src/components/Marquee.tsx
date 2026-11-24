import { MARQUEE } from "@/data/stack";

export function Marquee() {
  const line = MARQUEE.join(" ✦ ") + " ✦ ";
  return (
    <div aria-hidden="true" className="my-10 -rotate-2 scale-[1.03] overflow-hidden border-0 border-y border-solid border-line bg-acid text-ink">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((i) => (
          <span key={i} className="whitespace-nowrap py-3.5 text-[22px] font-bold tracking-[-.02em] tab:text-[clamp(22px,3.2vw,40px)]">{line}</span>
        ))}
      </div>
    </div>
  );
}
