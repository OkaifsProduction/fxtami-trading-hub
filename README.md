# Da Vinci — restaurant website

Production-ready website for Da Vinci, an Italian restaurant and pizzeria in
Beverst (Bilzen, Belgium). It presents the restaurant, shows the full menu,
takes online pickup orders with card payment, and accepts table reservations
and contact messages.

The site is in Dutch and prices are in euro.

- **Live preview:** https://6ab6dd246d8fcefba286d2f4--davinci-bilzen-preview.netlify.app
- **Go-live guide:** [DEPLOYMENT.md](DEPLOYMENT.md) — accounts, keys, domain, testing.

---

## What it does

| Feature | How it works |
| --- | --- |
| Menu | Full card in six categories, from `src/data/menu.ts`. Every item can be added to the cart. |
| Online ordering | Cart → Stripe Checkout → confirmation emails. Prices are looked up on the server, never trusted from the browser. |
| Reservations | Date and time picker limited to real opening hours, validated again on the server. |
| Contact form | Saved to the database and emailed to the restaurant. |
| Opening hours | One schedule drives the live "Nu open" badge, the hours table and which reservation slots exist. |
| Legal | Dutch privacy policy and terms, cookie notice, click-to-load Google Maps. |

---

## Tech stack

- **React 18 + TypeScript**, built with **Vite**
- **Tailwind CSS** for styling (no UI framework, no component library)
- **Netlify Functions** for all server-side logic
- **Supabase** (PostgreSQL) for storage
- **Stripe Checkout** for payments
- **Resend** for transactional email

No build-time secrets, no backend server to maintain, no CMS. Hosting fits in
Netlify's free tier for a restaurant's traffic; you pay Stripe per transaction.

---

## Project structure

```
src/
  components/     UI, one file per section (Hero, Menu, Gallery, …)
  data/           ← everything you edit to rebrand: menu, photos, business details
  hooks/          scroll reveals, parallax, open/closed status, dialogs
  lib/            cart state, price formatting, opening-hours logic, form posting
  styles.css      design tokens, animations, shared classes
netlify/functions/
  submit.mts                  reservations + contact form (validate → store → email)
  create-checkout-session.mts builds the Stripe payment session from the real prices
  stripe-webhook.mts          marks orders paid and sends confirmations
  _lib/                       Supabase admin client, email, HTML escaping, validation
supabase/migrations/          database schema — run these once, in order
public/                       privacy.html, terms.html, robots.txt
```

---

## Running it locally

```bash
npm install
npm run dev          # http://localhost:5173 — pages and styling
```

The forms and checkout need the server functions. Run them in a second
terminal; the dev server forwards `/.netlify/functions/*` to them
automatically:

```bash
npm install -g netlify-cli
cp .env.example .env    # fill in your keys
npm run dev:functions   # keep this running alongside `npm run dev`
```

Other commands:

```bash
npm run build        # production build into dist/
npm run preview      # serve the production build
npm run typecheck    # TypeScript for the app and the functions
```

> `netlify dev` also works, but it applies the production
> Content-Security-Policy, which blocks Vite's development script and leaves
> the page blank. Use the two commands above instead.

---

## Making it your own

Almost all content lives in `src/data/` — you can rebrand the site without
touching a component:

| File | What's in it |
| --- | --- |
| `restaurant.ts` | Name, address, phone, email, opening hours, social links |
| `menu.ts` | The full menu. **Prices are in cents** (`1050` = € 10,50) |
| `dishes.ts` | The six highlighted dishes on the home page |
| `images.ts` | Every photo URL, in one place |
| `gallery.ts` | Gallery photos and captions |
| `features.ts` | The four "why us" points |
| `reviews.ts` | Guest reviews — empty by default, and the section stays hidden until you add real ones |

Colours, fonts and spacing are defined in `tailwind.config.ts` and
`src/styles.css`.

**Opening hours live in two places** in `restaurant.ts`: `hours` (what
visitors read) and `schedule` (what the code reasons about). Keep them in
sync.

---

## Security notes

Worth knowing if you're taking this over:

- The browser never touches the database. Both forms post to
  `/.netlify/functions/submit`, which validates the input, writes it with the
  service role key and then emails the restaurant. The database has no public
  write access (see `0002_lock_down_public_writes.sql`).
- Order totals are computed server-side from `src/data/menu.ts`. A manipulated
  browser can't change what a customer is charged.
- The Stripe webhook only acts on the first `pending → paid` transition, so
  retries can't send duplicate confirmation emails.
- All user input is HTML-escaped before it goes into an email.
- Both forms carry a honeypot field; submissions that fill it are silently
  discarded.
- Security headers and a Content-Security-Policy are set in `public/_headers`
  and verified against the production build.

Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`) belong in Netlify's environment
variables and in your local `.env` — never in the repository.

---

## Before going live

- [ ] Replace the stock photography in `src/data/images.ts` with real photos
- [ ] Check every price in `src/data/menu.ts` against the real menu
- [ ] Add real reviews to `src/data/reviews.ts` (only genuine ones — inventing
      reviews is illegal in the EU)
- [ ] Fill in the remaining placeholders in `public/privacy.html` and
      `public/terms.html`, and have them reviewed
- [ ] Enable **Bancontact** in Stripe — most Belgian customers expect it
- [ ] Work through the checklist in [DEPLOYMENT.md](DEPLOYMENT.md)
