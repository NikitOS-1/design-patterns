import { Pattern } from "@/lib/types";

export const strategy: Pattern = {
  slug: "strategy",
  category: "behavioral",
  code: "B-02",
  name: "Strategy",
  oneLiner: "Make an algorithm swappable at runtime, instead of branching on 'which kind' everywhere it's used.",
  problem:
    "Different roles, plans, or contexts often need genuinely different algorithms for the same task: scoring a frontend candidate weighs different signals than scoring a sales candidate; sorting a table might need different comparators per column type; pricing might differ per region. If the calling code branches with if/switch on the variant every time it needs to run the algorithm, that branching gets duplicated at every call site and grows every time a new variant appears.",
  solution:
    "Define one interface that all variants implement (e.g. `ScoringStrategy.score(candidate)`), implement each variant as its own object/function, and pass the chosen strategy into the code that uses it as a parameter. The calling code (a hook, a component) always calls `strategy.score(candidate)` — it never branches on which one it received.",
  whenToUse: [
    "Scoring or ranking algorithms that differ by role, plan tier, or context",
    "Swappable sort/filter comparators for a data table, chosen per column type",
    "Pricing or discount calculation that differs per region, plan, or promotion",
    "Validation rules that differ per form type but share the same 'validate(values)' shape",
  ],
  avoidWhen: [
    "There are only two variants and they're unlikely to grow — a simple boolean flag or ternary is clearer",
    "The variants don't actually share an interface — forcing them into one abstracts away real differences instead of clarifying them",
  ],
  realWorldExamples: [
    {
      name: "Candidate scoring per role in ATS/interview-copilot products",
      detail:
        "A frontend role's scoring strategy might weigh React/TypeScript signals heavily, while a sales role's strategy weighs different skills entirely — both implement the same `score(candidate): number` interface so the UI that displays a score never needs to know which strategy ran.",
    },
    {
      name: "TanStack Table's column sorting functions",
      detail:
        "Each column can define its own `sortingFn`, letting the table core call whichever comparator is configured without branching on data type itself.",
    },
    {
      name: "Payment/discount calculators per plan tier",
      detail:
        "SaaS billing code commonly defines one pricing strategy per plan, all implementing `calculateTotal(cart)`, selected once at checkout and then called identically regardless of tier.",
    },
    {
      name: "Passport.js authentication strategies",
      detail:
        "Each auth method (local, OAuth, SAML) is a Strategy implementing the same verify interface, so the login route calls one strategy without branching on how credentials are checked.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/scoring/strategies.ts",
      language: "ts",
      description:
        "Interchangeable scoring strategies sharing one interface — the hook that uses them never branches on role.",
      code: `import { Candidate } from "@/features/candidates/types";

export interface ScoringStrategy {
  score(candidate: Candidate): number;
}

export const frontendEngineerScoring: ScoringStrategy = {
  score(candidate) {
    const skillWeight = candidate.skills.filter((s) =>
      ["react", "typescript", "next.js"].includes(s.toLowerCase())
    ).length * 15;
    const experienceWeight = Math.min(candidate.yearsExperience * 5, 40);
    return Math.min(skillWeight + experienceWeight, 100);
  },
};

export const salesRepScoring: ScoringStrategy = {
  score(candidate) {
    const quotaWeight = candidate.pastQuotaAttainmentPct
      ? candidate.pastQuotaAttainmentPct * 0.6
      : 0;
    const experienceWeight = Math.min(candidate.yearsExperience * 8, 40);
    return Math.min(quotaWeight + experienceWeight, 100);
  },
};

export const SCORING_STRATEGIES: Record<string, ScoringStrategy> = {
  "frontend-engineer": frontendEngineerScoring,
  "sales-rep": salesRepScoring,
};`,
    },
    {
      filename: "src/features/scoring/useCandidateScore.ts",
      language: "ts",
      description:
        "The consuming hook only calls strategy.score() — it never knows or cares which strategy it received.",
      code: `import { useMemo } from "react";
import { Candidate } from "@/features/candidates/types";
import { ScoringStrategy } from "./strategies";

export function useCandidateScore(candidate: Candidate, strategy: ScoringStrategy) {
  return useMemo(() => strategy.score(candidate), [candidate, strategy]);
}

// Usage — the strategy is picked once, based on the job's role,
// and passed in; the hook body has zero role-specific branching:
// const strategy = SCORING_STRATEGIES[job.roleSlug] ?? defaultScoring;
// const score = useCandidateScore(candidate, strategy);`,
    },
  ],
  pros: [
    "New variants are added by writing a new object implementing the interface — no existing code changes",
    "Calling code stays free of if/switch branching on 'which kind'",
    "Each strategy is independently unit-testable in isolation",
  ],
  cons: [
    "Adds an interface and a registry/lookup that's unnecessary for one or two stable variants",
    "Choosing 'where' the strategy gets selected (config, role, feature flag) is a decision that has to live somewhere sensible, or it just moves the branching rather than removing it",
  ],
};
