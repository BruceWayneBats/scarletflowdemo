/** Our backend's public API (/public/*): a proof of work, then the form as JSON. */

export type ApiResult = { ok: true; [key: string]: unknown } | { ok: false; error: string };

async function zeroBits(text: string): Promise<number> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
  let bits = 0;
  for (const byte of digest) {
    if (byte === 0) { bits += 8; continue; }
    return bits + Math.clz32(byte) - 24;
  }
  return bits;
}

/** Asked for when the form opens, so the work is done while the person types. */
export async function prepare(apiBase: string, form: "audit" | "demo"): Promise<{ challenge: string; nonce: string }> {
  const res = await fetch(`${apiBase}/public/challenge?form=${form}`, { credentials: "omit" });
  if (!res.ok) throw new Error("challenge");
  const task = (await res.json()) as { challenge: string; bits: number };
  let nonce = 0;
  while ((await zeroBits(`${task.challenge}:${nonce}`)) < task.bits) nonce++;
  return { challenge: task.challenge, nonce: String(nonce) };
}

/** Sends once more after a pause if the server finds the form filled too fast (a pasted
 * price list, autofill): the same proof stays valid for a few minutes. */
export async function send(apiBase: string, form: "audit" | "demo", body: Record<string, unknown>,
  proof: { challenge: string; nonce: string }): Promise<ApiResult> {
  const first = await post(apiBase, form, body, proof);
  if (first.ok || first.error !== "too_fast") return first;
  await new Promise((r) => setTimeout(r, 3500));
  return post(apiBase, form, body, proof);
}

async function post(apiBase: string, form: "audit" | "demo", body: Record<string, unknown>,
  proof: { challenge: string; nonce: string }): Promise<ApiResult> {
  try {
    const res = await fetch(`${apiBase}/public/${form}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, ...proof }),
      credentials: "omit",
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.ok && data.ok === true) return data as ApiResult;
    return { ok: false, error: typeof data.error === "string" ? data.error : `http_${res.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}

export const ERRORS: Record<string, string> = {
  network: "Не удалось связаться с сервером. Попробуйте ещё раз через минуту.",
  rate_limited: "Слишком много попыток. Попробуйте позже.",
  too_fast: "Секунду: проверьте поля и отправьте ещё раз.",
  bad_challenge: "Проверка не прошла. Обновите страницу и попробуйте снова.",
  no_consent: "Нужно согласие на обработку данных.",
  bad_name: "Проверьте название: только буквы, цифры и знаки препинания.",
  bad_contact: "Укажите телефон (+7 …) или Telegram (@имя).",
  bad_type: "Выберите тип клиники.",
  no_services: "Не нашли ни одной услуги в формате «Название — цена».",
  too_many_from_address: "С этого адреса сегодня уже создано несколько демо. Попробуйте завтра.",
  daily_limit: "Сегодня создано много демо. Попробуйте завтра или оставьте заявку.",
  no_service_tenant: "Приём заявок временно недоступен. Напишите нам напрямую.",
};

export const errorText = (code: string) => ERRORS[code] ?? "Что-то пошло не так. Попробуйте ещё раз.";
