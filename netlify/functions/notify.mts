import type { Handler } from "@netlify/functions";
import { sendEmail } from "./_lib/email";
import { escapeHtml, singleLine } from "./_lib/html";
import { restaurant } from "../../src/data/restaurant";

type Fields = Record<string, unknown>;

function str(record: Fields, key: string, max: number): string {
  const value = record[key];
  return typeof value === "string" ? value.slice(0, max) : "";
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

  let payload: { type?: unknown; record?: unknown };
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid body" };
  }

  if (!payload.record || typeof payload.record !== "object") {
    return { statusCode: 400, body: "Missing record" };
  }
  const record = payload.record as Fields;

  if (payload.type === "reservation") {
    const name = str(record, "name", 120);
    const email = str(record, "email", 200);
    const phone = str(record, "phone", 40);
    const date = str(record, "reservation_date", 20);
    const time = str(record, "reservation_time", 10);
    const notes = str(record, "notes", 1000);
    const partySize = Math.max(1, Math.min(20, Math.floor(Number(record.party_size)) || 1));
    if (!name || !email || !date || !time) return { statusCode: 400, body: "Incomplete reservation" };

    await sendEmail({
      to: restaurant.email,
      subject: `Nieuwe reservatie-aanvraag — ${singleLine(name, 60)}, ${partySize} gasten`,
      html: `
        <h1>Nieuwe reservatie-aanvraag</h1>
        <p><strong>${escapeHtml(name)}</strong> — ${escapeHtml(email)} — ${escapeHtml(phone)}</p>
        <p>${escapeHtml(date)} om ${escapeHtml(time)} · ${partySize} gasten</p>
        ${notes ? `<p>Opmerkingen: ${escapeHtml(notes)}</p>` : ""}
      `,
    });
  } else if (payload.type === "contact") {
    const name = str(record, "name", 120);
    const email = str(record, "email", 200);
    const message = str(record, "message", 4000);
    if (!name || !email || !message) return { statusCode: 400, body: "Incomplete message" };

    await sendEmail({
      to: restaurant.email,
      subject: `Nieuw bericht via de website van ${singleLine(name, 60)}`,
      html: `<h1>Nieuw contactbericht</h1><p><strong>${escapeHtml(name)}</strong> — ${escapeHtml(
        email,
      )}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
  } else {
    return { statusCode: 400, body: "Unknown notification type" };
  }

  return { statusCode: 200, body: "OK" };
};
