# Going live — Da Vinci

This site is code-complete and ready to launch: online ordering with real
payment (Stripe), a reservation form, and a contact form, all backed by a
real database (Supabase) and email notifications (Resend). Nothing charges
real money or stores real data until you connect your own accounts below —
follow this checklist top to bottom and you'll be live.

Total time: roughly 1–2 hours, almost all of it account creation and
copy-pasting keys. No code changes required for a standard launch.

---

## 0. Before you start

Replace the placeholder content with your real business details:

- `src/data/restaurant.ts` — name, phone, email, address, hours, social links,
  Google Maps embed URL (Google Maps → Share → Embed a map → copy the `src`
  from the iframe).
- `src/data/menu.ts` / `src/data/dishes.ts` — your real menu and prices
  (prices are in **cents**, e.g. `1600` = $16.00).
- `src/data/images.ts` — swap the Unsplash placeholder photos for your own
  (any image URL works, or add files to `src/assets` and import them).
- `public/privacy.html` and `public/terms.html` — fill in every `[bracketed]`
  placeholder. These are templates, not legal advice — have a lawyer review
  them, especially if you'll serve customers in the EU (GDPR applies).
- Currency: line items are created in `netlify/functions/create-checkout-session.mts`
  with `currency: "usd"` — change this if you bill in another currency.

---

## 1. Supabase (database)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, paste and run the contents of
   `supabase/migrations/0001_init.sql`. This creates the `reservations`,
   `contact_messages`, `orders`, and `order_items` tables with the right
   security policies already configured.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → used for both `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key (keep this secret!) → `SUPABASE_SERVICE_ROLE_KEY`

You can browse submitted reservations and messages any time in the Supabase
Table Editor — there's no admin panel on the site itself for this first
version (see "What's not built yet" below).

---

## 2. Stripe (payments)

1. Create an account at [stripe.com](https://stripe.com) (or use an existing
   one) and finish business verification when you're ready to take real
   payments — test mode works before that.
2. **Developers → API keys**: copy the **Secret key** → `STRIPE_SECRET_KEY`
   (starts `sk_test_...` in test mode, `sk_live_...` once verified).
3. **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://yourdomain.com/.netlify/functions/stripe-webhook`
   - Events to send: `checkout.session.completed`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

The webhook is what marks an order as paid and sends the confirmation
emails — checkout won't feel "done" without it.

---

## 3. Resend (order & reservation emails)

1. Create a free account at [resend.com](https://resend.com).
2. Add and verify your domain (Resend walks you through the DNS records).
3. **API Keys** → create one → `RESEND_API_KEY`.
4. Set `NOTIFICATIONS_FROM_EMAIL` to an address on your verified domain,
   e.g. `orders@yourdomain.com`.

If you skip this step, orders and reservations still save correctly — you
just won't get emailed about them, so you'd need to check Supabase directly.

---

## 4. Deploy to Netlify

1. Push this repository to GitHub (if it isn't already).
2. [netlify.com](https://netlify.com) → **Add new site → Import an existing
   project** → pick this repo. Netlify reads `netlify.toml` automatically
   (build command, publish directory, and functions directory are already
   configured).
3. **Site configuration → Environment variables** → add every variable from
   `.env.example` with your real values from steps 1–3. Also add:
   - `SITE_URL` = your production URL once you know it (e.g.
     `https://davinci-restaurant.com`) — used to build Stripe's redirect
     links after checkout.
4. Deploy. Netlify will build the site and deploy the functions in
   `netlify/functions` automatically.

---

## 5. Connect your domain

1. Buy a domain (Namecheap, Google Domains successor Squarespace, Cloudflare,
   etc.) if you don't have one.
2. Netlify → **Domain management → Add a domain** → follow the DNS
   instructions (either point nameservers to Netlify, or add the A/CNAME
   records Netlify gives you at your registrar).
3. Netlify provisions a free HTTPS certificate automatically once DNS
   propagates (usually minutes to a few hours).
4. Update `SITE_URL` in Netlify's environment variables to the final domain
   and redeploy (**Deploys → Trigger deploy**) so Stripe redirects go to the
   right place.

---

## 6. Test the whole flow before announcing you're live

- **Ordering**: add items to the cart, checkout with a
  [Stripe test card](https://docs.stripe.com/testing) (`4242 4242 4242 4242`,
  any future date, any CVC) while `STRIPE_SECRET_KEY` is still a test key.
  Confirm the order shows `status = paid` in Supabase's `orders` table and
  that both confirmation emails arrive.
- **Reservations**: submit the form on `#reserve`, confirm a row appears in
  the `reservations` table and the notification email arrives.
- **Contact form**: same check against `contact_messages`.
- Once everything above works, switch `STRIPE_SECRET_KEY` /
  `STRIPE_WEBHOOK_SECRET` to your **live** Stripe keys (new webhook endpoint
  needed for live mode too) and you're accepting real payments.

## Testing locally

`npm install -g netlify-cli`, then `netlify dev` from the project root runs
the Vite dev server *and* the functions together at `http://localhost:8888`,
so cart checkout and the forms work exactly like production. Point
`SITE_URL` at `http://localhost:8888` in your local `.env` for this.

---

## What's not built yet (intentionally out of scope for v1)

- **Delivery**: online ordering is pickup-only. Adding delivery means
  collecting an address at checkout and likely integrating a delivery
  provider or driver dispatch — a meaningful follow-up project, not a
  config change.
- **Admin dashboard**: reservations/orders/messages are viewed directly in
  the Supabase Table Editor. A branded in-app admin view (mark reservations
  confirmed, orders fulfilled, etc.) is a natural next step.
- **Order status page for customers**: customers currently get a
  confirmation email but no order-tracking link.
- **Multi-language**: the site is English-only.

None of these block a real launch — pickup ordering, reservations, and
contact are all fully functional today.
