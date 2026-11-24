export interface OrbitRing { r: number; dur: number; items: string[] }

export const ORBITS: OrbitRing[] = [
  { r: 0.30, dur: 40, items: ["Express", "NestJS", "TypeScript", "Python"] },
  { r: 0.43, dur: 60, items: ["PostgreSQL", "Redis", "Kafka", "MongoDB", "Socket.IO"] },
  { r: 0.56, dur: 85, items: ["Qdrant", "RAG", "Langfuse", "Claude API", "GCP", "AWS", "Docker", "React"] },
];

export const STACK_GROUPS: { name: string; items: string }[] = [
  { name: "backend", items: "Node.js · Express · NestJS · Python · TypeScript · REST · WebSockets · Socket.IO · JWT / OAuth / SSO · RBAC" },
  { name: "data", items: "PostgreSQL · MongoDB · MySQL · Redis · Kafka · Qdrant · indexing & query tuning" },
  { name: "ai / llm", items: "RAG · embeddings · vector search · document ingestion · Langfuse · Claude API · prompt engineering" },
  { name: "infra", items: "GCP · AWS · Docker · GitHub Actions · Nginx · Cloud Tasks · microservices · event-driven" },
  { name: "front", items: "React · Next.js · TypeScript · Redux · Tailwind · Flutter" },
];

export const MARQUEE = ["Node.js", "TypeScript", "Next.js", "Python", "PostgreSQL", "Redis", "Kafka", "Socket.IO", "Agora", "Qdrant", "Langfuse", "RAG", "Microservices", "GCP", "AWS", "Docker"];
