// Experience rendered as an LLM-style trace. start/len are % of the waterfall (no dates on purpose).
export type Json = string | number | Json[] | { [key: string]: Json };

export interface Span {
  id: string;
  name: string;
  kind: "svc" | "op" | "llm";
  depth: 0 | 1;
  start: number;
  len: number;
  color: string;
  live?: boolean;
  attrs: { [key: string]: Json };
}

export const SPANS: Span[] = [
  { id: "masai", name: "Masai School", kind: "svc", depth: 0, start: 0, len: 22, color: "#8b6cff",
    attrs: { role: "Software Developer", stack: ["React", "Node.js", "Express", "MongoDB"], did: "Full-stack features for learning & student-management platforms used by thousands of students" } },
  { id: "kapiva", name: "Kapiva Ayurveda", kind: "svc", depth: 0, start: 20, len: 44, color: "#ff4fa3",
    attrs: { role: "Software Development Engineer I", stack: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis", "Kafka", "GCP"], did: "Production backends across healthcare & commerce, 100k+ requests/day", wins: ["25–35% faster APIs via caching + query tuning", "Entra ID SSO, JWT & RBAC across doctor/agent/admin apps", "Helped launch the UK D2C store"] } },
  { id: "carestudio", name: "CareStudio · api-gateway", kind: "op", depth: 1, start: 24, len: 22, color: "#ff4fa3",
    attrs: { what: "Telehealth & doctor consultation platform", did: ["API gateway with dynamic routing over 6+ microservices", "Prescription engine, scheduling & slot management", "Kafka event flows for prescriptions, orders, notifications"], scale: "10,000+ consultations/month" } },
  { id: "nidaan", name: "Nidaan · llm.analyze", kind: "llm", depth: 1, start: 40, len: 14, color: "#ff4fa3",
    attrs: { what: "AI-powered doctor call feedback", did: "LLM analysis of doctor–patient call recordings into structured quality feedback" } },
  { id: "commerce", name: "commerce · checkout", kind: "op", depth: 1, start: 48, len: 14, color: "#ff4fa3",
    attrs: { what: "Checkout & order management", scale: "1,000+ orders/day", stack: ["Node.js", "Kafka", "GCP"] } },
  { id: "kenpath", name: "Kenpath Technologies", kind: "svc", depth: 0, start: 63, len: 16, color: "#38bdf8",
    attrs: { role: "Software Development Engineer", stack: ["Python", "Docker", "Qdrant", "Langfuse"], did: ["Python services for AI document processing & ingestion", "Docker-based CI/CD pipelines", "Beckn Network integrations"] } },
  { id: "ingest", name: "doc-ingest · embed → qdrant", kind: "llm", depth: 1, start: 65, len: 13, color: "#38bdf8",
    attrs: { pipeline: ["extract", "detect language", "translate", "review", "chunk", "embed", "index in Qdrant"], observability: "Langfuse traces", for: "RAG workflows" } },
  { id: "animall", name: "Animall", kind: "svc", depth: 0, start: 79, len: 21, color: "#c6ff3d", live: true,
    attrs: { role: "Software Engineer", status: "in progress", building: "Backend for the Animall Bhai app — helping India's dairy farmers", stack: ["Node.js", "Express", "PostgreSQL", "Redis", "Socket.IO", "Agora", "Cloud Tasks"] } },
  { id: "calls", name: "realtime · calls + chat", kind: "op", depth: 1, start: 81, len: 19, color: "#c6ff3d", live: true,
    attrs: { what: "Voice calls & chat", stack: ["Agora", "Socket.IO", "Redis adapter"], note: "signalling delivered across pods" } },
  { id: "notify", name: "notify · fcm + exotel ivr", kind: "op", depth: 1, start: 83, len: 17, color: "#c6ff3d", live: true,
    attrs: { what: "Push-notification & IVR campaign pipelines", stack: ["Cloud Tasks", "node-cron", "Firebase", "Exotel"] } },
  { id: "support", name: "support · claude.messages", kind: "llm", depth: 1, start: 86, len: 14, color: "#c6ff3d", live: true,
    attrs: { what: "AI-powered support & chat", stack: ["Claude API"] } },
];
