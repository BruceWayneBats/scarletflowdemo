// First load of each page: the HTML plus every local asset it references, at most 500 KB.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const BASE = "/scarletflowdemo";
const LIMIT = 500 * 1024;
const pages = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? pages(p) : p.endsWith(".html") ? [p] : [];
});

let failed = false;
for (const page of pages(DIST)) {
  const html = readFileSync(page, "utf8");
  let total = statSync(page).size;
  const seen = new Set();
  // Fonts load by unicode-range: only the Cyrillic and Latin woff2 files count.
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"|url\(([^)]+)\)/g)) {
    let ref = (m[1] ?? m[2]).replace(/["']/g, "");
    if (!ref.startsWith(BASE + "/")) continue;
    if (/\.woff$/.test(ref) || /(ext|vietnamese|greek)-\d/.test(ref)) continue;
    if (!/\.(js|css|svg|woff2|png|webp|avif|jpg)$/.test(ref)) continue;
    const file = join(DIST, ref.slice(BASE.length));
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    total += statSync(file).size;
  }
  const kb = (total / 1024).toFixed(0);
  console.log(`${page.replace(DIST, "")}: ${kb} KB`);
  if (total > LIMIT) failed = true;
}
if (failed) { console.error("check-weight: a page is over 500 KB"); process.exit(1); }
console.log("check-weight: ok");
