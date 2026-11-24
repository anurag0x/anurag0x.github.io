// Uli's built-in answers. Used instantly for small talk, and as the fallback when the AI brain
// (the gyani worker's /chat) is unreachable. Each intent: keywords (words or phrases) + answers.
import { EMAIL } from "@/data/site";

export type Act = "copy" | "resume" | "close";
export interface Intent { id: string; keys: string[]; a: string[]; act?: Act }
export interface Answer { id?: string; text: string; act?: Act }

export const KB: Intent[] = [
  { id: "greet", keys: ["hi", "hello", "hey", "namaste", "hola", "yo", "sup", "good morning", "good evening"],
    a: ["Namaste! 🦉 I'm Uli, Anurag's wise little owl. Ask me about his work, skills, projects, or how to reach him."] },
  { id: "owl", keys: ["who are you", "your name", "what are you", "uli", "uluka", "owl", "bot"],
    a: ["I'm Uli! My name comes from Uluka, the owl who carries Goddess Lakshmi. Anurag built me into his portfolio, and I know all about his work."] },
  { id: "about", keys: ["who is anurag", "about", "introduce", "tell me about", "summary", "yourself", "him", "anurag"],
    a: ["Anurag Kushwah is a tech all-rounder: backend, frontend, mobile, AI and cloud — if it's tech, he can build it. He has 3+ years of experience shipping scalable systems with Node.js, TypeScript, Python, PostgreSQL, MongoDB, Redis and Kafka, and he's currently a Software Engineer at Animall. Lately he's deep into AI and LLM systems: document ingestion, embeddings, vector search and RAG."] },
  { id: "allround", keys: ["all rounder", "allrounder", "full stack", "fullstack", "frontend", "front end", "mobile", "flutter", "react", "app", "apps", "anything", "everything", "versatile", "generalist", "can he"],
    a: ["Short answer: yes, he can build it. Anurag is a true tech all-rounder — backend APIs and microservices, React and Next.js frontends, Flutter mobile apps, AI and RAG pipelines, real-time voice and chat, and cloud deployments on GCP and AWS. Give him a problem, not a stack."] },
  { id: "current", keys: ["current", "currently", "now", "animall", "today", "present", "job", "where does he work", "working"],
    a: ["He's currently a Software Engineer at Animall, building the backend for the Animall Bhai app, which helps India's dairy farmers. That means Node.js and Express APIs on PostgreSQL and Redis, real-time voice calls and chat with Agora and Socket.IO, push-notification and Exotel IVR pipelines on Cloud Tasks, and AI-powered support using the Claude API."] },
  { id: "experience", keys: ["experience", "career", "companies", "worked", "work history", "background", "previous", "past", "jobs"],
    a: ["Here's the journey: Masai School as a Software Developer, then Kapiva Ayurveda as SDE 1, then Kenpath Technologies as an SDE, and now Animall as a Software Engineer. That's 3+ years shipping production backends. Ask me about any one of them!"] },
  { id: "years", keys: ["how many years", "years of experience", "how long", "how experienced", "yoe", "senior"],
    a: ["3+ years of professional experience, across four companies: Masai, Kapiva, Kenpath and now Animall."] },
  { id: "kenpath", keys: ["kenpath"],
    a: ["At Kenpath Technologies he was a Software Development Engineer. He built Python services for AI-powered document processing — a pipeline that takes PDFs through extraction, language detection, translation, review, chunking and embeddings, then indexes them in the Qdrant vector database for RAG. He also set up Docker-based CI/CD, traced LLM workflows with Langfuse, and worked with Beckn Network integrations."] },
  { id: "kapiva", keys: ["kapiva", "ayurveda", "carestudio", "telehealth", "healthcare", "commerce", "checkout", "orders"],
    a: ["At Kapiva he was SDE 1, building production backends across healthcare and commerce — Node.js, Express, MongoDB, PostgreSQL, Redis and Kafka, handling 100k+ requests a day. Highlights: CareStudio, a telehealth platform with an API gateway over 6+ microservices and Kafka event flows for 10,000+ consultations a month; Nidaan, which uses LLMs to turn doctor-patient calls into feedback; a call-audit platform for 5,000+ calls a month; checkout services for 1,000+ orders a day; Microsoft Entra ID SSO with RBAC; and 25 to 35 percent faster APIs. He also helped launch Kapiva's UK store."] },
  { id: "masai", keys: ["masai"],
    a: ["He studied full-stack web development at Masai School, then worked there as a Software Developer — building React, Node.js, Express and MongoDB features for learning and student-management platforms used by thousands of students."] },
  { id: "skills", keys: ["skills", "skill", "tech", "stack", "technologies", "languages", "tools", "know", "good at", "expert", "frameworks"],
    a: ["His toolkit: Backend — Node.js, Express, NestJS, Python, TypeScript, REST, WebSockets, JWT, OAuth and SSO. Data — PostgreSQL, MongoDB, MySQL, Redis, Kafka and Qdrant. AI — LLMs, RAG, embeddings, vector search and Langfuse. Infra — GCP, AWS, Docker, GitHub Actions and Nginx. Frontend — React, Next.js and Tailwind."] },
  { id: "ai", keys: ["ai", "llm", "llms", "rag", "embedding", "embeddings", "vector", "qdrant", "langfuse", "genai", "generative", "machine learning", "ml", "claude", "gpt", "prompt"],
    a: ["AI is a big part of his recent work. At Kenpath he built a document ingestion pipeline with embeddings in Qdrant for RAG, traced with Langfuse. At Kapiva he built Nidaan, which analyses doctor-patient call recordings with LLMs. And at Animall he's building AI-powered support with the Claude API."] },
  { id: "projects", keys: ["projects", "project", "built", "build", "portfolio", "side project", "made", "shipped"],
    a: ["Some highlights: real-time calls and chat at Animall; a document ingestion pipeline with Qdrant and Langfuse at Kenpath; CareStudio telehealth, Nidaan and a call-audit platform at Kapiva. On the side: Spendwise, an expense tracker, and Hypergo, a video player. Scroll to the Work section to see them all!"] },
  { id: "backend", keys: ["backend", "microservices", "api", "apis", "gateway", "kafka", "redis", "postgres", "postgresql", "scalable", "scale", "system design", "architecture", "event driven"],
    a: ["Backend is his home turf: API gateways with dynamic routing over 6+ microservices, Kafka event-driven workflows, Redis caching and query tuning that made APIs 25 to 35 percent faster, and services handling 100k+ requests a day."] },
  { id: "impact", keys: ["impact", "numbers", "achievements", "achievement", "metrics", "results", "proud", "best work", "performance"],
    a: ["Some numbers he's proud of: 100k+ requests a day, 10,000+ telehealth consultations a month, 5,000+ calls audited a month, 1,000+ orders a day, and APIs made 25 to 35 percent faster."] },
  { id: "education", keys: ["education", "degree", "college", "university", "study", "studied", "davv", "bsc", "graduate", "qualification"],
    a: ["He has a B.Sc. in Computer Science from Devi Ahilya Vishwavidyalaya in Indore, plus a full-time full-stack web development program at Masai School."] },
  { id: "location", keys: ["where", "location", "live", "lives", "based", "city", "from", "hometown", "native", "gurugram", "gurgaon", "dhar", "amjhera"],
    a: ["He's based in Gurugram, Haryana. His hometown is Amjhera, in Dhar district, Madhya Pradesh."] },
  { id: "contact", keys: ["contact", "email", "mail", "reach", "hire", "hiring", "available", "talk", "connect", "message", "job offer", "opportunity"],
    a: [`The best way to reach him is email: ${EMAIL}. You can also find him on LinkedIn and GitHub — links are in the contact section. I've copied the email to your clipboard, just in case. 😉`], act: "copy" },
  { id: "links", keys: ["github", "linkedin", "twitter", "social", "socials", "profile"],
    a: ["GitHub: github.com/anurag0x. LinkedIn: linkedin.com/in/anuraagkushwah. Twitter: @anuraag0x."] },
  { id: "resume", keys: ["resume", "cv", "pdf", "download"],
    a: ["Here you go! I've started downloading his latest resume. You can also grab it any time with the download resume button. Want me to walk you through his experience?"], act: "resume" },
  { id: "thanks", keys: ["thanks", "thank you", "thx", "cool", "nice", "great", "awesome", "ok", "okay"],
    a: ["Hoo-ray! Anything else you'd like to know?", "My pleasure! 🦉 Ask away if you're curious about anything else."] },
  { id: "bye", keys: ["bye", "goodbye", "see you", "later", "exit", "close"],
    a: ["Bye for now! Hoot me up any time. 🦉"], act: "close" },
  { id: "person", keys: ["as a person", "personality", "person", "like as", "kind of person", "character", "values", "nature", "teammate", "team player", "attitude", "who is he really", "mindset", "philosophy", "motto", "problem solving", "approach"],
    a: ["He's a pretty normal guy who loves a good problem. His mindset: every problem or situation is a way to new learnings, new exposures and new solutions. He's a team player, a curious learner, and calm under pressure."] },
  { id: "hobbies", keys: ["hobbies", "hobby", "sports", "sport", "play", "plays", "games", "game", "gaming", "gamer", "bgmi", "pubg", "fifa", "tekken", "football", "cricket", "volleyball", "pool", "snooker", "esports", "esport", "gym", "fitness", "workout", "free time", "interests", "athlete", "personal"],
    a: ["Off the keyboard, he's an all-round athlete! He's big on fitness, plays football, cricket and volleyball, loves pool and snooker, and believes there's no limit: if he wants to learn or do something, he will. He's also a big gamer: BGMI, FIFA and Tekken, plus mobile games and esports."] },
  { id: "joke", keys: ["joke", "funny", "fun fact", "laugh"],
    a: ["Why did the owl join the backend team? Because it's great at handling night-time requests. Hoo-hoo!", "Anurag once made an API 35 percent faster. I can turn my head 270 degrees. We both optimise."] },
];
export const FALLBACK =
  "Hmm, that one flew over my feathers. 🦉 I know about Anurag's experience, skills, AI work, projects, education, location and how to contact him — try one of those!";

