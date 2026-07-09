export type PatternCategory = "creational" | "structural" | "behavioral" | "react" | "architecture";

export interface CodeExample {
  filename: string;
  language: "tsx" | "ts";
  description: string;
  code: string;
}

export interface RealWorldExample {
  name: string;
  detail: string;
}

export interface Pattern {
  slug: string;
  category: PatternCategory;
  code: string; // e.g. "C-01" — the blueprint "drawing number"
  name: string;
  oneLiner: string;
  problem: string;
  solution: string;
  whenToUse: string[];
  avoidWhen: string[];
  realWorldExamples: RealWorldExample[];
  codeExamples: CodeExample[];
  pros: string[];
  cons: string[];
}

// Human-readable category labels and blurbs are localized; see
// src/lib/i18n/dictionary.ts (`category.label` / `category.blurb`).

// Order categories are shown in, across the sidebar and homepage.
export const CATEGORY_ORDER: PatternCategory[] = [
  "creational",
  "structural",
  "behavioral",
  "react",
  "architecture",
];
