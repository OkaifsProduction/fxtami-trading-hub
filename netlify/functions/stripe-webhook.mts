import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
import { getSupabaseAdmin } from "./_lib/supabaseAdmin";
import { sendEmail } from "./_lib/email";
import { restaurant } from "../../src/data/restaurant";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = event.headers["stripe-signature"];

  if (!stripeSecretKey || !webhookSecret) {
    console.error("stripe-webhook: STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set");
    return { statusCode: 503, body: "Not configured" };
  }
  if (!signature || !event.body) {
    return { statusCode: 400, body: "Missing signature or body" };
  }

  const stripe = new Stripe(stripeSecretKey);
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", err);
    return { statusCode: 400, body: "Invalid signature" };
  }

  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "Ignored" };
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.error("stripe-webhook: checkout.session.completed with no order_id metadata");
    return { statusCode: 200, body: "No order_id" };
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error("stripe-webhook: Supabase not configured");
    return { statusCode: 503, body: "Not configured" };
  }

  const customerEmail = session.customer_details?.email ?? "";
  const customerName = session.customer_details?.name ?? "";
  const customerPhone = session.customer_details?.phone ?? "";

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .update({
      status: "paid",
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: customerPhone,
    })
    .eq("id", orderId)
    .select("*, order_items(*)")
    .single();

  if (error || !order) {
    console.error("stripe-webhook: failed to update order", error);
    return { statusCode: 500, body: "Failed to update order" };
  }

  const itemsHtml = (order.order_items ?? [])
    .map((item: { item_name: string; quantity: number; unit_price_cents: number }) => {
      const lineTotal = ((item.unit_price_cents * item.quantity) / 100).toFixed(2);
      return `<tr><td>${item.quantity} × ${item.item_name}</td><td style="text-align:right">$${lineTotal}</td></tr>`;
    })
    .join("");

  const totalFormatted = (order.total_cents / 100).toFixed(2);

  if (customerEmail) {
    await sendEmail({
      to: customerEmail,
      subject: `Your ${restaurant.name} order is confirmed`,
      html: `
        <h1>Grazie, ${customerName || "there"}!</h1>
        <p>Your order has been received and paid. We'll see you soon for pickup.</p>
        <table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
        <p><strong>Total: $${totalFormatted}</strong></p>
        <p>${restaurant.address.line1}, ${restaurant.address.line2}<br/>${restaurant.phone}</p>
      `,
    });
  }

  await sendEmail({
    to: restaurant.email,
    subject: `New paid order — $${totalFormatted}`,
    html: `
      <h1>New online order</h1>
      <p>${customerName || "Guest"} — ${customerEmail} — ${customerPhone}</p>
      <table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
      <p><strong>Total: $${totalFormatted}</strong></p>
      ${order.notes ? `<p>Notes: ${order.notes}</p>` : ""}
    `,
  });

  return { statusCode: 200, body: "OK" };
};
