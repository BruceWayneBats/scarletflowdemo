// WCAG contrast of the text/background pairs used on the site (AA: 4.5 for text).
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/tokens.css", "utf8");
const token = (name) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))[1];
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const pairs = [
  ["ink", "paper"], ["ink-2", "paper"], ["ink-2", "paper-2"], ["ink-2", "sakura"], ["ink", "sakura"],
  ["vermilion-ink", "paper"], ["vermilion-ink", "paper-2"], ["brown", "paper"], ["brown", "paper-2"],
  ["white", "vermilion"], ["white", "vermilion-press"], ["paper", "ink"],
];
let failed = false;
for (const [fg, bg] of pairs) {
  const r = ratio(token(fg), token(bg));
  const ok = r >= 4.5;
  if (!ok) failed = true;
  console.log(`${ok ? "ok  " : "FAIL"} ${fg} on ${bg}: ${r.toFixed(2)}`);
}
if (failed) process.exit(1);
console.log("check-contrast: ok");
