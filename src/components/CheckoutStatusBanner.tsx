import { useEffect, useState } from "react";
import { useCart } from "../lib/cart";

type Status = "success" | "cancel" | null;

export function CheckoutStatusBanner() {
  const [status, setStatus] = useState<Status>(null);
  const { clear } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    if (checkout === "success" || checkout === "cancel") {
      setStatus(checkout);
      if (checkout === "success") clear();

      params.delete("checkout");
      params.delete("order_id");
      const query = params.toString();
      const newUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", newUrl);
    }
    // Only ever inspect the URL once, on first render after checkout redirect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!status) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-3 top-20 z-40 mx-auto flex max-w-lg items-start gap-4 rounded-3xl border border-ink/[0.06] bg-paper/95 p-5 shadow-[0_20px_60px_-20px_rgba(10,10,10,0.35)] backdrop-blur-xl animate-fadeUp"
    >
      <span
        aria-hidden="true"
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${status === "success" ? "bg-gold" : "bg-stone-light"}`}
      />
      <p className="flex-1 text-[14px] leading-relaxed text-ink">
        {status === "success" ? (
          <>
            <span className="font-serif text-[20px] italic text-burgundy">Grazie!</span> Uw bestelling is betaald en
            bevestigd — tot straks.
          </>
        ) : (
          "Betaling geannuleerd. Uw winkelwagen blijft bewaard voor wanneer u er klaar voor bent."
        )}
      </p>
      <button
        type="button"
        onClick={() => setStatus(null)}
        aria-label="Melding sluiten"
        className="-m-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone hover:bg-mist hover:text-ink"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
