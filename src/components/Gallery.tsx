import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { galleryPhotos } from "../data/gallery";

const spanClasses: Record<NonNullable<(typeof galleryPhotos)[number]["span"]>, string> = {
  tall: "sm:row-span-2",
  wide: "sm:col-span-2",
  normal: "",
};

export function Gallery() {
  return (
    <section id="gallery" className="bg-white py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="The Atmosphere"
          title="A Taste of Italy, Captured"
          description="Pizza, pasta, and the people behind them — a glimpse inside Da Vinci."
        />

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:auto-rows-[220px]">
          {galleryPhotos.map((photo) => (
            <div
              key={photo.src}
              className={`group relative overflow-hidden rounded-2xl aspect-square sm:aspect-auto ${
                spanClasses[photo.span ?? "normal"]
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