export const LINES = {
  hi: "Namaste! I'm Uli, Anurag's wise owl. Just talk to me — ask what he does, his skills, or how to hire him.",
  hiNoMic: "Namaste! I'm Uli. My ears don't work in this browser, so please type your question below.",
  mic: "I need microphone permission to hear you. Allow it in the address bar, or type instead.",
  miss: "I didn't catch that. Try again?",
  wake: "Hoo! Yes, I'm listening.",
  handsOn: "Hands-free is on. Just say, hey Uli, whenever you want me.",
} as const;

// What actually gets spoken: emoji stripped, email and symbols said naturally.
export const spoken = (text: string): string =>
  text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .replace(EMAIL, "his email, which is right here on screen")
    .replace(/(\d+)k\+/g, "$1 thousand plus")
    .replace(/(\d),(\d{3})\+/g, "$1$2 plus")
    .replace(/(\d)\+/g, "$1 plus")
    .replace(/\s+/g, " ")
    .trim();

const STOP = new Set("a an the is are was were do does did of to in on for and or me tell what whats which can could would please about his he hes with at by it you your i".split(" "));
const GENERIC = new Set(["about", "thanks", "greet"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s+]/g, " ").replace(/\s+/g, " ").trim();

// Keyword scoring: phrases 3, exact words 2, shared prefixes 1. Generic intents only win when nothing specific matched.
export function answer(q: string): Answer {
  const text = " " + norm(q) + " ";
  const words = new Set(text.trim().split(" ").filter((w) => w && !STOP.has(w)));
  let best: Intent | null = null, bestScore = 0;
  for (const intent of KB) {
    let score = 0;
    for (const k of intent.keys) {
      if (k.includes(" ")) { if (text.includes(" " + k + " ")) score += 3; }
      else if (words.has(k)) score += 2;
      else if (k.length > 4 && [...words].some((w) => w.length > 3 && (w.startsWith(k) || k.startsWith(w)))) score += 1;
    }
    if (GENERIC.has(intent.id)) score *= 0.6;
    if (score > bestScore) { bestScore = score; best = intent; }
  }
  if (!best) return { text: FALLBACK };
  return { id: best.id, text: best.a[(Math.random() * best.a.length) | 0], act: best.act };
}
