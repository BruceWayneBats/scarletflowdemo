/** "… TODO: …" in a content string: the part after the marker is shown as a todo note. */
export function splitTodo(text: string): [string, string | null] {
  const i = text.indexOf("TODO:");
  return i < 0 ? [text, null] : [text.slice(0, i).trimEnd(), text.slice(i)];
}

/** The calculator's formula (app/services/loss_calculator.py in the main project). */
export function lossEstimate(leads: number, lostPct: number, convPct: number, check: number) {
  const lost = leads * (lostPct / 100);
  return { lost, revenue: lost * (convPct / 100) * check };
}

export const rub = (n: number) => `≈ ${Math.round(n).toLocaleString("ru-RU")} ₽`;
