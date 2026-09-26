import { Button } from "./Button";
import { restaurant } from "../data/restaurant";
import { useReveal } from "../hooks/useReveal";

export function ReservationCta() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="order" className="grain relative overflow-hidden bg-ink py-32 md:py-48">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy/35 blur-[140px] animate-drift" />
        <div className="absolute left-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-terracotta/20 blur-[120px] animate-drift [animation-delay:-8s]" />
        <div className="absolute bottom-0 right-1/4 h-[360px] w-[360px] rounded-full bg-gold/15 blur-[120px] animate-drift [animation-delay:-13s]" />
      </div>

      <div ref={ref} className="reveal relative mx-auto max-w-4xl px-6 text-center">
        <span className="kicker text-paper/60">Reserveer of bestel</span>
        <h2 className="display mt-8 text-[clamp(3.25rem,6vw+1rem,8rem)] leading-[0.92] text-paper">
          Uw tafel <em className="italic text-gold">staat klaar.</em>
        </h2>
        <p className="mx-auto mt-8 max-w-md text-[17px] leading-relaxed text-paper/55 md:text-lg">
          Kom genieten van een avond Italiaanse smaken, of bestel uw favorieten online om af te halen.
        </p>
        <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button href={restaurant.reserveUrl} variant="primary-light" arrow magnetic>
            Reserveer een tafel
          </Button>
          <Button href={restaurant.orderOnlineUrl} variant="outline-light" magnetic>
            Bestel online
          </Button>
        </div>
      </div>
    </section>
  );
}
