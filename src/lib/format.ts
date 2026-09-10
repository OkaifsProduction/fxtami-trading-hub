/** Enige plek die centen omzet naar een prijs — zo kunnen het getoonde bedrag en
 * het bedrag dat Stripe echt afschrijft nooit uit elkaar lopen. */
export function formatPrice(cents: number): string {
  const euros = (cents / 100).toFixed(2).replace(".", ",");
  return `€ ${euros}`;
}
