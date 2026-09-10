/** Single source of truth for turning a price in cents into a display string — keeps
 * what's shown on screen and what Stripe actually charges from ever drifting apart. */
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}
