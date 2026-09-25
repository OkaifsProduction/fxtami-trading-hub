import type { ReactNode } from "react";
import { Container } from "./Container";
import { OpenStatusPill } from "./OpenStatusPill";
import { navLinks } from "../data/navigation";
import { restaurant } from "../data/restaurant";
import { useReveal } from "../hooks/useReveal";

const socialIcons: Record<"instagram" | "facebook" | "tiktok", ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M15 8h2V4h-2a4 4 0 0 0-4 4v2H9v4h2v6h4v-6h2.5l.5-4H15V8Z" />,
  tiktok: (
    <>
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 4c.4 2.2 2 3.8 4 4" />
    </>
  ),
};

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/40">{title}</h3>
      <div className="mt-5 space-y-2 text-[15px] text-paper/75">{children}</div>
    </div>
  );
}

export function Footer() {
  const ref = useReveal<HTMLDivElement>();
  const socials = (Object.keys(socialIcons) as (keyof typeof socialIcons)[]).filter((k) => restaurant.social[k]);

  return (
    <footer className="grain relative overflow-hidden bg-ink text-paper">
      <Container wide>
        <div ref={ref} className="reveal grid grid-cols-1 gap-12 border-t border-paper/10 pt-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div className="space-y-6">
            <p className="font-serif text-[40px] leading-none">
              Da <em className="italic text-gold">Vinci</em>
            </p>
            <p className="max-w-xs text-[15px] leading-relaxed text-paper/55">
              {restaurant.tagline} in Beverst — Italiaanse klassiekers, om ter plaatse te eten of af te halen.
            </p>
            <OpenStatusPill light />
          </div>

          <Column title="Bezoek">
            <p>{restaurant.address.line1}</p>
            <p>{restaurant.address.line2}</p>
            <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer" className="link-draw inline-block pb-0.5 text-paper">
              Routebeschrijving ↗
            </a>
          </Column>

          <Column title="Openingsuren">
            {restaurant.hours.map((h) => (
              <p key={h.days} className="flex justify-between gap-4 lg:block">
                <span className="text-paper/45 lg:block lg:text-[13px]">{h.days}</span>
                <span className="tabular-nums">{h.time}</span>
              </p>
            ))}
          </Column>

          <Column title="Contact">
            <a href={restaurant.phoneHref} className="block hover:text-gold">
              {restaurant.phone}
            </a>
            <a href={restaurant.mobileHref} className="block hover:text-gold">
              {restaurant.mobile}
            </a>
            <a href={`mailto:${restaurant.email}`} className="block break-all hover:text-gold">
              {restaurant.email}
            </a>
            {socials.length > 0 && (
              <div className="flex gap-2 pt-3">
                {socials.map((key) => (
                  <a
                    key={key}
                    href={restaurant.social[key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={key}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors hover:border-paper hover:text-paper"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      {socialIcons[key]}
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </Column>
        </div>

        <nav aria-label="Footer" className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-paper/10 pt-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="link-draw pb-0.5 text-[14px] text-paper/60 hover:text-paper">
              {link.label}
            </a>
          ))}
        </nav>
      </Container>

      <p
        aria-hidden="true"
        className="pointer-events-none mt-10 select-none whitespace-nowrap text-center font-serif text-[27vw] leading-[0.72] tracking-[-0.04em] text-paper/[0.07]"
      >
        Da Vinci
      </p>

      <Container wide>
        <div className="flex flex-col gap-3 border-t border-paper/10 py-8 text-[12px] text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {restaurant.name}. Alle rechten voorbehouden.
          </span>
          <div className="flex gap-6">
            <a href="/privacy.html" className="hover:text-paper">
              Privacybeleid
            </a>
            <a href="/terms.html" className="hover:text-paper">
              Algemene voorwaarden
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
