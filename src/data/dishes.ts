import { images } from "./images";

export interface Dish {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  tag?: string;
}

export const popularDishes: Dish[] = [
  {
    id: "margherita",
    name: "Margherita",
    description: "San Marzano tomato, fior di latte, fresh basil, extra virgin olive oil.",
    priceCents: 1600,
    image: images.dishMargherita,
    tag: "Classic",
  },
  {
    id: "diavola",
    name: "Diavola",
    description: "Spicy salami, San Marzano tomato, mozzarella, Calabrian chili oil.",
    priceCents: 1900,
    image: images.dishDiavola,
    tag: "Spicy",
  },
  {
    id: "burrata-pizza",
    name: "Burrata Pizza",
    description: "Creamy burrata, cherry tomatoes, basil pesto, aged balsamic.",
    priceCents: 2100,
    image: images.dishBurrata,
    tag: "Signature",
  },
  {
    id: "quattro-formaggi",
    name: "Quattro Formaggi",
    description: "Mozzarella, gorgonzola, fontina and parmesan on a delicate white base.",
    priceCents: 2000,
    image: images.dishQuattroFormaggi,
  },
  {
    id: "carbonara",
    name: "Pasta Carbonara",
    description: "Guanciale, egg yolk, pecorino romano, cracked black pepper.",
    priceCents: 1800,
    image: images.dishCarbonara,
  },
  {
    id: "tiramisu",
    name: "Tiramisù",
    description: "Espresso-soaked savoiardi, mascarpone cream, cocoa.",
    priceCents: 1000,
    image: images.dishTiramisu,
  },
];
