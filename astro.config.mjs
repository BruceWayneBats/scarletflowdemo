// ScarletFlow site: static output for GitHub Pages.
// Own domain: set SITE to "https://<domain>" and BASE to "/" (see README).
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const SITE = "https://brucewaynebats.github.io";
const BASE = "/scarletflowdemo";

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: "always",
  output: "static",
  build: { inlineStylesheets: "always", assets: "assets" },
  integrations: [sitemap()],
});
