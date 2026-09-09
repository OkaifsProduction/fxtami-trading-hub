import { createContext, useContext, useState, type ReactNode } from "react";
import { nl, type TranslationKey } from "./nl";
import { fr } from "./fr";
import { en } from "./en";
import { es } from "./es";

export type Locale = "nl" | "fr" | "en" | "es";
export type { TranslationKey };

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { nl, fr, en, es };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "ami-legal-locale";

function isLocale(value: string | null): value is Locale {
  return value === "nl" || value === "fr" || value === "en" || value === "es";
}

function getInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // localStorage kan geblokkeerd zijn (bv. privénavigatie) — val dan terug op nl.
  }
  return "nl";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Taal blijft dan enkel voor deze sessie ingesteld.
    }
  }

  function t(key: TranslationKey): string {
    return dictionaries[locale][key] ?? nl[key] ?? key;
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale moet binnen LocaleProvider gebruikt worden");
  return ctx;
}
