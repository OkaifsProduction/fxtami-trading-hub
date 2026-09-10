import { images } from "./images";

export interface GalleryPhoto {
  src: string;
  alt: string;
  span?: "tall" | "wide" | "normal";
}

export const galleryPhotos: GalleryPhoto[] = [
  { src: images.galleryPizza, alt: "Vers pizzadeeg met de hand uitgerold", span: "tall" },
  { src: images.galleryInterior, alt: "Warm, gezellig interieur van het restaurant" },
  { src: images.galleryChef, alt: "De chef aan het werk in de keuken" },
  { src: images.galleryIngredients, alt: "Verse tomaten, basilicum en olijfolie" },
  { src: images.galleryPastaClose, alt: "Close-up van een pizzapunt met gesmolten kaas", span: "wide" },
  { src: images.galleryWine, alt: "Een glas Italiaanse rode wijn" },
  { src: images.galleryDough, alt: "Handen die vers deeg kneden" },
  { src: images.gallerySalad, alt: "Frisse Italiaanse salade" },
];
