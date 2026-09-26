import type { Handler } from "@netlify/functions";
import { getSupabaseAdmin } from "./_lib/supabaseAdmin";
import { sendEmail } from "./_lib/email";
import { escapeHtml, singleLine } from "./_lib/html";
import {
  clockTime,
  email as validEmail,
  isoDate,
  looksLikeSpam,
  optionalText,
  partySize,
  phone as validPhone,
  text,
  type Result,
} from "./_lib/validate";
import { validateReservationSlot } from "../../src/lib/hours";
import { restaurant } from "../../src/data/restaurant";

const MAX_PARTY_SIZE = 10;

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const fail = (error: string) => json(400, { error });

/** Unwraps a list of validation results, returning the first error if any failed. */
function firstError(results: Result<unknown>[]): string | null {
  for (const r of results) if (!r.ok) return r.error;
  return null;
}

/**
 * Single public endpoint for the reservation and contact forms.
 *
 * The browser never talks to the database directly: it posts here, and this
 * function validates everything, writes the row with the service role key, and
 * only then emails the restaurant using the stored values. That keeps the
 * database closed to the public, and means the notification email can never be
 * triggered for a submission that wasn't actually saved.
 */
export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Methode niet toegestaan." });
  }

  let payload: Record<string, unknown>;
  try {
    const parsed = JSON.parse(event.body || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    payload = parsed as Record<string, unknown>;
  } catch {
    return fail("Ongeldige aanvraag.");
  }

  // Answer spam exactly like a success so bots get no signal, but save nothing.
  if (looksLikeSpam(payload)) return json(200, { ok: true });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("submit: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return json(503, {
      error: `Het formulier is tijdelijk niet beschikbaar. Bel ons op ${restaurant.phone}.`,
    });
  }

  if (payload.type === "reservation") {
    const name = text(payload.name, "Naam", { max: 120 });
    const email = validEmail(payload.email);
    const phone = validPhone(payload.phone);
    const size = partySize(payload.party_size, MAX_PARTY_SIZE);
    const date = isoDate(payload.reservation_date);
    const time = clockTime(payload.reservation_time);

    const invalid = firstError([name, email, phone, size, date, time]);
    if (invalid) return fail(invalid);
    if (!name.ok || !email.ok || !phone.ok || !size.ok || !date.ok || !time.ok) return fail("Ongeldige aanvraag.");

    // The same opening-hours check the form runs, applied again server-side so
    // a crafted request can't book a Monday or an hour after closing time.
    const slotError = validateReservationSlot(date.value, time.value);
    if (slotError) return fail(slotError);

    const row = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      party_size: size.value,
      reservation_date: date.value,
      reservation_time: time.value,
      notes: optionalText(payload.notes, 1000),
    };

    const { data, error } = await supabase.from("reservations").insert(row).select().single();
    if (error || !data) {
      console.error("submit: failed to save reservation", error);
      return json(500, {
        error: `We konden uw aanvraag niet opslaan. Probeer opnieuw of bel ons op ${restaurant.phone}.`,
      });
    }

    await sendEmail({
      to: restaurant.email,
      subject: `Nieuwe reservatie-aanvraag — ${singleLine(data.name, 60)}, ${data.party_size} pers.`,
      html: `
        <h1>Nieuwe reservatie-aanvraag</h1>
        <p><strong>${escapeHtml(data.name)}</strong><br/>
           ${escapeHtml(data.email)} · ${escapeHtml(data.phone)}</p>
        <p><strong>${escapeHtml(data.reservation_date)} om ${escapeHtml(data.reservation_time)}</strong>
           · ${data.party_size} ${data.party_size === 1 ? "persoon" : "personen"}</p>
        ${data.notes ? `<p>Opmerkingen: ${escapeHtml(data.notes)}</p>` : ""}
        <hr/>
        <p style="color:#666">Bevestig de gast telefonisch of per e-mail.</p>
      `,
    });

    return json(200, { ok: true });
  }

  if (payload.type === "contact") {
    const name = text(payload.name, "Naam", { max: 120 });
    const email = validEmail(payload.email);
    const message = text(payload.message, "Bericht", { min: 2, max: 4000 });

    const invalid = firstError([name, email, message]);
    if (invalid) return fail(invalid);
    if (!name.ok || !email.ok || !message.ok) return fail("Ongeldige aanvraag.");

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({ name: name.value, email: email.value, message: message.value })
      .select()
      .single();

    if (error || !data) {
      console.error("submit: failed to save contact message", error);
      return json(500, {
        error: `We konden uw bericht niet versturen. Probeer opnieuw of bel ons op ${restaurant.phone}.`,
      });
    }

    await sendEmail({
      to: restaurant.email,
      subject: `Nieuw bericht via de website — ${singleLine(data.name, 60)}`,
      html: `
        <h1>Nieuw contactbericht</h1>
        <p><strong>${escapeHtml(data.name)}</strong> — ${escapeHtml(data.email)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
      `,
    });

    return json(200, { ok: true });
  }

  return fail("Onbekend formuliertype.");
};
