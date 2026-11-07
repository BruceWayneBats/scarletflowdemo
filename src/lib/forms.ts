/** Client-side checks shared by the site's forms. The server checks everything again. */

export type Check = (value: string, form: HTMLFormElement) => string | null;

export const required = (msg: string): Check => (v) => (v.trim() ? null : msg);
export const maxLen = (n: number, msg: string): Check => (v) => (v.length <= n ? null : msg);

/** A Russian phone (+7 / 8 and 10 digits) or a Telegram username (@name). */
export const phoneOrTelegram: Check = (v) => {
  const s = v.trim();
  if (/^@[A-Za-z0-9_]{5,32}$/.test(s)) return null;
  const digits = s.replace(/[\s()+-]/g, "");
  if (/^(7|8)\d{10}$/.test(digits)) return null;
  return "Укажите телефон (+7 …) или Telegram (@имя)";
};

export function setError(form: HTMLFormElement, name: string, message: string | null): void {
  const el = form.elements.namedItem(name) as HTMLInputElement | null;
  const out = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
  if (el) el.setAttribute("aria-invalid", message ? "true" : "false");
  if (out) out.textContent = message ?? "";
}

/** Runs the checks; focuses the first invalid field. True if all pass. */
export function validate(form: HTMLFormElement, checks: Record<string, Check[]>): boolean {
  let first: HTMLElement | null = null;
  for (const [name, list] of Object.entries(checks)) {
    const el = form.elements.namedItem(name) as HTMLInputElement;
    const value = el.type === "checkbox" ? (el.checked ? "on" : "") : el.value;
    const message = list.map((c) => c(value, form)).find((m) => m) ?? null;
    setError(form, name, message);
    if (message && !first) first = el;
  }
  first?.focus();
  return first === null;
}

export function status(form: HTMLFormElement, text: string): void {
  const box = form.querySelector<HTMLElement>("[data-status]");
  if (box) { box.textContent = text; box.focus(); }
}

export const DEMO_MODE_TEXT =
  "Сайт работает в демо-режиме: заявка не отправлена и нигде не сохранена. " +
  "Подключение к серверу появится в ближайшее время.";
