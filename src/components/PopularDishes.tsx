import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { DishCard } from "./DishCard";
import { popularDishes } from "../data/dishes";

export function PopularDishes() {
  return (
    <section className="bg-paper py-28 md:py-36">
      <Container>
        <SectionHeading
          kicker="Publieksfavorieten"
          title="Onze meest geliefde gerechten"
          description="Een selectie van de gerechten waar onze gasten steeds voor terugkomen — elke dag vers bereid."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </Container>
    </section>
  );
}
