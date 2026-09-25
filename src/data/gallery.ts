import { images } from "./images";

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption: string;
  span?: "tall" | "wide";
}

/**
 * 1 tall + 1 wide + 8 normal = 12 cells = exactly three full rows on the
 * 4-column desktop grid (and five even rows on the 2-column mobile grid).
 * Keep that arithmetic in mind when adding or removing photos.
 */
export const galleryPhotos: GalleryPhoto[] = [
  { src: images.pizzaInOven, alt: "Een pizza die afbakt in een hete oven", caption: "Uit de oven", span: "tall" },
  { src: images.freshPasta, alt: "Verse pasta met kerstomaten, look en kruiden", caption: "Verse ingrediënten", span: "wide" },
  { src: images.redWine, alt: "Vrienden die klinken met een glas rode wijn", caption: "Salute" },
  { src: images.pizzaFloured, alt: "Pizza met tomaat en basilicum op een bebloemd werkblad", caption: "Pizza" },
  { src: images.spaghettiScampi, alt: "Spaghetti met scampi en kerstomaten in de pan", caption: "Pasta" },
  { src: images.tiramisu, alt: "Een stuk tiramisu met cacao", caption: "Dolci" },
  { src: images.tomatoes, alt: "Rijpe trostomaten aan de plant", caption: "Pomodori" },
  { src: images.penne, alt: "Penne in tomatensaus", caption: "Penne" },
  { src: images.pizzaSlices, alt: "Pizzapunten met tomaat en basilicum van bovenaf", caption: "Om te delen" },
  { src: images.pastaBolognese, alt: "Pasta bolognese in een donkere kom", caption: "Bolognese" },
];
