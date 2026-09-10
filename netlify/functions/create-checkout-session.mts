import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
import { buildCatalog } from "./_lib/catalog";
import { getSupabaseAdmin } from "./_lib/supabaseAdmin";
import { restaurant } from "../../src/data/restaurant";

interface RequestItem {
  id: string;
  quantity: number;
}

const MAX_QUANTITY_PER_ITEM = 20;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.SITE_URL || process.env.URL;
  if (!stripeSecretKey || !siteUrl) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        error: "Online ordering isn't configured yet. Please call the restaurant to place your order.",
      }),
    };
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return {
      statusCode: 503,
      body: JSON.stringify({ error: "Order storage isn't configured yet. Please call the restaurant." }),
    };
  }

  let payload: { items?: RequestItem[]; notes?: string };
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body." }) };
  }

  const requestItems = Array.isArray(payload.items) ? payload.items : [];
  if (requestItems.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Your cart is empty." }) };
  }

  const catalog = buildCatalog();
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItemRows: { item_id: string; item_name: string; unit_price_cents: number; quantity: number }[] = [];
  let subtotalCents = 0;

  for (const requested of requestItems) {
    const quantity = Math.floor(Number(requested?.quantity));
    if (!requested?.id || !Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid item quantity in cart." }) };
    }
    const catalogEntry = catalog.get(requested.id);
    if (!catalogEntry) {
      return { statusCode: 400, body: JSON.stringify({ error: `Item "${requested.id}" is no longer available.` }) };
    }

    subtotalCents += catalogEntry.priceCents * quantity;
    orderItemRows.push({
      item_id: catalogEntry.id,
      item_name: catalogEntry.name,
      unit_price_cents: catalogEntry.priceCents,
      quantity,
    });
    lineItems.push({
      quantity,
      price_data: {
        currency: "usd",
        unit_amount: catalogEntry.priceCents,
        product_data: { name: catalogEntry.name },
      },
    });
  }

  const notes = typeof payload.notes === "string" ? payload.notes.slice(0, 500) : null;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_name: "",
      customer_email: "",
      subtotal_cents: subtotalCents,
      total_cents: subtotalCents,
      notes,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Failed to create order", orderError);
    return { statusCode: 500, body: JSON.stringify({ error: "Could not start checkout. Please try again." }) };
  }

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItemRows.map((row) => ({ ...row, order_id: order.id })));

  if (itemsError) {
    console.error("Failed to save order items", itemsError);
    return { statusCode: 500, body: JSON.stringify({ error: "Could not start checkout. Please try again." }) };
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      phone_number_collection: { enabled: true },
      success_url: `${siteUrl}/?checkout=success&order_id=${order.id}`,
      cancel_url: `${siteUrl}/?checkout=cancel`,
      metadata: { order_id: order.id, restaurant: restaurant.name },
    });

    await supabaseAdmin
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error("Stripe session creation failed", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Could not start checkout. Please try again." }) };
  }
};
