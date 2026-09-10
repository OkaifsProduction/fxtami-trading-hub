import { images } from "./images";

export interface Dish {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  tag?: string;
}

/**
 * Uitgelichte gerechten uit de echte kaart (zie menu.ts) — dezelfde id's, zodat
 * "toevoegen" hier en vanuit de digitale kaart hetzelfde bestelitem raakt.
 */
export const popularDishes: Dish[] = [
  {
    id: "pizza-davinci",
    name: "Pizza Da Vinci",
    description: "Scampi, spek, hesp, gorgonzola, salami, paprika, look.",
    priceCents: 1050,
    image: images.dishDiavola,
    tag: "Huisspecialiteit",
  },
  {
    id: "pizza-margarita",
    name: "Pizza Margarita",
    description: "Tomatensaus en kaas — de Italiaanse klassieker.",
    priceCents: 700,
    image: images.dishMargherita,
    tag: "Klassieker",
  },
  {
    id: "pasta-carbonara",
    name: "Spaghetti Carbonara",
    description: "Spek, hesp, parmezaan en ei in een romige saus.",
    priceCents: 1200,
    image: images.dishCarbonara,
  },
  {
    id: "pasta-lasagne",
    name: "Lasagne",
    description: "Rundergehakt en hesp in tomatenroomsaus.",
    priceCents: 1100,
    image: images.dishQuattroFormaggi,
  },
  {
    id: "salade-davinci",
    name: "Salade Da Vinci",
    description: "Garnalen, tonijn, hesp, kaas, artisjokken, maïs en ananas.",
    priceCents: 1350,
    image: images.gallerySalad,
  },
  {
    id: "vlees-scampi-grilla",
    name: "Scampi alla Grilla",
    description: "Gegrilde gamba's, op z'n Italiaans bereid.",
    priceCents: 2300,
    image: images.dishBurrata,
    tag: "Vis",
  },
];
