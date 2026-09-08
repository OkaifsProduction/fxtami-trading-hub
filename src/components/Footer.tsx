import { Container } from "./Container";
import { navLinks } from "../data/navigation";
import { restaurant } from "../data/restaurant";

export function Footer() {
  return (
    <footer className="bg-ink py-14">
      <Container className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <span className="font-serif italic text-2xl text-cream">{restaurant.name}</span>
          <p className="mt-3 text-sm leading-relaxed text-cream/50">
            {restaurant.address.line1}, {restaurant.address.line2}
          </p>
          <p className="mt-1 text-sm text-cream/50">{restaurant.phone}</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/50 transition-colors hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-4">
          <a
            href={restaurant.social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition-colors hover:border-cream hover:text-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href={restaurant.social.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition-colors hover:border-cream hover:text-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M15 8h2V4h-2a4 4 0 0 0-4 4v2H9v4h2v6h4v-6h2.5l.5-4H15V8Z" />
            </svg>
          </a>
          <a
            href={restaurant.social.tiktok}
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition-colors hover:border-cream hover:text-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
              <path d="M14 4c.4 2.2 2 3.8 4 4" />
            </svg>
          </a>
        </div>
      </Container>

      <Container className="mt-10 border-t border-cream/10 pt-6">
        <p className="text-xs text-cream/35">
          © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
