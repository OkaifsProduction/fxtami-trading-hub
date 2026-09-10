/**
 * Minimal Resend REST API wrapper (no SDK dependency needed for one endpoint).
 * If RESEND_API_KEY isn't set, sends are skipped rather than failing the
 * caller — a missing confirmation email should never break a paid order or
 * a saved reservation.
 */
export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATIONS_FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn("sendEmail skipped: RESEND_API_KEY or NOTIFICATIONS_FROM_EMAIL not set");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
    });
    if (!res.ok) {
      console.error("sendEmail failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("sendEmail threw", err);
  }
}
