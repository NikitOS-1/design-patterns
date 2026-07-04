"use client";

import Link from "next/link";
import { Pattern } from "@/lib/types";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localizePattern } from "@/lib/i18n/localizePattern";
import { TitleBlock } from "@/components/TitleBlock";
import { CodeBlock } from "@/components/CodeBlock";

interface NavLink {
  slug: string;
  name: string;
}

export function PatternDetail({
  pattern,
  prev,
  next,
}: {
  pattern: Pattern;
  prev: NavLink;
  next: NavLink;
}) {
  const { locale, t } = useLocale();
  const p = localizePattern(pattern, locale);

  return (
    <article className="max-w-3xl py-4 lg:py-8">
      <Link
        href={`/#${p.category}`}
        className="font-mono text-xs uppercase tracking-widest text-ink-400 hover:text-amber"
      >
        ← {t.category.label[p.category]}
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink-50 sm:text-5xl">{p.name}</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-300">{p.oneLiner}</p>

      <div className="mt-8">
        <TitleBlock pattern={p} />
      </div>

      <Section title={t.patternPage.problem}>
        <p className="leading-relaxed text-ink-200">{p.problem}</p>
      </Section>

      <Section title={t.patternPage.solution}>
        <p className="leading-relaxed text-ink-200">{p.solution}</p>
      </Section>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ListCard title={t.patternPage.whenToUse} items={p.whenToUse} tone="amber" />
        <ListCard title={t.patternPage.avoidWhen} items={p.avoidWhen} tone="ink" />
      </div>

      <Section title={t.patternPage.realWorld}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {p.realWorldExamples.map((ex) => (
            <div key={ex.name} className="border border-ink-600 bg-ink-800/40 p-4">
              <div className="font-display text-sm font-semibold text-teal">{ex.name}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{ex.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.patternPage.inCode}>
        <div className="flex flex-col gap-6">
          {p.codeExamples.map((example) => (
            <CodeBlock key={example.filename} example={example} />
          ))}
        </div>
      </Section>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ListCard title={t.patternPage.prosTitle} items={p.pros} tone="teal" />
        <ListCard title={t.patternPage.consTitle} items={p.cons} tone="ink" />
      </div>

      <nav className="mt-20 grid grid-cols-2 gap-4 border-t border-ink-600 pt-8">
        <Link
          href={`/patterns/${prev.slug}`}
          className="group border border-ink-600 p-4 transition-colors hover:border-amber/60"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
            {t.patternPage.previous}
          </div>
          <div className="mt-1 font-display text-sm font-semibold text-ink-100 group-hover:text-amber">
            {prev.name}
          </div>
        </Link>
        <Link
          href={`/patterns/${next.slug}`}
          className="group border border-ink-600 p-4 text-right transition-colors hover:border-amber/60"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
            {t.patternPage.next}
          </div>
          <div className="mt-1 font-display text-sm font-semibold text-ink-100 group-hover:text-amber">
            {next.name}
          </div>
        </Link>
      </nav>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-xl font-semibold text-ink-50">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "amber" | "teal" | "ink";
}) {
  const markColor = tone === "amber" ? "text-amber" : tone === "teal" ? "text-teal" : "text-ink-400";
  return (
    <div>
      <h3 className="font-display text-base font-semibold text-ink-50">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-300">
            <span className={`mt-1 font-mono text-xs ${markColor}`}>▪</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
