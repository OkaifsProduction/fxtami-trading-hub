import type { CSSProperties } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { galleryPhotos } from "../data/gallery";
import { useStaggerReveal } from "../hooks/useReveal";

const spanClasses: Record<NonNullable<(typeof galleryPhotos)[number]["span"]>, string> = {
  tall: "sm:row-span-2",
  wide: "sm:col-span-2",
  normal: "",
};

export function Gallery() {
  const gridRef = useStaggerReveal<HTMLDivElement>();

  return (
    <section id="gallery" className="bg-paper py-28 md:py-36">
      <Container wide>
        <SectionHeading
          kicker="De Sfeer"
          title="Een vleugje Italië, vastgelegd"
          description="Pizza, pasta, en de mensen erachter — een kijkje binnen bij Da Vinci."
        />

        <div ref={gridRef} className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:auto-rows-[240px]">
          {galleryPhotos.map((photo, i) => (
            <div
              key={photo.src}
              style={{ "--stagger": i } as CSSProperties}
              className={`reveal-stagger-item group relative overflow-hidden rounded-3xl bg-mist aspect-square sm:aspect-auto ${
                spanClasses[photo.span ?? "normal"]
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
