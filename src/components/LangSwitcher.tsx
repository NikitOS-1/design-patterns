"use client";

import { LOCALES, LOCALE_LABELS, LOCALE_NAMES } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function LangSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`flex items-center border border-ink-500 font-mono text-xs ${className}`}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            aria-label={LOCALE_NAMES[code]}
            className={`px-2.5 py-1.5 uppercase tracking-widest transition-colors ${
              active ? "bg-amber/15 text-amber" : "text-ink-400 hover:text-ink-100"
            }`}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
