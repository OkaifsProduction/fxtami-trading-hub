import { images } from "./images";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  tag?: string;
}

export const popularDishes: Dish[] = [
  {
    id: "margherita",
    name: "Margherita",
    description: "San Marzano tomato, fior di latte, fresh basil, extra virgin olive oil.",
    price: "$16",
    image: images.dishMargherita,
    tag: "Classic",
  },
  {
    id: "diavola",
    name: "Diavola",
    description: "Spicy salami, San Marzano tomato, mozzarella, Calabrian chili oil.",
    price: "$19",
    image: images.dishDiavola,
    tag: "Spicy",
  },
  {
    id: "burrata",
    name: "Burrata Pizza",
    description: "Creamy burrata, cherry tomatoes, basil pesto, aged balsamic.",
    price: "$21",
    image: images.dishBurrata,
    tag: "Signature",
  },
  {
    id: "quattro-formaggi",
    name: "Quattro Formaggi",
    description: "Mozzarella, gorgonzola, fontina and parmesan on a delicate white base.",
    price: "$20",
    image: images.dishQuattroFormaggi,
  },
  {
    id: "carbonara",
    name: "Pasta Carbonara",
    description: "Guanciale, egg yolk, pecorino romano, cracked black pepper.",
    price: "$18",
    image: images.dishCarbonara,
  },
  {
    id: "tiramisu",
    name: "Tiramisù",
    description: "Espresso-soaked savoiardi, mascarpone cream, cocoa.",
    price: "$10",
    image: images.dishTiramisu,
  },
];
