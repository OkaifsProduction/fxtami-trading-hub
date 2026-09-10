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
      className={`fixed inset-x-0 top-14 z-40 border-b px-6 py-3 text-center text-[14px] font-medium ${
        status === "success" ? "border-ink/10 bg-mist text-ink" : "border-ink/10 bg-mist text-stone"
      }`}
    >
      {status === "success"
        ? "Grazie! Uw bestelling is bevestigd — tot binnenkort."
        : "Checkout werd geannuleerd. Uw winkelwagen blijft bewaard, wanneer u er klaar voor bent."}
      <button
        type="button"
        onClick={() => setStatus(null)}
        aria-label="Sluiten"
        className="ml-4 font-semibold underline underline-offset-2"
      >
        Sluiten
      </button>
    </div>
  );
}
