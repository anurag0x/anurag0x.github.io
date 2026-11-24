export type ProjectCategory = "ai" | "backend" | "side";
export type ProjectFilter = ProjectCategory | "all";

export interface Project {
  cat: ProjectCategory;
  org: string;
  badge?: "live";
  title: string;
  desc: string;
  metric: string;
  tags: string[];
  live?: string;
  code?: string;
}

export const FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "all" },
  { id: "ai", label: "ai / llm" },
  { id: "backend", label: "backend" },
  { id: "side", label: "side projects" },
];

export const PROJECTS: Project[] = [
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
