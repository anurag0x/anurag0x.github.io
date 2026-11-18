// Records every line Gyani can say with the macOS "Tara" (en-IN) voice into site/voice/<id>.m4a.
// Usage: node record-voice.mjs <site-dir>
import { readFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const site = process.argv[2];
const src = readFileSync(join(site, "owl.js"), "utf8");
const chunk = src.slice(src.indexOf("// @voice-lines-start"), src.indexOf("// @voice-lines-end"));
const EMAIL = src.match(/const EMAIL = "([^"]+)"/)[1];
const { KB, FALLBACK, LINES, spoken, clipId } = new Function("EMAIL", chunk + "\nreturn { KB, FALLBACK, LINES, spoken, clipId };")(EMAIL);

const texts = [...KB.flatMap((i) => i.a), FALLBACK, ...Object.values(LINES)];
const out = join(site, "voice");
mkdirSync(out, { recursive: true });
const tmp = join(process.argv[3] || out, "_tmp.aiff");
const keep = new Set();
for (const t of texts) {
  const clean = spoken(t);
  const id = clipId(clean);
  keep.add(id + ".m4a");
  const dest = join(out, id + ".m4a");
  if (existsSync(dest)) continue;
  execFileSync("say", ["-v", "Tara", "-r", "172", "-o", tmp, clean]);
  execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "56000", tmp, dest]);
  console.log("recorded", id, clean.slice(0, 60));
}
if (existsSync(tmp)) unlinkSync(tmp);
// drop clips for lines that no longer exist
for (const f of readdirSync(out)) if (f.endsWith(".m4a") && !keep.has(f)) { unlinkSync(join(out, f)); console.log("removed stale", f); }
console.log(`${keep.size} clips ready`);
