import { useState } from "react";
import type { Dish } from "../data/dishes";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";

export function DishCard({ dish }: { dish: Dish }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id: dish.id, name: dish.name, priceCents: dish.priceCents });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-4xl bg-mist transition-all duration-500 hover:bg-mist-dark">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex flex-1 flex-col p-7">
        {dish.tag && (
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-stone-light">
            {dish.tag}
          </span>
        )}
        <div className="mt-1.5 flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-semibold tracking-tight text-ink">{dish.name}</h3>
          <span className="whitespace-nowrap text-base font-semibold text-ink">
            {formatPrice(dish.priceCents)}
          </span>
        </div>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-stone">{dish.description}</p>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-5 inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-ink transition-all group-hover:gap-2.5"
        >
          {added ? "Added ✓" : "Add to order"}
          {!added && (
            <svg width="15" height="10" viewBox="0 0 15 10" fill="none" aria-hidden="true">
              <path
                d="M1 5h12M8 1l5 4-5 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}
