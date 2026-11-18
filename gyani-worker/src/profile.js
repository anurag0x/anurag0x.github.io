// Everything Uli knows about Anurag. Edit this file to change what the owl can talk about,
// then redeploy with `npx wrangler deploy`. Keep it factual: Uli is told never to invent anything.
export const PROFILE = `
NAME: Anurag Kushwah (also spelled Anuraag). Pronouns: he/him.
HEADLINE: Tech all-rounder and software engineer. Backend, frontend, mobile, AI/LLM and cloud — if it's tech, he can build it. "Give me a problem, not a stack."
EXPERIENCE: 3+ years professionally.
LOCATION: Lives in Gurugram, Haryana. Hometown: Amjhera, Dhar district, Madhya Pradesh.
EDUCATION: B.Sc. in Computer Science, Devi Ahilya Vishwavidyalaya (DAVV), Indore. Full-time Full Stack Web Development program at Masai School, Bengaluru.
CONTACT: Email anuragkushwah134@gmail.com. GitHub github.com/anurag0x. LinkedIn linkedin.com/in/anuraagkushwah. Twitter @anuraag0x. Portfolio anurag0x.github.io. (Do not share a phone number.)

CAREER (most recent first; do not mention dates):
1. Animall — Software Engineer (current job). Builds the backend for the Animall Bhai app, which helps India's dairy farmers. Node.js/Express APIs on PostgreSQL and Redis; real-time voice calls and chat with Agora and Socket.IO (signalling delivered across pods with a Redis adapter); push-notification and Exotel IVR campaign pipelines using Google Cloud Tasks, cron schedulers and Firebase; AI-powered support and chat features using the Claude API.
2. Kenpath Technologies — Software Development Engineer. Python backend services for AI-powered document processing and ingestion; Docker-based CI/CD pipelines; worked with Langfuse, Qdrant and LLM workflows; Beckn Network integrations.
   Project — Doc Ingestion Pipeline: Python pipeline that takes user-uploaded PDFs through text extraction, language detection, translation, review, chunking and embedding generation; embeddings indexed in the Qdrant vector database for semantic retrieval and RAG; LLM workflow tracing and observability with Langfuse.
3. Kapiva Ayurveda — Software Development Engineer I. Production backends with Node.js, Express, MongoDB, PostgreSQL, Redis and Kafka across healthcare and commerce; REST APIs and microservices handling 100k+ requests/day; Microsoft Entra ID SSO, JWT and RBAC for doctor, agent and admin apps; improved API performance 25–35% with Redis caching, indexing and query optimisation; service migration, CI/CD and deployments on Google Cloud Platform; helped launch Kapiva's UK D2C website.
   Project — CareStudio (telehealth & doctor consultation platform): API gateway with dynamic routing across 6+ microservices; prescription engine; appointment scheduling, slot management and patient onboarding (30%+ operational efficiency gain); Kafka event-driven workflows for prescriptions, orders and notifications supporting 10,000+ consultations/month.
   Project — Nidaan: AI/LLM workflow that analyses doctor–patient call recordings and produces structured feedback on doctor performance and consultation quality.
   Project — DocAssist Audit: full-stack call-audit platform (React, Node.js, MongoDB) auditing 5,000+ consultation calls/month; doctor-performance dashboards for 20+ internal users; migrated telephony ingestion from Python to Node.js.
   Project — Commerce platform: checkout and order-management services processing 1,000+ orders/day with async Kafka workflows.
4. Masai School — Software Developer. Full-stack features for learning and student-management platforms with React, Node.js, Express and MongoDB; REST APIs and auth flows used by thousands of students.

SIDE PROJECTS: Spendwise (expense & investment tracker, MERN; live at spendwise-blond.vercel.app); Hypergo (video player in React, TypeScript, Redux, Tailwind); AJIO clone (fashion e-commerce storefront in HTML/CSS/JS).

SKILLS:
- Languages & backend: JavaScript, TypeScript, Python, Node.js, Express, NestJS, REST API design, WebSockets, Socket.IO, JWT, OAuth 2.0, SSO (Microsoft Entra ID), RBAC.
- Data & messaging: PostgreSQL, MongoDB, MySQL, Redis, Kafka, Qdrant / vector databases, indexing, query optimisation, caching.
- AI & LLM: LLM APIs (Claude, Gemini), generative AI, prompt engineering, embeddings, RAG, document processing, semantic/vector search, Langfuse, LLM observability and evaluation.
- Architecture & infra: microservices, API gateways, event-driven systems, Docker, CI/CD, GitHub Actions, Nginx, GCP, AWS, Google Cloud Tasks.
- Frontend & mobile: React, Next.js, Redux, Tailwind CSS, HTML, CSS, Flutter/Dart.
- Tools: Git, GitHub, Postman, Swagger/OpenAPI.

AS A PERSON (his own words):
- A pretty normal guy who loves a good problem.
- His mindset: "Every problem or situation is a way to new learnings, new exposures and new solutions." Bugs, new tech, a tough match or a tricky game level are all chances to learn, get new exposure and grow.
- Team player, curious learner, and calm under pressure.

PERSONAL (hobbies, sports, interests):
- He's an all-round sportsperson and athlete — if there's a game, he's probably up for it.
- Fitness: big on fitness — gym and workouts.
- Outdoor sports: football, cricket and volleyball.
- Cue sports: pool and snooker.
- No limits: if he wants to, he can do anything. There is no limit to him learning new things and doing things in any field — sports, games, tech or otherwise.
- Gaming: a big BGMI (Battlegrounds Mobile India) player; also plays FIFA and Tekken, and is into mobile games and esports in general.
- Anything else personal (favourite food, movies, music, etc.) hasn't been shared yet — say so and suggest asking him by email.
`.trim();
