import { useCart } from "../lib/cart";

export function CartButton() {
  const { itemCount, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open winkelwagen${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M6 6h15l-1.5 9h-12L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-bold text-paper">
          {itemCount}
        </span>
      )}
    </button>
  );
}
