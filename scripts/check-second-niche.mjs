// A new niche is one file: build the site with a temporary second active niche and check
// that its pages appear and the home page links to it. The file is removed afterwards.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FIXTURE = "src/niches/zz-check.ts";
const out = mkdtempSync(join(tmpdir(), "niche-check-"));
writeFileSync(
  FIXTURE,
  `import base from "./clinics";
import type { ActiveNiche } from "./types";
const niche: ActiveNiche = {
  ...base, slug: "zz-check", order: 99, name: "Проверочная ниша", demo: false, demoForm: undefined,
  pages: [{ ...base.pages[0], slug: "sample", label: "Пример страницы" }],
};
export default niche;
`,
);
try {
  execFileSync("npx", ["astro", "build", "--outDir", out], { stdio: "pipe" });
  const base = join(out);
  const must = ["index.html", "zz-check/index.html", "zz-check/sample/index.html", "zz-check/security/index.html"];
  const missing = must.filter((f) => !existsSync(join(base, f)));
  if (missing.length) throw new Error(`missing pages: ${missing.join(", ")}`);
  if (existsSync(join(base, "zz-check/demo/index.html"))) throw new Error("a niche without demo got a demo page");
  if (!readFileSync(join(base, "index.html"), "utf8").includes("/zz-check/")) {
    throw new Error("the home page does not link to the new niche");
  }
  console.log("check-second-niche: ok");
} catch (e) {
  console.error(`check-second-niche: ${e.message}`);
  process.exitCode = 1;
} finally {
  rmSync(FIXTURE, { force: true });
  rmSync(out, { recursive: true, force: true });
}
