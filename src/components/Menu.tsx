import { useState } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { menuCategories } from "../data/menu";

export function Menu() {
  const [activeId, setActiveId] = useState(menuCategories[0].id);
  const active = menuCategories.find((c) => c.id === activeId) ?? menuCategories[0];

  return (
    <section id="menu" className="bg-mist py-28 md:py-36">
      <Container>
        <SectionHeading
          kicker="La Carta"
          title="Explore our menu"
          description="From wood-fired pizza to handmade pasta — browse every category of our kitchen."
        />

        <div
          role="tablist"
          aria-label="Menu categories"
          className="mx-auto mt-12 flex max-w-fit gap-1 overflow-x-auto rounded-full border border-ink/10 bg-paper p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {menuCategories.map((category) => {
            const isActive = category.id === activeId;
            return (
              <button
                key={category.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveId(category.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
                  isActive ? "bg-ink text-paper" : "text-stone hover:text-ink"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mx-auto mt-14 max-w-4xl">
          {active.note && (
            <p className="mb-6 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-stone-light">
              {active.note}
            </p>
          )}
          <div className="grid grid-cols-1 gap-x-14 md:grid-cols-2">
            {active.items.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline justify-between gap-6 border-b border-ink/[0.08] py-5"
              >
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold text-ink">{item.name}</h3>
                  {item.description && (
                    <p className="mt-1 text-[14px] leading-relaxed text-stone">{item.description}</p>
                  )}
                </div>
                <span className="shrink-0 text-[15px] font-semibold text-ink">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
