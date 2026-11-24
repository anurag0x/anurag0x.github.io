# anurag0x.github.io

Anurag Kushwah's portfolio, live at https://anurag0x.github.io.

- **Site:** Next.js (App Router, static export) + TypeScript + Tailwind CSS, in `src/`.
- **Uli, the talking owl:** `src/uli/` in the browser, plus a Cloudflare Worker in TypeScript (`gyani-worker/`) that keeps the Gemini key secret and serves `/chat` and `/speak`.
- **Deploys:** every push to `main` is built and published to GitHub Pages by `.github/workflows/pages.yml`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
npm run resume       # rebuild the resume PDF from public/Resume/resume.html
```

Worker: `cd gyani-worker && npm install && npm test && npm run deploy`.
