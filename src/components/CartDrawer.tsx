import { useState } from "react";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { restaurant } from "../data/restaurant";
import { useDialog } from "../hooks/useDialog";

export function CartDrawer() {
  const { items, isOpen, subtotalCents, close, removeItem, setQuantity } = useCart();
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const panelRef = useDialog<HTMLDivElement>(isOpen, close);

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
        throw new Error(body?.error ?? `Afrekenen mislukt (${res.status})`);
      }
      const { url } = await res.json();
      if (!url) throw new Error("Checkout-sessie gaf geen doorverwijzing terug.");
      window.location.href = url;
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Er ging iets mis bij het starten van de checkout. Probeer opnieuw of bel ons om te bestellen.",
      );
    }
  }

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}>
      <div
        onClick={close}
        aria-hidden="true"
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper shadow-[0_0_80px_rgba(0,0,0,0.18)] outline-none transition-transform duration-700 ease-expo sm:inset-y-2 sm:right-2 sm:rounded-4xl ${
          isOpen ? "translate-x-0" : "translate-x-[105%]"
        }`}
      >
        <div className="flex items-center justify-between px-7 pb-5 pt-6">
          <div>
            <span className="kicker text-stone">Afhalen</span>
            <h2 id="cart-title" className="display mt-3 text-[40px] text-ink">
              Uw <em className="italic text-burgundy">bestelling</em>
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            data-autofocus
            aria-label="Sluit winkelwagen"
            className="flex h-11 w-11 items-center justify-center self-start rounded-full bg-mist text-ink transition-colors hover:bg-mist-dark"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-7 text-center">
            <p className="display text-3xl text-ink">Nog leeg.</p>
            <p className="max-w-[16rem] text-[15px] leading-relaxed text-stone">
              Kies iets lekkers van de kaart — het verschijnt hier.
            </p>
            <a
              href="#menu"
              onClick={close}
              className="mt-2 inline-flex min-h-12 items-center rounded-full bg-ink px-7 text-[15px] font-medium text-paper transition-colors hover:bg-burgundy"
            >
              Naar de kaart
            </a>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overscroll-contain px-7">
            <ul className="divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 py-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[22px] leading-tight text-ink">{item.name}</p>
                    <p className="mt-1 text-[13px] text-stone-light">{formatPrice(item.priceCents)} per stuk</p>
                    <div className="mt-3 inline-flex items-center rounded-full bg-mist p-1">
                      <button
                        type="button"
                        aria-label={`Verminder aantal van ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper"
                      >
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                      <span className="min-w-7 text-center text-[14px] font-semibold tabular-nums text-ink" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Verhoog aantal van ${item.name}`}
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper"
                      >
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-[15px] font-semibold tabular-nums text-ink">
                      {formatPrice(item.priceCents * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="link-draw text-[12px] font-medium text-stone-light hover:text-burgundy"
                    >
                      Verwijderen
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="py-6">
              <label htmlFor="cart-notes" className="mb-2 block text-[13px] font-medium text-stone">
                Opmerkingen voor de keuken <span className="text-stone-light">(optioneel)</span>
              </label>
              <textarea
                id="cart-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergieën, afhaaltijd, extra saus…"
                className="w-full resize-none rounded-2xl border border-transparent bg-mist px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-stone-light focus:border-ink/20 focus:bg-paper"
              />
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-ink/[0.07] px-7 pb-7 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] text-stone">Subtotaal</span>
              <span className="font-serif text-[30px] leading-none tabular-nums text-ink">{formatPrice(subtotalCents)}</span>
            </div>
            <p className="mt-1.5 text-[12px] text-stone-light">
              Inclusief btw · Afhalen in {restaurant.address.line1}
            </p>

            {status === "error" && (
              <p role="alert" className="mt-4 rounded-2xl bg-burgundy-light px-4 py-3 text-[13px] leading-relaxed text-burgundy-dark">
                {errorMessage} Of bel ons op{" "}
                <a href={restaurant.phoneHref} className="font-semibold underline">
                  {restaurant.phone}
                </a>
                .
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={status === "loading"}
              className="mt-5 flex min-h-14 w-full items-center justify-between rounded-full bg-ink pl-7 pr-2 text-[15px] font-medium text-paper transition-colors duration-500 hover:bg-burgundy disabled:opacity-60"
            >
              <span>{status === "loading" ? "Doorverwijzen naar betaling…" : "Afrekenen"}</span>
              <span className="flex h-10 items-center rounded-full bg-paper/10 px-4 tabular-nums">
                {formatPrice(subtotalCents)}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
