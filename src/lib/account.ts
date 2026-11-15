/**
 * The site account (step 9.3): sign-in by an SMS code to create a demo. The session token
 * lives in this browser (localStorage) and goes as `Authorization: Bearer …`; when the API
 * moves to our own domain the backend switches to an HttpOnly cookie and this file only
 * stops storing the token (see the backend's SITE_SESSION_TRANSPORT).
 */
import type { ApiResult } from "./api";

const TOKEN = "sf.session";
const DEVICE = "sf.device";

function store(): Storage | null {
  try { return window.localStorage; } catch { return null; }
}

export function getToken(): string | null {
  const raw = store()?.getItem(TOKEN);
  if (!raw) return null;
  try {
    const { token, expires } = JSON.parse(raw) as { token: string; expires: string };
    return new Date(expires) > new Date() ? token : null;
  } catch { return null; }
}

export function setToken(token: string | null, expires?: string): void {
  try {
    if (token && expires) store()?.setItem(TOKEN, JSON.stringify({ token, expires }));
    else store()?.removeItem(TOKEN);
  } catch { /* private mode: the session lives until the page closes */ }
}

/** A random id of this browser: a demo limit per device (not a fingerprint). */
export function deviceId(): string {
  try {
    let id = store()?.getItem(DEVICE);
    if (!id) {
      id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
      store()?.setItem(DEVICE, id);
    }
    return id;
  } catch { return ""; }
}

export function auth(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function call(apiBase: string, path: string, method = "GET", body?: unknown): Promise<ApiResult & Record<string, unknown>> {
  try {
    const res = await fetch(`${apiBase}/public/${path}`, {
      method,
      headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...auth() },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "omit",
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.status === 401) setToken(null);
    if (res.ok && data.ok === true) return data as ApiResult & Record<string, unknown>;
    return { ...data, ok: false, error: typeof data.error === "string" ? data.error : `http_${res.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}

/** "12 ноября, 14:30" in the visitor's time zone (the server counts in UTC). */
export function when(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
}
