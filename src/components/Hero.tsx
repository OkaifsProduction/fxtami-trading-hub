import { Container } from "./Container";
import { Button } from "./Button";
import { images } from "../data/images";
import { restaurant } from "../data/restaurant";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-cream pt-20">
      <Container className="grid items-center gap-14 py-16 md:py-24 lg:grid-cols-2 lg:gap-10">
        <div className="max-w-xl animate-fadeUp">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-burgundy">
            <span className="h-px w-8 bg-burgundy" />
            {restaurant.tagline} · Est. Tradition
          </span>

          <h1 className="mt-6 text-[2.75rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.2rem]">
            Authentic Italian Pizza.
            <br />
            <span className="font-serif italic font-normal text-burgundy">Made with Passion.</span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-stone">
            Traditional recipes, quality ingredients and the taste of Italy — freshly prepared for
            you.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={restaurant.orderOnlineUrl} variant="primary">
              Order Online
            </Button>
            <Button href="#menu" variant="secondary">
              View Menu
            </Button>
          </div>

          <div className="mt-14 flex items-center gap-8 border-t border-ink/10 pt-8">
            <div>
              <div className="font-serif italic text-3xl text-ink">25+</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone">
                Years of craft
              </div>
            </div>
            <div className="h-10 w-px bg-ink/10" />
            <div>
              <div className="font-serif italic text-3xl text-ink">900°F</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone">
                Wood-fired oven
              </div>
            </div>
            <div className="h-10 w-px bg-ink/10" />
            <div>
              <div className="font-serif italic text-3xl text-ink">100%</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone">
                Italian ingredients
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 hidden rounded-[2.5rem] bg-burgundy-light md:block" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-card-hover md:aspect-[9/11]">
            <img
              src={images.heroPizza}
              srcSet={`${images.heroPizzaSmall} 800w, ${images.heroPizza} 1400w`}
              sizes="(min-width: 1024px) 560px, 90vw"
              alt="Close-up of a freshly baked wood-fired Margherita pizza with bubbling mozzarella and fresh basil"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-cream px-6 py-4 shadow-card md:block">
            <p className="font-serif italic text-lg text-ink">"Every pie, hand-stretched daily."</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
