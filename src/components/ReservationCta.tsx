import { Button } from "./Button";
import { restaurant } from "../data/restaurant";

export function ReservationCta() {
  return (
    <section id="order" className="relative overflow-hidden bg-ink py-32 md:py-44">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-burgundy/30 blur-[140px] animate-drift" />
        <div className="absolute left-1/3 top-1/3 h-[420px] w-[420px] rounded-full bg-terracotta/20 blur-[120px] animate-drift [animation-delay:-8s]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-paper/40">
          Reserveer of Bestel
        </span>
        <h2 className="mt-5 text-5xl font-semibold tracking-tightest leading-[1.05] text-paper sm:text-6xl md:text-7xl">
          Uw tafel staat klaar.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-paper/50">
          Kom genieten van een avond authentieke Italiaanse smaken, of bestel uw favorieten
          online om af te halen.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={restaurant.reserveUrl} variant="primary-light">
            Reserveer een Tafel
          </Button>
          <Button href={restaurant.orderOnlineUrl} variant="outline-light">
            Bestel Online
          </Button>
        </div>
      </div>
    </section>
  );
}
