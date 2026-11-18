// Re-records Uli's fixed lines with the natural Gemini voice (via the worker's /speak),
// saving site/voice/<id>.m4a. Paced slowly to stay inside the free tier.
// Usage: node record-gemini.mjs <site-dir> <worker-speak-url>
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const [site, speakUrl] = process.argv.slice(2);
const src = readFileSync(join(site, "owl.js"), "utf8");
const chunk = src.slice(src.indexOf("// @voice-lines-start"), src.indexOf("// @voice-lines-end"));
const EMAIL = src.match(/const EMAIL = "([^"]+)"/)[1];
const { KB, FALLBACK, LINES, spoken, clipId } = new Function("EMAIL", chunk + "\nreturn { KB, FALLBACK, LINES, spoken, clipId };")(EMAIL);
const texts = [...new Set([...KB.flatMap((i) => i.a), FALLBACK, ...Object.values(LINES)].map(spoken))];

const out = join(site, "voice");
const doneFile = join(out, ".gemini-done");
const done = new Set(existsSync(doneFile) ? readFileSync(doneFile, "utf8").split("\n").filter(Boolean) : []);
mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0, failed = 0;
for (const clean of texts) {
  const id = clipId(clean);
  if (done.has(id)) { ok++; continue; }
  let wav = null;
  for (let attempt = 1; attempt <= 4 && !wav; attempt++) {
    const res = await fetch(speakUrl, { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://anurag0x.github.io" }, body: JSON.stringify({ text: clean }) });
    if (res.ok) wav = Buffer.from(await res.arrayBuffer());
    else { console.log(`  ${id} attempt ${attempt}: ${res.status} ${await res.text()}`); await sleep(45000); }
  }
  if (!wav) { failed++; console.log("FAILED", id, clean.slice(0, 50)); continue; }
  const tmp = join(out, `_${id}.wav`);
  writeFileSync(tmp, wav);
  execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", tmp, join(out, id + ".m4a")]);
  unlinkSync(tmp);
  done.add(id);
  writeFileSync(doneFile, [...done].join("\n"));
  ok++;
  console.log(`recorded ${ok}/${texts.length}`, id, clean.slice(0, 50));
  await sleep(21000);
}
console.log(`done: ${ok} ok, ${failed} failed`);
