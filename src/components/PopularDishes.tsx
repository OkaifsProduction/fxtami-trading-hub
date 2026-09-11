import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { DishCard } from "./DishCard";
import { popularDishes } from "../data/dishes";
import { useStaggerReveal } from "../hooks/useReveal";
import type { CSSProperties } from "react";

export function PopularDishes() {
  const gridRef = useStaggerReveal<HTMLDivElement>();

  return (
    <section className="bg-paper py-28 md:py-36">
      <Container>
        <SectionHeading
          kicker="Publieksfavorieten"
          title="Onze meest geliefde gerechten"
          description="Een selectie van de gerechten waar onze gasten steeds voor terugkomen — elke dag vers bereid."
        />

        <div ref={gridRef} className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularDishes.map((dish, i) => (
            <div key={dish.id} className="reveal-stagger-item h-full" style={{ "--stagger": i } as CSSProperties}>
              <DishCard dish={dish} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
