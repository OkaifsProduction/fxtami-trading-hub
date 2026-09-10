import { useState } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { menuCategories } from "../data/menu";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";

export function Menu() {
  const [activeId, setActiveId] = useState(menuCategories[0].id);
  const active = menuCategories.find((c) => c.id === activeId) ?? menuCategories[0];
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  function handleAdd(item: { id: string; name: string; priceCents: number }) {
    addItem({ id: item.id, name: item.name, priceCents: item.priceCents });
    setJustAdded(item.id);
    window.setTimeout(() => setJustAdded((cur) => (cur === item.id ? null : cur)), 1200);
  }

  return (
    <section id="menu" className="bg-mist py-28 md:py-36">
      <Container>
        <SectionHeading
          kicker="La Carta"
          title="Ontdek onze kaart"
          description="Van steenoven pizza tot huisgemaakte pasta — blader door elke categorie van onze keuken."
        />

        <div
          role="tablist"
          aria-label="Menucategorieën"
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
                key={item.id}
                className="flex items-center justify-between gap-4 border-b border-ink/[0.08] py-5"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-[17px] font-semibold text-ink">{item.name}</h3>
                  {item.description && (
                    <p className="mt-1 text-[14px] leading-relaxed text-stone">{item.description}</p>
                  )}
                </div>
                <span className="shrink-0 text-[15px] font-semibold text-ink">
                  {formatPrice(item.priceCents)}
                </span>
                <button
                  type="button"
                  onClick={() => handleAdd(item)}
                  aria-label={`Voeg ${item.name} toe aan bestelling`}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    justAdded === item.id
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-paper"
                  }`}
                >
                  {justAdded === item.id ? (
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 8.5 6 12l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
