import { Container } from "./Container";
import { navLinks } from "../data/navigation";
import { restaurant } from "../data/restaurant";

export function Footer() {
  return (
    <footer className="bg-paper py-12">
      <Container>
        <div className="flex flex-col gap-10 border-t border-ink/[0.08] pt-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <span className="text-[15px] font-semibold tracking-tight text-ink">{restaurant.name}</span>
            <p className="mt-3 text-[14px] leading-relaxed text-stone-light">
              {restaurant.address.line1}, {restaurant.address.line2}
            </p>
            <p className="mt-1 text-[14px] text-stone-light">{restaurant.phone}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-stone-light transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            <a
              href={restaurant.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-stone transition-colors hover:border-ink hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-stone transition-colors hover:border-ink hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M15 8h2V4h-2a4 4 0 0 0-4 4v2H9v4h2v6h4v-6h2.5l.5-4H15V8Z" />
              </svg>
            </a>
            <a
              href={restaurant.social.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-stone transition-colors hover:border-ink hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
                <path d="M14 4c.4 2.2 2 3.8 4 4" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-stone-light">
          <span>
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
          </span>
          <a href="/privacy.html" className="underline decoration-stone-light/40 underline-offset-2 hover:text-ink">
            Privacy Policy
          </a>
          <a href="/terms.html" className="underline decoration-stone-light/40 underline-offset-2 hover:text-ink">
            Terms of Service
          </a>
        </div>
      </Container>
    </footer>
  );
}
