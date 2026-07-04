import { Pattern } from "@/lib/types";
import { Locale } from "./config";
import { ukPatternTranslations } from "@/content/patterns/translations";

// Returns a copy of `base` with its prose swapped to the requested locale.
// Code samples, filenames, slug, code number and category are locale-invariant
// and always come from the English base. Missing translations fall back to
// English field-by-field, so nothing ever renders blank.
export function localizePattern(base: Pattern, locale: Locale): Pattern {
  if (locale === "en") return base;

  const tr = ukPatternTranslations[base.slug];
  if (!tr) return base;

  return {
    ...base,
    oneLiner: tr.oneLiner || base.oneLiner,
    problem: tr.problem || base.problem,
    solution: tr.solution || base.solution,
    whenToUse: tr.whenToUse?.length ? tr.whenToUse : base.whenToUse,
    avoidWhen: tr.avoidWhen?.length ? tr.avoidWhen : base.avoidWhen,
    realWorldExamples: base.realWorldExamples.map((ex, i) => ({
      name: tr.realWorldExamples[i]?.name || ex.name,
      detail: tr.realWorldExamples[i]?.detail || ex.detail,
    })),
    codeExamples: base.codeExamples.map((ex, i) => ({
      ...ex,
      description: tr.codeExamples[i]?.description || ex.description,
    })),
    pros: tr.pros?.length ? tr.pros : base.pros,
    cons: tr.cons?.length ? tr.cons : base.cons,
  };
}
