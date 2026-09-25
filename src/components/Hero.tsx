import { Container } from "./Container";
import { Button } from "./Button";
import { OpenStatusPill } from "./OpenStatusPill";
import { splitWords } from "./Word";
import { useReveal, useWordReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";
import { images } from "../data/images";
import { restaurant } from "../data/restaurant";

const LINE_1 = "Authentieke Italiaanse pizza,";
const LINE_1_WORD_COUNT = LINE_1.split(" ").length;
const LINE_2 = "gemaakt met passie.";

// React 18 doesn't know the camelCase `fetchPriority` prop and drops it with a
// warning; the lowercase DOM attribute is passed through untouched.
const highPriority = { fetchpriority: "high" } as Record<string, string>;

export function Hero() {
  const metaRef = useReveal<HTMLDivElement>();
  const headlineRef = useWordReveal<HTMLHeadingElement>();
  const subRef = useReveal<HTMLDivElement>();
  const imageWrapRef = useReveal<HTMLDivElement>();
  const imageRef = useParallax<HTMLImageElement>(48);

  return (
    <section id="home" className="relative overflow-hidden bg-paper pt-16">
      {/* Abstract gradient mesh — stands in for literal Italian-flag iconography. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[680px] w-[680px] -translate-x-[95%] rounded-full bg-burgundy/30 blur-[120px] animate-drift" />
        <div className="absolute -top-10 left-1/2 h-[560px] w-[560px] translate-x-[10%] rounded-full bg-terracotta/30 blur-[120px] animate-drift [animation-delay:-6s]" />
        <div className="absolute top-72 left-1/2 h-[460px] w-[460px] -translate-x-[30%] rounded-full bg-gold/30 blur-[110px] animate-drift [animation-delay:-11s]" />
      </div>

      <Container wide className="relative pt-14 md:pt-24">
        <div ref={metaRef} className="reveal flex flex-wrap items-center justify-center gap-3 text-center">
          <OpenStatusPill />
          <span className="hidden text-[13px] font-medium text-stone sm:inline">
            {restaurant.tagline} · Beverst, Bilzen
          </span>
        </div>

        <h1
          ref={headlineRef}
          className="display mx-auto mt-8 text-center text-[clamp(3.25rem,6.4vw+0.25rem,8.5rem)] leading-[0.95] text-ink md:mt-10"
        >
          <span className="block">{splitWords(LINE_1)}</span>{" "}
          <em className="block italic text-burgundy">{splitWords(LINE_2, LINE_1_WORD_COUNT)}</em>
        </h1>

        <div ref={subRef} style={{ transitionDelay: "450ms" }} className="reveal mx-auto mt-8 max-w-xl text-center md:mt-10">
          <p className="text-[17px] leading-relaxed text-stone md:text-lg">
            Traditionele recepten en de smaak van Italië — elke avond vers voor u bereid, om ter plaatse van te
            genieten of af te halen.
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button href={restaurant.orderOnlineUrl} variant="primary" arrow>
              Bestel online
            </Button>
            <Button href={restaurant.reserveUrl} variant="outline">
              Reserveer een tafel
            </Button>
          </div>
        </div>
      </Container>

      <div className="relative mt-16 px-3 md:mt-24 md:px-6">
        <div
          ref={imageWrapRef}
          className="reveal-clip relative mx-auto aspect-[4/5] w-full max-w-[1600px] overflow-hidden rounded-4xl bg-mist sm:aspect-[16/10] lg:aspect-[21/10]"
        >
          <img
            ref={imageRef}
            src={images.heroPizza}
            alt="Vers gebakken pizza met gesmolten kaas, kerstomaten en rozemarijn"
            className="absolute -top-[12%] left-0 h-[124%] w-full object-cover will-change-transform"
            {...highPriority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/10" aria-hidden="true" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-paper sm:flex-row sm:items-end sm:justify-between md:p-10">
            <div>
              <p className="font-serif text-[clamp(1.75rem,2vw+1rem,2.75rem)] leading-none">
                {restaurant.address.line1}
              </p>
              <p className="mt-2 text-[14px] text-paper/70">{restaurant.address.line2}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={restaurant.phoneHref}
                className="inline-flex min-h-11 items-center rounded-full border border-paper/25 bg-paper/10 px-5 text-[14px] font-medium backdrop-blur-md transition-colors hover:bg-paper hover:text-ink"
              >
                {restaurant.phone}
              </a>
              <a
                href={restaurant.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-paper/25 bg-paper/10 px-5 text-[14px] font-medium backdrop-blur-md transition-colors hover:bg-paper hover:text-ink"
              >
                Route
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
