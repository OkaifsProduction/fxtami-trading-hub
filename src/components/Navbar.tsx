import { useEffect, useState } from "react";
import { Container } from "./Container";
import { navLinks } from "../data/navigation";
import { restaurant } from "../data/restaurant";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      {/* backdrop-blur lives on this inner bar, not <header>, so it never becomes a
          containing block for the fixed-position mobile drawer below (a filter/
          backdrop-filter ancestor would otherwise resize "fixed inset-0" to its own box). */}
      <div
        className={`transition-colors duration-500 ${
          scrolled || open ? "bg-cream/95 backdrop-blur-md shadow-[0_1px_0_rgba(28,23,20,0.08)]" : "bg-transparent"
        }`}
      >
        <Container className="flex h-20 items-center justify-between">
          <a
            href="#home"
            className="font-serif italic text-2xl tracking-wide text-ink"
            onClick={() => setOpen(false)}
          >
            {restaurant.name}
          </a>

          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-burgundy"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={restaurant.orderOnlineUrl}
            className="hidden md:inline-flex items-center rounded-full bg-burgundy px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-all hover:bg-burgundy-dark hover:-translate-y-0.5"
          >
            Order Online
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </Container>
      </div>

      <div
        className={`md:hidden fixed inset-0 top-20 z-40 bg-cream transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 pt-8">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
              className={`border-b border-ink/10 py-5 font-serif italic text-3xl text-ink transition-all duration-500 ${
                open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={restaurant.orderOnlineUrl}
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-burgundy px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream"
          >
            Order Online
          </a>
        </nav>
      </div>
    </header>
  );
}
