// No third-party resources: every src/href that loads something must be our own.
// Allowed outbound links (navigation, not loading): messengers and schema.org in JSON-LD.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const OWN = ["https://brucewaynebats.github.io/scarletflowdemo"];
const LINKS_OK = [/^https:\/\/t\.me\//, /^https:\/\/max\.ru\//, /^https:\/\/schema\.org/];
const files = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : [p];
});

let bad = 0;
for (const file of files(DIST).filter((f) => /\.(html|css|js)$/.test(f))) {
  const text = readFileSync(file, "utf8");
  // Loading attributes and CSS url(): never external.
  for (const m of text.matchAll(/(?:src|srcset|href)=["'](https?:\/\/[^"']+)["']|url\(["']?(https?:\/\/[^)"']+)/g)) {
    const url = m[1] ?? m[2];
    const tag = text.slice(Math.max(0, m.index - 80), m.index);
    const isNavLink = /<a\s[^>]*$/.test(tag) || /rel="canonical"/.test(text.slice(m.index - 40, m.index + 200));
    if (OWN.some((o) => url.startsWith(o))) continue;
    if (isNavLink && LINKS_OK.some((r) => r.test(url))) continue;
    console.error(`external resource in ${file}: ${url}`);
    bad++;
  }
}
if (bad) process.exit(1);
console.log("check-external: ok");
