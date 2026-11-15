/**
 * All niches: every file in this folder (except types.ts and index.ts) is one niche. A new
 * niche is a new file; nothing else changes. The first active niche by `order` is the
 * default: its home is the site's home page and its pages live at the root.
 */
import type { ActiveNiche, Niche, NichePage } from "./types";

const files = import.meta.glob<{ default: Niche }>(["./*.ts", "!./index.ts", "!./types.ts"], {
  eager: true,
});

export const niches: Niche[] = Object.values(files)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order);

export const active: ActiveNiche[] = niches.filter((n): n is ActiveNiche => n.status === "active");

if (!active.length) throw new Error("niches: no active niche");
const slugs = new Set<string>();
for (const n of niches) {
  if (!/^[a-z0-9-]{2,32}$/.test(n.slug)) throw new Error(`niches: bad slug "${n.slug}"`);
  if (slugs.has(n.slug)) throw new Error(`niches: duplicate slug "${n.slug}"`);
  slugs.add(n.slug);
}
for (const n of active) {
  if (n.demo && !n.demoForm) throw new Error(`niches: "${n.slug}" has demo but no demoForm`);
}

export const defaultNiche: ActiveNiche = active[0];

/** Shown in the chooser: active and "soon". */
export const listed: Niche[] = niches.filter((n) => n.status !== "hidden");

export function isDefault(n: ActiveNiche): boolean {
  return n.slug === defaultNiche.slug;
}

/** A path inside the niche: the root for the default niche, `/<slug>/…` for the others. */
export function nichePath(n: ActiveNiche, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return isDefault(n) ? clean : `/${n.slug}${clean}`;
}

export function pagePath(n: ActiveNiche, p: NichePage): string {
  return nichePath(n, `/${p.slug}/`);
}

/** The demo page belongs to the default niche (/demo/); others with a demo get /<slug>/demo/. */
export function demoPath(n: ActiveNiche): string | null {
  return n.demo ? nichePath(n, "/demo/") : null;
}
