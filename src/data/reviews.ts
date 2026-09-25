export interface Review {
  name: string;
  source: string;
  rating: number;
  quote: string;
}

/**
 * Alleen ECHTE reviews toevoegen (bv. overgenomen van Google, met vermelding
 * van de bron). Verzonnen of niet-verifieerbare reviews publiceren is in de EU
 * verboden (Richtlijn 2019/2161). Zolang deze lijst leeg is, wordt de
 * review-sectie automatisch niet getoond.
 *
 * Voorbeeld:
 * { name: "Voornaam N.", source: "Google", rating: 5, quote: "…" },
 */
export const reviews: Review[] = [];
