export const LOCALES = ["en", "uk"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Short labels shown in the language switcher.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  uk: "UA",
};

// Full names, e.g. for aria-labels.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
};

export const LOCALE_STORAGE_KEY = "dp-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "uk";
}
