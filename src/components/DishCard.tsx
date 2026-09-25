import { useEffect, useRef, useState } from "react";
import type { Dish } from "../data/dishes";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";

export function DishCard({ dish }: { dish: Dish }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleAdd() {
    addItem({ id: dish.id, name: dish.name, priceCents: dish.priceCents });
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mist">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1600ms] ease-expo group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" aria-hidden="true" />
        {dish.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-paper/85 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur-md">
            {dish.tag}
          </span>
        )}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Voeg ${dish.name} toe aan bestelling`}
          className={`absolute bottom-4 right-4 flex h-12 items-center gap-2 rounded-full pl-5 pr-4 text-[14px] font-medium shadow-lg backdrop-blur-md transition-all duration-500 ease-expo ${
            added ? "bg-gold text-ink" : "bg-paper/90 text-ink hover:bg-ink hover:text-paper"
          }`}
        >
          {added ? "Toegevoegd" : "Toevoegen"}
          {added ? (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8.5 6 12l8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-serif text-[28px] leading-[1.05] text-ink">{dish.name}</h3>
          <span className="whitespace-nowrap text-[15px] font-semibold tabular-nums text-ink">
            {formatPrice(dish.priceCents)}
          </span>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-stone">{dish.description}</p>
      </div>
    </article>
  );
}
