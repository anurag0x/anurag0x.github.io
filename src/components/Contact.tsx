"use client";

import { EMAIL, LINKS, RESUME_URL } from "@/data/site";
import { draftEmail } from "@/lib/browser";

export function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="section-tag">06 / contact</div>
      <h2 className="mega reveal">Let&apos;s build<br /><em>something loud.</em></h2>
      <div className="contact-row reveal">
        <button className="btn btn-solid magnetic big-btn" onClick={() => draftEmail()}>
          {EMAIL} <span className="copy-hint">click to email</span>
        </button>
        <a href={RESUME_URL} download className="btn btn-ghost magnetic big-btn">download resume ⤓</a>
      </div>
      <div className="socials reveal">
        <a href={LINKS.github} target="_blank" rel="noopener">github ↗</a>
        <a href={LINKS.linkedin} target="_blank" rel="noopener">linkedin ↗</a>
        <a href={LINKS.twitter} target="_blank" rel="noopener">twitter ↗</a>
      </div>
    </section>
  );
}
