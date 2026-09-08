import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { reviews } from "../data/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-gold" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M12 2.5 15 9l7 .9-5 4.9 1.3 7L12 18.3 5.7 21.8 7 14.8 2 9.9 9 9l3-6.5Z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Testimonials"
          title="What Our Guests Say"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col rounded-[1.75rem] bg-white p-8 shadow-card"
            >
              <Stars rating={review.rating} />
              <blockquote className="mt-5 flex-1 font-serif italic text-xl leading-relaxed text-ink">
                "{review.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy-light text-sm font-bold text-burgundy">
                  {review.name.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-bold text-ink">{review.name}</div>
                  <div className="text-xs text-stone">{review.detail}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
