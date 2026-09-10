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
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-ink/10 bg-paper/95 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-content flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-[13px] leading-relaxed text-stone">
          We use only essential cookies to run this site, plus an embedded Google Map. See our{" "}
          <a href="/privacy.html" className="underline hover:text-ink">
            Privacy Policy
          </a>{" "}
          for details.
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-ink px-5 py-2 text-[13px] font-medium text-paper hover:bg-graphite"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
