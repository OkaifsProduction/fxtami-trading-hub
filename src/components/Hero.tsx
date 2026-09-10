import { Container } from "./Container";
import { Button } from "./Button";
import { images } from "../data/images";
import { restaurant } from "../data/restaurant";

export function Hero() {
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
          <span className="inline-flex items-center rounded-full border border-ink/10 bg-paper/70 px-4 py-1.5 text-[13px] font-medium text-stone backdrop-blur-sm">
            {restaurant.tagline} — Beverst, Bilzen
          </span>

          <h1 className="mt-7 text-[3.2rem] font-bold leading-[0.98] tracking-tightest text-ink sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            Authentieke
            <br />
            Italiaanse Pizza.
          </h1>
          <p className="mt-3 text-[3.2rem] font-bold leading-[0.98] tracking-tightest text-stone-light sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            Gemaakt met passie.
          </p>

          <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-stone">
            Traditionele recepten, kwaliteitsingrediënten en de smaak van
            Italië — vers voor u bereid.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
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
        <div className="relative mx-auto aspect-[16/10] w-full max-w-wide overflow-hidden bg-mist md:rounded-t-[3rem]">
          <img
            src={images.heroPizza}
            alt="Close-up van een vers gebakken Margarita-pizza met gesmolten mozzarella en verse basilicum"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/0 to-ink/0" />
        </div>
      </div>
    </section>
  );
}
