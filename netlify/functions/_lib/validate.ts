/**
 * Validation shared by the public submit endpoint. Everything a browser sends
 * is untrusted, so each field is checked and clamped here before it reaches
 * the database or an email template.
 */

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Belgian numbers with or without country code, spaces, dots, slashes, dashes.
const PHONE = /^[+0-9][0-9\s./-]{7,19}$/;

export function text(value: unknown, field: string, { min = 1, max = 200 }): Result<string> {
  if (typeof value !== "string") return { ok: false, error: `${field} ontbreekt.` };
  const trimmed = value.trim();
  if (trimmed.length < min) return { ok: false, error: `${field} is verplicht.` };
  if (trimmed.length > max) return { ok: false, error: `${field} is te lang (max ${max} tekens).` };
  return { ok: true, value: trimmed };
}

export function optionalText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export function email(value: unknown): Result<string> {
  const base = text(value, "E-mailadres", { max: 200 });
  if (!base.ok) return base;
  if (!EMAIL.test(base.value)) return { ok: false, error: "Vul een geldig e-mailadres in." };
  return base;
}

export function phone(value: unknown): Result<string> {
  const base = text(value, "Telefoonnummer", { max: 40 });
  if (!base.ok) return base;
  if (!PHONE.test(base.value)) return { ok: false, error: "Vul een geldig telefoonnummer in." };
  return base;
}

export function partySize(value: unknown, max: number): Result<number> {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1 || n > max) {
    return { ok: false, error: `Kies een aantal tussen 1 en ${max} personen.` };
  }
  return { ok: true, value: n };
}

export function isoDate(value: unknown): Result<string> {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { ok: false, error: "Kies een geldige datum." };
  }
  return { ok: true, value };
}

export function clockTime(value: unknown): Result<string> {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return { ok: false, error: "Kies een geldig tijdstip." };
  }
  return { ok: true, value };
}

/**
 * Hidden field that real visitors never see and never fill in. Bots fill every
 * input they find, so a non-empty value means "silently accept and discard".
 */
export function looksLikeSpam(payload: Record<string, unknown>): boolean {
  return typeof payload.company === "string" && payload.company.trim() !== "";
}
