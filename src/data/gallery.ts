import { images } from "./images";

export interface GalleryPhoto {
  src: string;
  alt: string;
  span?: "tall" | "wide" | "normal";
}

export const galleryPhotos: GalleryPhoto[] = [
  { src: images.galleryPizza, alt: "Fresh pizza dough stretched by hand", span: "tall" },
  { src: images.galleryInterior, alt: "Warm, intimate dining room interior" },
  { src: images.galleryChef, alt: "Chef preparing a dish in the kitchen" },
  { src: images.galleryIngredients, alt: "Fresh tomatoes, basil and olive oil" },
  { src: images.galleryPastaClose, alt: "Close-up of a cheese-laced pizza slice", span: "wide" },
  { src: images.galleryWine, alt: "A glass of Italian red wine" },
  { src: images.galleryDough, alt: "Hands kneading fresh dough" },
  { src: images.gallerySalad, alt: "Fresh Italian salad" },
];
