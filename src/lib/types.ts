export type PatternCategory = "creational" | "structural" | "behavioral" | "react";

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

export const CATEGORY_LABEL: Record<PatternCategory, string> = {
  creational: "Creational",
  structural: "Structural",
  behavioral: "Behavioral",
  react: "React Patterns",
};

export const CATEGORY_BLURB: Record<PatternCategory, string> = {
  creational: "How objects and components get built, so creation logic doesn't leak everywhere.",
  structural: "How components, modules, and data shapes are composed together.",
  behavioral: "How responsibilities and communication flow between parts of the app.",
  react:
    "Patterns that aren't in the Gang of Four book but are the real vocabulary of production React today.",
};

// Order categories are shown in, across the sidebar and homepage.
export const CATEGORY_ORDER: PatternCategory[] = [
  "creational",
  "structural",
  "behavioral",
  "react",
];
