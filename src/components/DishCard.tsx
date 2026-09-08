import type { Dish } from "../data/dishes";
import { restaurant } from "../data/restaurant";

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        {dish.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-burgundy backdrop-blur-sm">
            {dish.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif italic text-2xl text-ink">{dish.name}</h3>
          <span className="whitespace-nowrap pt-1 font-serif text-lg text-burgundy">{dish.price}</span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">{dish.description}</p>

        <a
          href={restaurant.orderOnlineUrl}
          className="mt-5 inline-flex items-center gap-2 self-start text-xs font-bold uppercase tracking-[0.14em] text-ink transition-all group-hover:gap-3 group-hover:text-burgundy"
        >
          Add to Order
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
            <path
              d="M1 5h13M9 1l5 4-5 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
