import { useState } from "react";
import { restaurant } from "../data/restaurant";

/**
 * Click-to-load Google Maps. The iframe sets Google cookies and loads ~1 MB,
 * so it's only fetched after the visitor asks for it (AVG/GDPR-friendly and
 * faster). Until then a lightweight, on-brand placeholder is shown.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={restaurant.mapEmbedUrl}
        title={`Kaart met de locatie van ${restaurant.name}`}
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full min-h-[420px] w-full grayscale-[0.6]"
      />
    );
  }

  return (
    <div className="grain relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden bg-ink p-8 text-paper md:p-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_60%_45%,#000,transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute left-[60%] top-[45%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -m-6 animate-ping rounded-full bg-gold/30" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink shadow-[0_0_60px_rgba(201,165,103,0.6)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
        </span>
      </div>

      <div className="relative">
        <span className="kicker text-paper/60">Locatie</span>
        <p className="display mt-4 text-[44px] text-paper">Beverst</p>
        <p className="mt-1 text-[15px] text-paper/60">{restaurant.address.full}</p>
      </div>

      <div className="relative flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="inline-flex min-h-12 items-center rounded-full bg-paper px-6 text-[14px] font-medium text-ink transition-colors hover:bg-gold"
        >
          Kaart laden
        </button>
        <a
          href={restaurant.directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center rounded-full border border-paper/25 px-6 text-[14px] font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          Open in Google Maps
        </a>
        <p className="w-full text-[12px] text-paper/40">De kaart wordt geladen via Google.</p>
      </div>
    </div>
  );
}
