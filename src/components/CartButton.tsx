import { useCart } from "../lib/cart";

export function CartButton({ light = false }: { light?: boolean }) {
  const { itemCount, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open winkelwagen${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className={`relative z-50 flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-500 ${
        light ? "text-paper hover:bg-paper/10" : "text-ink hover:bg-ink/[0.05]"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" strokeLinejoin="round" />
        <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-semibold tabular-nums text-paper ring-2 ring-paper">
          {itemCount}
        </span>
      )}
    </button>
  );
}
