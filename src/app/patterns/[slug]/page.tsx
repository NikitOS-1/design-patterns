import { notFound } from "next/navigation";
import Link from "next/link";
import { patterns, getPatternBySlug } from "@/content/patterns";
import { CATEGORY_LABEL } from "@/lib/types";
import { TitleBlock } from "@/components/TitleBlock";
import { CodeBlock } from "@/components/CodeBlock";

export function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const pattern = getPatternBySlug(params.slug);
  if (!pattern) return {};
  return {
    title: `${pattern.name} — Design Patterns / Frontend`,
    description: pattern.oneLiner,
  };
}

export default function PatternPage({ params }: { params: { slug: string } }) {
  const pattern = getPatternBySlug(params.slug);
  if (!pattern) notFound();

  const index = patterns.findIndex((p) => p.slug === pattern.slug);
  const prev = patterns[(index - 1 + patterns.length) % patterns.length]!;
  const next = patterns[(index + 1) % patterns.length]!;

  return (
    <article className="max-w-3xl py-4 lg:py-8">
      <Link
        href={`/#${pattern.category}`}
        className="font-mono text-xs uppercase tracking-widest text-ink-400 hover:text-amber"
      >
        ← {CATEGORY_LABEL[pattern.category]}
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink-50 sm:text-5xl">
        {pattern.name}
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-300">{pattern.oneLiner}</p>

      <div className="mt-8">
        <TitleBlock pattern={pattern} />
      </div>

      <Section title="The problem">
        <p className="leading-relaxed text-ink-200">{pattern.problem}</p>
      </Section>

      <Section title="The pattern's answer">
        <p className="leading-relaxed text-ink-200">{pattern.solution}</p>
      </Section>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ListCard title="Reach for it when" items={pattern.whenToUse} tone="amber" />
        <ListCard title="Skip it when" items={pattern.avoidWhen} tone="ink" />
      </div>

      <Section title="Where it actually shows up">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pattern.realWorldExamples.map((ex) => (
            <div key={ex.name} className="border border-ink-600 bg-ink-800/40 p-4">
              <div className="font-display text-sm font-semibold text-teal">{ex.name}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{ex.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="In code">
        <div className="flex flex-col gap-6">
          {pattern.codeExamples.map((example) => (
            <CodeBlock key={example.filename} example={example} />
          ))}
        </div>
      </Section>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ListCard title="Trade-offs — pros" items={pattern.pros} tone="teal" />
        <ListCard title="Trade-offs — cons" items={pattern.cons} tone="ink" />
      </div>

      <nav className="mt-20 grid grid-cols-2 gap-4 border-t border-ink-600 pt-8">
        <Link
          href={`/patterns/${prev.slug}`}
          className="group border border-ink-600 p-4 transition-colors hover:border-amber/60"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">← Previous</div>
          <div className="mt-1 font-display text-sm font-semibold text-ink-100 group-hover:text-amber">
            {prev.name}
          </div>
        </Link>
        <Link
          href={`/patterns/${next.slug}`}
          className="group border border-ink-600 p-4 text-right transition-colors hover:border-amber/60"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Next →</div>
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
