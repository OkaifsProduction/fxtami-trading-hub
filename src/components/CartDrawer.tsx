import { useState } from "react";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { restaurant } from "../data/restaurant";

export function CartDrawer() {
  const { items, isOpen, subtotalCents, close, removeItem, setQuantity } = useCart();
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCheckout() {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          notes,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Checkout failed (${res.status})`);
      }
      const { url } = await res.json();
      if (!url) throw new Error("Checkout session did not return a redirect URL.");
      window.location.href = url;
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong starting checkout. Please try again or call us to order.",
      );
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/[0.08] px-6 py-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Your Order</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone hover:bg-mist hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-[15px] text-stone">Your cart is empty.</p>
            <p className="text-[13px] text-stone-light">Add something from the menu to get started.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[13px] text-stone-light">{formatPrice(item.priceCents)} each</p>
                    <div className="mt-2 inline-flex items-center gap-3 rounded-full border border-ink/10 px-2 py-1">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-ink hover:bg-mist"
                      >
                        −
                      </button>
                      <span className="min-w-4 text-center text-[13px] font-semibold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-ink hover:bg-mist"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[15px] font-semibold text-ink">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[12px] font-medium text-stone-light hover:text-burgundy"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <label htmlFor="cart-notes" className="mb-1.5 block text-[13px] font-medium text-stone">
                Notes for the kitchen (optional)
              </label>
              <textarea
                id="cart-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, pickup time, extra sauce…"
                className="w-full resize-none rounded-xl border border-ink/15 bg-mist/60 px-3 py-2 text-[14px] text-ink outline-none transition-colors focus:border-ink"
              />
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-ink/[0.08] px-6 py-5">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-stone">Subtotal</span>
              <span className="font-semibold text-ink">{formatPrice(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-[12px] text-stone-light">Taxes calculated at checkout. Pickup order.</p>

            {status === "error" && (
              <p className="mt-3 rounded-xl bg-burgundy-light px-3 py-2 text-[13px] text-burgundy-dark">
                {errorMessage} Or call us at{" "}
                <a href={restaurant.phoneHref} className="underline">
                  {restaurant.phone}
                </a>
                .
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={status === "loading"}
              className="mt-4 flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-paper transition-all hover:bg-graphite hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "loading" ? "Redirecting to checkout…" : `Checkout — ${formatPrice(subtotalCents)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
