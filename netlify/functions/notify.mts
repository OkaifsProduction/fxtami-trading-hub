import type { Handler } from "@netlify/functions";
import { sendEmail } from "./_lib/email";
import { restaurant } from "../../src/data/restaurant";

interface ReservationRecord {
  name: string;
  email: string;
  phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  notes: string | null;
}

interface ContactRecord {
  name: string;
  email: string;
  message: string;
}

/**
 * Best-effort email notification for a reservation request or contact
 * message that the browser already saved directly to Supabase. This never
 * writes to the database itself — it only tells the restaurant a new row
 * exists, so a failure here never loses a guest's submission.
 */
export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let payload: { type?: string; record?: ReservationRecord | ContactRecord };
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid body" };
  }

  if (payload.type === "reservation") {
    const r = payload.record as ReservationRecord;
    await sendEmail({
      to: restaurant.email,
      subject: `Nieuwe reservatie-aanvraag — ${r.name}, ${r.party_size} gasten`,
      html: `
        <h1>Nieuwe reservatie-aanvraag</h1>
        <p><strong>${r.name}</strong> — ${r.email} — ${r.phone}</p>
        <p>${r.reservation_date} om ${r.reservation_time} · ${r.party_size} gasten</p>
        ${r.notes ? `<p>Opmerkingen: ${r.notes}</p>` : ""}
      `,
    });
  } else if (payload.type === "contact") {
    const c = payload.record as ContactRecord;
    await sendEmail({
      to: restaurant.email,
      subject: `Nieuw bericht via de website van ${c.name}`,
      html: `<h1>Nieuw contactbericht</h1><p><strong>${c.name}</strong> — ${c.email}</p><p>${c.message}</p>`,
    });
  } else {
    return { statusCode: 400, body: "Unknown notification type" };
  }

  return { statusCode: 200, body: "OK" };
};
