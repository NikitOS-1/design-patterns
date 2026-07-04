import { notFound } from "next/navigation";
import { patterns, getPatternBySlug } from "@/content/patterns";
import { PatternDetail } from "@/components/PatternDetail";

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
    <PatternDetail
      pattern={pattern}
      prev={{ slug: prev.slug, name: prev.name }}
      next={{ slug: next.slug, name: next.name }}
    />
  );
}
