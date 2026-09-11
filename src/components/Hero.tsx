import { Container } from "./Container";
import { Button } from "./Button";
import { splitWords } from "./Word";
import { useReveal, useWordReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";
import { images } from "../data/images";
import { restaurant } from "../data/restaurant";

const LINE_1 = "Authentieke Italiaanse Pizza.";
const LINE_1_WORD_COUNT = LINE_1.split(" ").length;
const LINE_2 = "Gemaakt met passie.";

export function Hero() {
  const badgeRef = useReveal<HTMLSpanElement>();
  const headlineRef = useWordReveal<HTMLDivElement>();
  const subtextRef = useReveal<HTMLParagraphElement>();
  const buttonsRef = useReveal<HTMLDivElement>();
  const imageWrapRef = useReveal<HTMLDivElement>();
  const imageRef = useParallax<HTMLImageElement>(28);

  return (
    <section id="home" className="relative overflow-hidden bg-paper pt-14">
      {/* Abstract gradient mesh — stands in for literal Italian-flag iconography. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-[620px] w-[620px] -translate-x-[85%] rounded-full bg-burgundy/45 blur-[100px] animate-drift" />
        <div className="absolute top-16 left-1/2 h-[520px] w-[520px] translate-x-[5%] rounded-full bg-terracotta/40 blur-[100px] animate-drift [animation-delay:-6s]" />
        <div className="absolute top-64 left-1/2 h-[440px] w-[440px] -translate-x-[35%] rounded-full bg-gold/35 blur-[95px] animate-drift [animation-delay:-11s]" />
      </div>

      <Container className="relative pt-24 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <span
            ref={badgeRef}
            className="reveal inline-flex items-center rounded-full border border-ink/10 bg-paper/70 px-4 py-1.5 text-[13px] font-medium text-stone backdrop-blur-sm"
          >
            {restaurant.tagline} — Beverst, Bilzen
          </span>

          <div ref={headlineRef}>
            <h1 className="mt-7 text-[clamp(2.75rem,5vw+1.5rem,7.5rem)] font-bold leading-[0.98] tracking-tightest text-ink">
              {splitWords(LINE_1)}
            </h1>
            <p className="mt-3 text-[clamp(2.75rem,5vw+1.5rem,7.5rem)] font-bold leading-[0.98] tracking-tightest text-stone-light">
              {splitWords(LINE_2, LINE_1_WORD_COUNT)}
            </p>
          </div>

          <p
            ref={subtextRef}
            style={{ transitionDelay: "280ms" }}
            className="reveal mx-auto mt-8 max-w-md text-lg leading-relaxed text-stone"
          >
            Traditionele recepten, kwaliteitsingrediënten en de smaak van
            Italië — vers voor u bereid.
          </p>

          <div
            ref={buttonsRef}
            style={{ transitionDelay: "420ms" }}
            className="reveal mt-10 flex flex-wrap items-center justify-center gap-5"
          >
            <Button href={restaurant.orderOnlineUrl} variant="primary">
              Bestel Online
            </Button>
            <Button href="#menu" variant="link">
              Bekijk Menu
            </Button>
          </div>
        </div>
      </Container>

      <div className="relative mt-16 md:mt-24">
        <div
          ref={imageWrapRef}
          style={{ transitionDelay: "180ms" }}
          className="reveal-scale relative mx-auto aspect-[16/10] w-full max-w-wide overflow-hidden bg-mist md:rounded-t-[3rem]"
        >
          <img
            ref={imageRef}
            src={images.heroPizza}
            alt="Close-up van een vers gebakken Margarita-pizza met gesmolten mozzarella en verse basilicum"
            className="absolute -top-[15%] left-0 h-[130%] w-full object-cover will-change-transform"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/0 to-ink/0" />
        </div>
      </div>
    </section>
  );
}
