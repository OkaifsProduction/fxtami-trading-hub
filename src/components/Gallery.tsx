import type { CSSProperties } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { galleryPhotos, type GalleryPhoto } from "../data/gallery";
import { useStaggerReveal } from "../hooks/useReveal";

const spanClasses: Record<NonNullable<GalleryPhoto["span"]> | "normal", string> = {
  tall: "sm:row-span-2",
  wide: "sm:col-span-2",
  normal: "",
};

export function Gallery() {
  const gridRef = useStaggerReveal<HTMLDivElement>();

  return (
    <section id="gallery" className="bg-paper py-28 md:py-40">
      <Container>
        <SectionHeading
          align="left"
          kicker="La Cucina"
          title={
            <>
              Een vleugje <em>Italië</em>
            </>
          }
          description="Pizza, pasta en de producten die de Italiaanse keuken zo eerlijk en herkenbaar maken."
        />
      </Container>

      <Container wide>
        <div
          ref={gridRef}
          className="mt-14 grid grid-flow-dense grid-cols-2 gap-3 md:mt-20 sm:grid-cols-4 sm:auto-rows-[220px] md:gap-4 lg:auto-rows-[280px]"
        >
          {galleryPhotos.map((photo, i) => (
            <figure
              key={photo.src}
              style={{ "--stagger": i } as CSSProperties}
              className={`reveal-stagger-item group relative overflow-hidden rounded-3xl bg-mist aspect-square sm:aspect-auto ${spanClasses[photo.span ?? "normal"]}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1600ms] ease-expo group-hover:scale-[1.06]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0 transition-opacity duration-700 md:opacity-0 md:group-hover:opacity-100"
                aria-hidden="true"
              />
              <figcaption className="absolute bottom-4 left-5 font-serif text-[22px] italic text-paper transition-all duration-700 ease-expo md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
