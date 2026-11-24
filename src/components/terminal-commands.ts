// The terminal's commands. Each returns HTML (every user-supplied value is escaped) or "" for no output.
import { SPANS } from "@/data/career";
import { PROJECTS } from "@/data/projects";
import { EMAIL, LINKS, type SectionId, SECTIONS } from "@/data/site";
import { copyEmail, downloadResume, draftEmail, esc, openTab, scrollToSection } from "@/lib/browser";
import { emit } from "@/lib/bus";

export interface TerminalApi {
  close: () => void;
  history: () => string[];
  chaosOn: () => boolean;
}

type Command = (args: string[], api: TerminalApi) => string;

export const COMMANDS: Record<string, Command> = {
  help: () => `<span class="acc">available commands</span>
  whoami        who is this guy
  experience    career, as a trace
  projects      things I've shipped
  skills        the stack
  contact       get in touch
  email         write me an email
  resume        download my resume (PDF)
  owl [question] ask Uli, the wise owl
  github | linkedin | twitter
  ls, cat, date, echo, history, clear, exit
  <span class="vio">secrets</span>     sudo hire-me · coffee · chaos · matrix`,
  whoami: () => `Anurag Kushwah — tech all-rounder, software engineer @ Animall.
3+ years building backends, real-time systems and AI pipelines.
📍 Gurugram · 🏡 Amjhera, Dhar (MP) · 🎓 DAVV Indore, Masai School`,
  experience: () =>
    SPANS.filter((s) => !s.depth).map((s) => `${s.live ? '<span class="acc">●</span>' : "✓"} ${s.name.padEnd(22)} ${s.attrs.role}`).join("\n") +
    `\n\n<span class="vio">→ run 'goto trace' to see the full waterfall</span>`,
  projects: () => PROJECTS.map((p) => `• ${p.title.padEnd(28)} <span class="vio">${p.metric}</span>`).join("\n"),
  skills: () => `backend   Node.js Express NestJS Python TypeScript Socket.IO
data      PostgreSQL MongoDB MySQL Redis Kafka Qdrant
ai/llm    RAG embeddings vector-search Langfuse Claude-API
infra     GCP AWS Docker GitHub-Actions Nginx Cloud-Tasks
front     React Next.js Redux Tailwind Flutter`,
  contact: () => { void copyEmail(); return `📧 ${EMAIL} <span class="acc">(copied to clipboard)</span>\n🔗 github.com/anurag0x · linkedin.com/in/anuraagkushwah\n<span class="vio">→ run 'email' to write to me right away</span>`; },
  email: () => { draftEmail(); return `opening a new email to ${EMAIL}…`; },
  mail: (a, api) => COMMANDS.email(a, api),
  github: () => { openTab(LINKS.github); return "opening github…"; },
  linkedin: () => { openTab(LINKS.linkedin); return "opening linkedin…"; },
  twitter: () => { openTab(LINKS.twitter); return "opening twitter…"; },
  ls: () => `about.md  experience.trace  projects/  skills.json  <span class="acc">secrets.txt</span>`,
  cat: (a, api) =>
    a[0] === "secrets.txt" ? "nice try. try 'sudo hire-me' instead 😉"
    : a[0] === "about.md" ? COMMANDS.whoami(a, api)
    : a[0] === "skills.json" ? COMMANDS.skills(a, api)
    : a[0] ? `cat: ${esc(a[0])}: it's a directory of dreams`
    : "cat: missing file operand",
  date: () => new Date().toString(),
  echo: (a) => esc(a.join(" ")),
  history: (_a, api) => api.history().map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`).join("\n") || "(empty)",
  goto: (a, api) => {
    if (a[0] && a[0] in SECTIONS) { api.close(); scrollToSection(a[0] as SectionId); return ""; }
    return "usage: goto about|trace|work|stack|play|contact";
  },
  sudo: (a) => {
    if (a.join(" ") !== "hire-me") return `sudo: ${esc(a.join(" "))}: nice try`;
    emit("confetti");
    void copyEmail();
    return `<span class="acc">[sudo] permission granted.</span>\n✨ excellent decision. ${EMAIL} is on your clipboard.`;
  },
  coffee: () => `      ( (\n       ) )\n    ........\n    |      |]\n    \\      /\n     \`----'\n  brewing… converting caffeine → code ☕`,
  chaos: (_a, api) => { emit("chaos:toggle"); return api.chaosOn() ? "⚠️  chaos mode ON. type 'chaos' again to restore order." : "order restored."; },
  matrix: (_a, api) => { api.close(); emit("matrix"); return "wake up, Neo…"; },
  rm: (a) => (a.join(" ").includes("-rf") ? "🔥 nice try. prod is protected (I learned that the hard way)." : "rm: missing operand"),
  resume: () => { downloadResume(); return "downloading Anurag-Kushwah-Resume.pdf ⤓"; },
  cv: (a, api) => COMMANDS.resume(a, api),
  owl: (a, api) => { api.close(); if (a.length) emit("owl:ask", a.join(" ")); else emit("owl:open"); return ""; },
  exit: (_a, api) => { api.close(); return ""; },
};
