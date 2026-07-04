"use client";

import { CATEGORY_ORDER } from "@/lib/types";
import { getPatternsByCategory, patterns } from "@/content/patterns";
import { PatternCard } from "@/components/PatternCard";
import { useT } from "@/lib/i18n/LocaleProvider";

export default function HomePage() {
  const t = useT();

  return (
    <>
      <section className="schematic-grid relative border-b border-ink-600 px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-teal">
            <span className="h-px w-8 bg-teal/60" />
            {t.hero.eyebrow(patterns.length)}
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.1] text-ink-50 sm:text-6xl">
            {t.hero.titleLine1}
            <br />
            {t.hero.titleLine2}{" "}
            <span className="text-amber">{t.hero.titleAccent}</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
            {t.hero.paragraph}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {CATEGORY_ORDER.map((cat) => (
              <a
                key={cat}
                href={`#${cat}`}
                className="border border-ink-500 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-200 transition-colors hover:border-amber hover:text-amber"
              >
                {t.category.label[cat]}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {CATEGORY_ORDER.map((category, i) => {
          const items = getPatternsByCategory(category);
          return (
            <section
              key={category}
              id={category}
              className={i > 0 ? "mt-20 scroll-mt-20" : "scroll-mt-20"}
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-ink-600 pb-4">
                <h2 className="font-display text-2xl font-semibold text-ink-50">
                  {t.category.label[category]}
                </h2>
                <span className="font-mono text-xs text-ink-400">
                  {t.category.counter(i + 1, CATEGORY_ORDER.length)}
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-sm text-ink-300">{t.category.blurb[category]}</p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((pattern) => (
                  <PatternCard key={pattern.slug} pattern={pattern} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
