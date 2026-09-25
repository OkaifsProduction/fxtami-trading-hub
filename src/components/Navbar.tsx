import { useEffect, useState } from "react";
import { Container } from "./Container";
import { CartButton } from "./CartButton";
import { OpenStatusPill } from "./OpenStatusPill";
import { navLinks } from "../data/navigation";
import { restaurant } from "../data/restaurant";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useDialog } from "../hooks/useDialog";

// "home" has no nav link; including it clears the highlight when scrolling back to the top.
const sectionIds = ["home", ...navLinks.map((l) => l.href.slice(1))];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(sectionIds);
  const drawerRef = useDialog<HTMLDivElement>(open, () => setOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* backdrop-blur lives on this inner bar, not <header> itself — a filter/
          backdrop-filter ancestor becomes a containing block for fixed-position
          children, which would break the full-viewport mobile overlay below. */}
      <div
        className={`transition-all duration-500 ease-expo ${
          open
            ? "bg-ink"
            : scrolled
              ? "border-b border-ink/[0.06] bg-paper/75 backdrop-blur-xl backdrop-saturate-150"
              : "bg-transparent"
        }`}
      >
        <Container wide className="flex h-16 items-center justify-between">
          <a
            href="#home"
            onClick={() => setOpen(false)}
            className={`relative z-50 flex items-baseline gap-2 transition-colors duration-500 ${
              open ? "text-paper" : "text-ink"
            }`}
            aria-label={`${restaurant.name} — naar boven`}
          >
            <span className="font-serif text-[28px] leading-none tracking-display">
              Da <em className="text-burgundy">Vinci</em>
            </span>
            <span
              className={`hidden text-[10px] font-semibold uppercase tracking-[0.22em] sm:inline ${
                open ? "text-paper/40" : "text-stone-light"
              }`}
            >
              Beverst
            </span>
          </a>

          <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                    isActive ? "text-ink" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-burgundy transition-all duration-500 ease-expo ${
                      isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <CartButton light={open} />
            <a
              href={restaurant.orderOnlineUrl}
              className="hidden items-center rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors duration-500 ease-expo hover:bg-burgundy md:inline-flex"
            >
              Bestel online
            </a>

            <button
              type="button"
              aria-label={open ? "Sluit menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden"
            >
              <span
                className={`block h-px w-6 transition-all duration-500 ease-expo ${
                  open ? "translate-y-[3.5px] rotate-45 bg-paper" : "bg-ink"
                }`}
              />
              <span
                className={`block h-px w-6 transition-all duration-500 ease-expo ${
                  open ? "-translate-y-[3.5px] -rotate-45 bg-paper" : "bg-ink"
                }`}
              />
            </button>
          </div>
        </Container>
      </div>

      <div
        id="mobile-menu"
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`grain fixed inset-0 top-16 z-40 overflow-y-auto bg-ink outline-none transition-[clip-path] duration-700 ease-expo lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <nav aria-label="Mobiele navigatie" className="flex min-h-full flex-col justify-between px-6 pb-10 pt-8">
          <ol className="flex flex-col">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                  className={`flex items-baseline gap-4 border-b border-paper/10 py-4 text-paper transition-all duration-700 ease-expo ${
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <span className="w-6 font-serif text-sm italic text-gold">0{i + 1}</span>
                  <span className="font-serif text-[42px] leading-none tracking-display">{link.label}</span>
                </a>
              </li>
            ))}
          </ol>

          <div
            style={{ transitionDelay: open ? "450ms" : "0ms" }}
            className={`mt-10 space-y-6 transition-all duration-700 ease-expo ${open ? "opacity-100" : "opacity-0"}`}
          >
            <OpenStatusPill light />
            <div className="space-y-1 text-[15px] text-paper/60">
              <a href={restaurant.phoneHref} className="block text-lg text-paper">
                {restaurant.phone}
              </a>
              <p>{restaurant.address.full}</p>
            </div>
            <a
              href={restaurant.orderOnlineUrl}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-center rounded-full bg-paper px-8 text-[15px] font-medium text-ink"
            >
              Bestel online
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
