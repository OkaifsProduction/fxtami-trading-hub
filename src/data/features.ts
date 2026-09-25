import { menuCategories } from "./menu";

export interface Feature {
  title: string;
  description: string;
}

const pizzaCount = menuCategories.find((c) => c.id === "pizza")?.items.length ?? 0;

// Alleen uitspraken die aantoonbaar kloppen (afgeleid uit de echte kaart en
// openingsuren). Specifieke claims — "steenoven", "48 uur gerezen deeg",
// "San Marzano" — pas toevoegen als het restaurant ze bevestigt.
export const features: Feature[] = [
  {
    title: "Italiaanse klassiekers",
    description: "Van Margarita en Quattro Formaggio tot Spaghetti Carbonara en Lasagne.",
  },
  {
    title: "Vers bereid",
    description: "Elk gerecht wordt op bestelling klaargemaakt in onze eigen keuken.",
  },
  {
    title: `${pizzaCount} pizza's op de kaart`,
    description: "In Ø26 cm of Ø30 cm — aangevuld met pasta, vlees, vis en salades.",
  },
  {
    title: "Tafelen of afhalen",
    description: "Reserveer een tafel voor een avond uit, of bestel online en haal af.",
  },
];
