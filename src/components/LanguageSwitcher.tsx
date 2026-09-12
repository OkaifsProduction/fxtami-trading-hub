import { useState, useRef, useEffect } from "react";
import { LOCALES, useLocale } from "@/lib/i18n";

export function LanguageSwitcher({ direction = "down" }: { direction?: "up" | "down" }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="language-switcher" ref={ref}>
      <button
        type="button"
        className="language-switcher-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden="true">{current.flag}</span>
        {current.label}
        <span className="language-switcher-chevron" aria-hidden="true">
          ⌄
        </span>
      </button>
      {open && (
        <div
          className={`language-switcher-menu${direction === "up" ? " language-switcher-menu-up" : ""}`}
          role="listbox"
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === locale}
              className={`language-switcher-option${l.code === locale ? " active" : ""}`}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
            >
              <span aria-hidden="true">{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
