// Ukrainian overlay for a single pattern. Only the translatable prose lives
// here; slug, code, category, filenames, language and the code samples
// themselves come from the English base pattern and are never duplicated.
//
// Arrays are positional: index i here maps to index i in the base pattern's
// corresponding array. The resolver falls back to the English value for any
// entry left undefined, so partial translations degrade gracefully.
export interface PatternTranslation {
  oneLiner: string;
  problem: string;
  solution: string;
  whenToUse: string[];
  avoidWhen: string[];
  realWorldExamples: { name: string; detail: string }[];
  codeExamples: { description: string }[];
  pros: string[];
  cons: string[];
}

export type PatternTranslations = Record<string, PatternTranslation>;
