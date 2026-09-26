import { restaurant } from "../data/restaurant";

const ENDPOINT = "/.netlify/functions/submit";

const FALLBACK = `Er ging iets mis bij het versturen. Probeer het opnieuw, of bel ons op ${restaurant.phone}.`;

/**
 * Posts a form to the site's own endpoint, which validates the data, stores it
 * and notifies the restaurant. Returns null on success, or a message to show
 * the guest.
 */
export async function submitForm(payload: Record<string, unknown>): Promise<string | null> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) return null;

    const body = await res.json().catch(() => null);
    return typeof body?.error === "string" ? body.error : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/**
 * Hidden decoy input. Real visitors can't see or tab into it; bots fill it in,
 * and the server then discards the submission.
 */
export const honeypotProps = {
  type: "text" as const,
  name: "company",
  tabIndex: -1,
  autoComplete: "off",
  "aria-hidden": true,
  className: "absolute left-[-9999px] h-px w-px opacity-0",
};
