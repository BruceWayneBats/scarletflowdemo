// Shared files must not contain niche words: everything niche-specific lives in
// src/niches/<slug>.ts, so a new niche never needs a change of layout (step 9.2).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src/components", "src/layouts", "src/pages", "src/content", "src/lib"];
const WORDS = /клиник|пациент|врач|стоматолог|недвижим|застройщик|квартир/i;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else yield path;
  }
}

const found = [];
for (const root of ROOTS) {
  for (const path of files(root)) {
    readFileSync(path, "utf8").split("\n").forEach((line, i) => {
      if (WORDS.test(line)) found.push(`${path}:${i + 1}: ${line.trim().slice(0, 100)}`);
    });
  }
}
if (found.length) {
  console.error("check-niche-neutral: niche words outside src/niches/:\n" + found.join("\n"));
  process.exit(1);
}
console.log("check-niche-neutral: ok");
