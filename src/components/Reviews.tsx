import type { CSSProperties } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { reviews } from "../data/reviews";
import { useStaggerReveal } from "../hooks/useReveal";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-gold" role="img" aria-label={`${rating} van de 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M12 2.5 15 9l7 .9-5 4.9 1.3 7L12 18.3 5.7 21.8 7 14.8 2 9.9 9 9l3-6.5Z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

/** Renders nothing until real, verifiable reviews are added to data/reviews.ts. */
export function Reviews() {
  const gridRef = useStaggerReveal<HTMLDivElement>();
  if (reviews.length === 0) return null;

  return (
    <section className="bg-mist py-28 md:py-40">
      <Container>
        <SectionHeading
          kicker="Gasten"
          title={
            <>
              Wat onze gasten <em>zeggen</em>
            </>
          }
        />

        <div ref={gridRef} className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((review, i) => (
            <figure
              key={review.name}
              style={{ "--stagger": i } as CSSProperties}
              className="reveal-stagger-item flex flex-col rounded-4xl bg-paper p-9 md:p-11"
            >
              <Stars rating={review.rating} />
              <blockquote className="mt-6 flex-1 font-serif text-[26px] leading-snug text-ink">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-between border-t border-ink/[0.07] pt-5 text-[14px]">
                <span className="font-semibold text-ink">{review.name}</span>
                <span className="text-stone-light">via {review.source}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
