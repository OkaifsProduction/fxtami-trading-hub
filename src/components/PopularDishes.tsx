import type { CSSProperties } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { DishCard } from "./DishCard";
import { Button } from "./Button";
import { popularDishes } from "../data/dishes";
import { useStaggerReveal } from "../hooks/useReveal";

export function PopularDishes() {
  const gridRef = useStaggerReveal<HTMLDivElement>();

  return (
    <section className="bg-paper py-28 md:py-40">
      <Container>
        <SectionHeading
          align="left"
          kicker="Publieksfavorieten"
          title={
            <>
              Onze meest <em>geliefde</em> gerechten
            </>
          }
          description="Een greep uit de kaart — de gerechten waarvoor onze gasten steeds terugkomen."
          action={
            <Button href="#menu" variant="link">
              Volledige kaart
            </Button>
          }
        />
      </Container>

      {/* Mobile: a swipeable row that peeks the next card. md+: a regular grid. */}
      <div
        ref={gridRef}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 md:mx-auto md:mt-20 md:grid md:max-w-content md:snap-none md:grid-cols-2 md:gap-x-6 md:gap-y-14 md:overflow-visible md:px-10 lg:grid-cols-3"
      >
        {popularDishes.map((dish, i) => (
          <div
            key={dish.id}
            className="reveal-stagger-item w-[80%] shrink-0 snap-start sm:w-[55%] md:w-auto"
            style={{ "--stagger": i } as CSSProperties}
          >
            <DishCard dish={dish} />
          </div>
        ))}
      </div>
    </section>
  );
}
