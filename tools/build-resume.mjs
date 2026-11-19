// Prints Resume/resume.html to Resume/Anurag-Kushwah-Resume.pdf with headless Chrome.
// Usage (from the site folder): node tools/build-resume.mjs
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const src = resolve("Resume/resume.html"), out = resolve("Resume/Anurag-Kushwah-Resume.pdf");
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${out}`, `file://${src}`], { stdio: "inherit" });
console.log("wrote", out);
