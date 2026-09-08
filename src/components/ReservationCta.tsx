import { Button } from "./Button";
import { images } from "../data/images";
import { restaurant } from "../data/restaurant";

export function ReservationCta() {
  return (
    <section id="order" className="relative overflow-hidden py-28 md:py-36">
      <img
        src={images.ctaBackground}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/80" />

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Reserve or Order</span>
        <h2 className="mt-5 font-serif italic text-4xl leading-tight text-cream sm:text-5xl md:text-6xl">
          Your table is waiting.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-cream/70">
          Join us for an evening of authentic Italian flavors, or have your favorites delivered
          straight to your door.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={restaurant.phoneHref} variant="primary">
            Reserve a Table
          </Button>
          <Button href={restaurant.orderOnlineUrl} variant="outline-light">
            Order Online
          </Button>
        </div>
      </div>
    </section>
  );
}
