import { useEffect, useState } from "react";
import { Container } from "./Container";
import { CartButton } from "./CartButton";
import { navLinks } from "../data/navigation";
import { restaurant } from "../data/restaurant";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* backdrop-blur lives on this inner bar, not <header> itself — a filter/
          backdrop-filter ancestor becomes a containing block for fixed-position
          children, which would break the full-viewport mobile overlay below. */}
      <div
        className={`transition-colors duration-500 ${
          scrolled || open ? "bg-paper/80 backdrop-blur-xl border-b border-ink/[0.06]" : "bg-transparent"
        }`}
      >
        <Container className="flex h-14 items-center justify-between">
          <a
            href="#home"
            className="text-[15px] font-semibold tracking-tight text-ink"
            onClick={() => setOpen(false)}
          >
            {restaurant.name}
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-ink/70 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <CartButton />
            <a
              href={restaurant.orderOnlineUrl}
              className="hidden md:inline-flex items-center rounded-full bg-ink px-5 py-2 text-[13px] font-medium text-paper transition-all hover:bg-graphite hover:-translate-y-0.5"
            >
              Bestel Online
            </a>

            <button
              type="button"
              aria-label={open ? "Sluit menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={`block h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-5 bg-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                  open ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </Container>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-14 z-40 bg-ink transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col justify-between px-6 pb-10 pt-10">
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
                className={`border-b border-paper/10 py-5 text-3xl font-semibold tracking-tight text-paper transition-all duration-500 ${
                  open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={restaurant.orderOnlineUrl}
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-full bg-paper px-8 py-4 text-sm font-semibold text-ink"
          >
            Bestel Online
          </a>
        </nav>
      </div>
    </header>
  );
}
