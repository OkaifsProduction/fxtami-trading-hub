import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { reviews } from "../data/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-ink" aria-label={`${rating} van de 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
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
    <section className="bg-mist py-28 md:py-36">
      <Container>
        <SectionHeading kicker="Reviews" title="Wat onze gasten zeggen" />

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <figure key={review.name} className="flex flex-col rounded-4xl bg-paper p-9">
              <Stars rating={review.rating} />
              <blockquote className="mt-5 flex-1 text-[19px] font-medium leading-relaxed tracking-tight text-ink">
                "{review.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/[0.08] pt-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist-dark text-sm font-semibold text-ink">
                  {review.name.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink">{review.name}</div>
                  <div className="text-[13px] text-stone-light">{review.detail}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
