import { useMemo } from "react";
import { useLocale, type Locale } from "./i18n";

/**
 * Datums en bedragen volgen de gekozen taal. Tot nu toe stond hier vast
 * "nl-BE", waardoor een Franse of Engelse lezer wel vertaalde labels zag maar
 * nog steeds "3 september 2026" als datum.
 *
 * De regiokeuze is bewust: Frans en Nederlands krijgen de Belgische variant
 * (dit is een Belgisch kantoor), Engels het Britse formaat omdat het Amerikaanse
 * maand-eerst juist voor verwarring zorgt bij een Europees publiek.
 */
const INTL_TAGS: Record<Locale, string> = {
  nl: "nl-BE",
  fr: "fr-BE",
  en: "en-GB",
  es: "es-ES",
};

/** Het euroteken blijft in elke taal — enkel scheidingstekens en volgorde verschillen. */
function maakFormatters(locale: Locale) {
  const tag = INTL_TAGS[locale];
  const currency = new Intl.NumberFormat(tag, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
  const date = new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    formatAmount(amount: number | null): string {
      if (amount === null) return "—";
      return currency.format(amount);
    },
    formatDate(iso: string): string {
      return date.format(new Date(iso));
    },
  };
}

export function useFormat() {
  const { locale } = useLocale();
  return useMemo(() => maakFormatters(locale), [locale]);
}
