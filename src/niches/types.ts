/**
 * A niche of the site: everything niche-specific lives in one file `src/niches/<slug>.ts`
 * (see docs/site-content-guide.md, "Как добавить нишу"). Templates and components never
 * contain niche words; scripts/check-niche-neutral.mjs checks that.
 */

/** active: has pages; soon: a card "скоро" in the chooser; hidden: not shown anywhere. */
export type NicheStatus = "active" | "soon" | "hidden";

interface Base {
  /** Address part (`/<slug>/`) for every niche except the default one; latin, digits, "-". */
  slug: string;
  /** Order in the chooser, smaller first. */
  order: number;
  /** Chooser card: "Клиники". */
  name: string;
  /** One line under the name. */
  teaser: string;
}

export interface SoonNiche extends Base {
  status: "soon" | "hidden";
}

/** Text blocks of a long page: a heading and any of paragraphs, lists, a highlighted note. */
export interface Section {
  h: string;
  p?: string[];
  ul?: string[];
  ol?: string[];
  callout?: string[];
}

export interface NichePage {
  /** `/<slug>/` for the default niche, `/<niche>/<slug>/` for the others. */
  slug: string;
  /** Link text in the footer. */
  label: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  sections: Section[];
}

/** Words used inside shared sentences, in the cases those sentences need. */
export interface Terms {
  /** The organisation: "клиника". */
  org: { nom: string; gen: string; ins: string; genPl: string };
  /** Its customer: "пациент". */
  contact: { nom: string; dat: string; genPl: string };
}

export interface CalcField {
  label: string;
  hint: string;
  value: number;
}

export interface ActiveNiche extends Base {
  status: "active";
  /** The site's demo form creates a bot for this niche (the backend supports only some). */
  demo: boolean;
  terms: Terms;
  seo: { title: string; description: string; serviceType: string };
  hero: { eyebrow: string; title: string; lead: string };
  problem: { title: string; lead: string; items: { title: string; text: string }[] };
  /** Captions of the three drawings "how the assistant picks up a night request". */
  story: { lead: string; captions: [string, string, string] };
  steps: { title: string; text: string }[];
  roles: { id: string; tab: string; title: string; points: string[] }[];
  /** Niche cards of the security block on the niche home, after the shared ones. */
  security: { title: string; text: string; todo?: string }[];
  /** The niche's part of the security page (e.g. medical rules). */
  safety: Section;
  faq: { q: string; a: string }[];
  /** Labels of the loss calculator; the formula is shared. */
  calculator: {
    leads: CalcField;
    lost: CalcField;
    conv: CalcField;
    check: CalcField;
    budget: CalcField;
  };
  audit: {
    title: string;
    lead: string;
    typeLabel: string;
    typeError: string;
    types: string[];
  };
  /** Required when `demo` is true. */
  demoForm?: {
    lead: string;
    nameLabel: string;
    namePlaceholder: string;
    nameError: string;
    sample: string;
    note: string;
    result: string;
    checks: string[];
    checksNote: string;
  };
  cta: { lead: string };
  footer: string;
  pages: NichePage[];
}

export type Niche = ActiveNiche | SoonNiche;
