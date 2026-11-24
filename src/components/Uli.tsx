"use client";

import { useEffect, useRef } from "react";
import { startUli } from "@/uli/uli";

function OwlSvg() {
  return (
    <svg viewBox="0 0 120 130" className="owl-svg" aria-hidden="true">
      <path d="M4 124 Q60 116 116 124" stroke="#5a3d28" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M100 122 q10 -10 16 -4 q-6 8 -16 4 Z" fill="#6aa84f" />
      <g className="owl-bob">
        <path className="owl-tuft owl-tuft-l" d="M24 40 C16 28 14 16 18 6 C26 14 34 22 42 30 Z" fill="#6b4329" />
        <path className="owl-tuft owl-tuft-r" d="M96 40 C104 28 106 16 102 6 C94 14 86 22 78 30 Z" fill="#6b4329" />
        <ellipse cx="60" cy="72" rx="44" ry="48" fill="#8a5a3c" />
        <path className="owl-wing owl-wing-l" d="M18 60 Q2 88 22 112 Q30 88 28 64 Z" fill="#6b4329" />
        <path className="owl-wing owl-wing-r" d="M102 60 Q118 88 98 112 Q90 88 92 64 Z" fill="#6b4329" />
        <path d="M14 84 q6 4 10 0 M14 94 q6 4 10 0 M96 84 q6 4 10 0 M96 94 q6 4 10 0" stroke="#4e2f1c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="60" cy="94" rx="27" ry="24" fill="#ead6b4" />
        <path d="M46 86 l4 4 l4 -4 M56 86 l4 4 l4 -4 M66 86 l4 4 l4 -4 M51 96 l4 4 l4 -4 M61 96 l4 4 l4 -4 M56 106 l4 4 l4 -4" stroke="#b5875a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="42" cy="54" r="21" fill="#f1e2c6" />
        <circle cx="78" cy="54" r="21" fill="#f1e2c6" />
        <path d="M26 38 Q42 30 58 42 M94 38 Q78 30 62 42" stroke="#6b4329" strokeWidth="3" fill="none" strokeLinecap="round" />
        {[["l", 42], ["r", 78]].map(([side, cx]) => (
          <g key={side} className="owl-eye" data-eye={side}>
            <circle className="owl-iris" cx={cx} cy="54" r="14" fill="#f5a524" />
            <g className="owl-pupil">
              <circle cx={cx} cy="54" r="7.5" fill="#140d08" />
              <circle cx={Number(cx) + 2.6} cy="51.4" r="2.4" fill="#fff" />
            </g>
            <rect className="owl-lid" x={Number(cx) - 15} y="39" width="30" height="30" rx="15" fill="#8a5a3c" />
          </g>
        ))}
        <path className="owl-beak" d="M54 66 Q60 62 66 66 Q63 74 60 80 Q57 74 54 66 Z" fill="#e09a2d" />
        <path d="M46 118 l-3 6 M50 118 v7 M54 118 l3 6 M66 118 l-3 6 M70 118 v7 M74 118 l3 6" stroke="#e09a2d" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Uli, the talking owl. React renders the markup once; startUli() drives it imperatively
// (pointer-tracking eyes, speech recognition, streamed audio), which never re-renders.
export function Uli() {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => startUli(rootRef.current!), []);
  return (
    <div className="owl-root" ref={rootRef}>
      <div className="owl-bubble" role="status" aria-live="polite" hidden>
        <div className="owl-status" />
        <div className="owl-caption" />
        <form className="owl-type" autoComplete="off" hidden>
          <input className="owl-in" placeholder="Type your question…" aria-label="Ask Uli a question" />
          <button aria-label="Ask">↑</button>
        </form>
        <button className="owl-wake" type="button" aria-pressed="false">🎙️ Hands-free: say “Hey Uli”</button>
        <div className="owl-actions">
          <button className="owl-kbd" type="button">⌨️ type instead</button>
          <button className="owl-stop" type="button">■ stop</button>
        </div>
      </div>
      <button className="owl-btn" aria-label="Talk to Uli, Anurag's owl. Tap and speak.">
        <OwlSvg />
        <span className="owl-ring" />
      </button>
      <button className="owl-callout" hidden />
    </div>
  );
}
