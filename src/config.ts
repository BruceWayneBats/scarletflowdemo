/** Site settings. Change here, rebuild, push: GitHub Actions publishes the site. */
export const config = {
  name: "ScarletFlow",
  /** Our backend (main project): forms and the demo. Until a server with a domain exists it is
   * a temporary tunnel, so this changes with it. Empty: forms work in "demo mode" (no sending). */
  apiBase: (import.meta.env.PUBLIC_API_BASE as string | undefined) ?? "https://only-penetration-baths-ticket.trycloudflare.com",
  /** Our own chat on every page (the widget of the ScarletFlow tenant, `make service-tenant`).
   * Empty: no chat. */
  widgetKey: "pk_n4Sb4HWZUs6VZKV8u9iH4j5D",
  /** Yandex Webmaster: the code from "verification by meta tag"; empty: no tag. */
  yandexVerification: "",
  /** Show the demo form (part B connects it to the backend). */
  demoEnabled: true,
  /** The cases page stays hidden until there are real, agreed results. */
  casesEnabled: false,
  /** Version of the consent text the forms refer to (/consent/). */
  consentVersion: "2026-11-draft",
};

/** A path inside the site, with the base (/scarletflowdemo/ on GitHub Pages). */
export function url(path = "/"): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
