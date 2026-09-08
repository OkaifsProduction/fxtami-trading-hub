import { useState } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { menuCategories } from "../data/menu";

export function Menu() {
  const [activeId, setActiveId] = useState(menuCategories[0].id);
  const active = menuCategories.find((c) => c.id === activeId) ?? menuCategories[0];

  return (
    <section id="menu" className="bg-charcoal py-24 md:py-32">
      <Container>
        <SectionHeading
          light
          eyebrow="La Carta"
          title="Explore Our Menu"
          description="From wood-fired pizza to handmade pasta — browse every category of our kitchen."
        />

        <div
          role="tablist"
          aria-label="Menu categories"
          className="mt-12 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={`shrink-0 rounded-full border px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                  isActive
                    ? "border-gold bg-gold text-charcoal"
                    : "border-cream/20 text-cream/60 hover:border-cream/50 hover:text-cream"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mt-12">
          {active.note && (
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gold">{active.note}</p>
          )}
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {active.items.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline justify-between gap-6 border-b border-cream/10 py-5"
              >
                <div className="min-w-0">
                  <h3 className="font-serif italic text-xl text-cream">{item.name}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-cream/50">{item.description}</p>
                  )}
                </div>
                <span className="shrink-0 font-serif text-lg text-gold">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
