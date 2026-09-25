import { useEffect, useState } from "react";

const STORAGE_KEY = "davinci-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // If storage is unavailable, don't block the page on a banner that
      // could never be dismissed persistently.
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // Best-effort only.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookiemelding"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto flex max-w-md flex-col gap-4 rounded-3xl border border-ink/[0.06] bg-paper/95 p-5 shadow-[0_20px_60px_-20px_rgba(10,10,10,0.35)] backdrop-blur-xl animate-fadeUp sm:inset-x-auto sm:left-5 sm:bottom-5 sm:flex-row sm:items-center"
    >
      <p className="text-[13px] leading-relaxed text-stone">
        We gebruiken enkel essentiële cookies. De Google Maps-kaart laadt pas als u erom vraagt. Meer in ons{" "}
        <a href="/privacy.html" className="font-medium text-ink underline decoration-ink/20 underline-offset-2">
          privacybeleid
        </a>
        .
      </p>
      <button
        type="button"
        onClick={accept}
        className="min-h-11 shrink-0 rounded-full bg-ink px-6 text-[13px] font-medium text-paper transition-colors hover:bg-burgundy"
      >
        Begrepen
      </button>
    </div>
  );
}
