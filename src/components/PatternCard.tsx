"use client";

import Link from "next/link";
import { Pattern } from "@/lib/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localizePattern } from "@/lib/i18n/localizePattern";

export function PatternCard({ pattern }: { pattern: Pattern }) {
  const { locale, t } = useLocale();
  const p = localizePattern(pattern, locale);

  return (
    <Link
      href={`/patterns/${p.slug}`}
      className="group relative flex flex-col justify-between border border-ink-600 bg-ink-800/40 p-5 transition-all hover:border-amber/60 hover:bg-ink-800 hover:shadow-amber-glow"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-amber/80">{p.code}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 opacity-0 transition-opacity group-hover:opacity-100">
            {t.card.view}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-ink-50">{p.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">{p.oneLiner}</p>
      </div>
    </Link>
  );
}
