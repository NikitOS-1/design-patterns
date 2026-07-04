import { Pattern } from "@/lib/types";

export const templateMethod: Pattern = {
  slug: "template-method",
  category: "behavioral",
  code: "B-09",
  name: "Template Method",
  oneLiner: "Fix the skeleton of an algorithm once, and let each variant fill in only the steps that differ.",
  problem:
    "Several flows share the same overall shape but differ in a step or two: every data-fetching hook does 'set loading → fetch → normalize → set state → handle error', but each differs only in *what* it fetches and *how* it normalizes. Copy-pasting the whole skeleton per variant duplicates the loading/error boilerplate and lets the variants drift apart over time.",
  solution:
    "Define the invariant skeleton in one place and expose the varying steps as parameters (functions) the caller supplies. The overall sequence — and the shared error/loading handling — is written once; each use case provides only the bits that differ. In React this is almost always a custom hook that takes callbacks, not class inheritance.",
  whenToUse: [
    "A family of hooks/flows sharing loading-error-retry structure but differing in the fetch/transform step",
    "Multi-step processes (wizard submit, import pipeline) with a fixed order but pluggable steps",
    "Standardizing cross-cutting handling (analytics, error reporting) around a variable core action",
    "Enforcing that every variant follows the same required sequence",
  ],
  avoidWhen: [
    "The variants don't actually share a skeleton — forcing one obscures real differences",
    "Composition (small reusable hooks/functions) reads more clearly than a parameterized template",
  ],
  realWorldExamples: [
    {
      name: "Custom data hooks built on a shared base",
      detail:
        "Teams write a `useAsyncResource(fetcher, transform)` template that owns loading/error/retry, and each feature hook supplies only its fetcher and transform — the lifecycle logic exists once.",
    },
    {
      name: "React Query's queryFn hook",
      detail:
        "`useQuery` is a template method: it owns caching, retries, loading and error states (the skeleton), and you plug in just the `queryFn` step that varies.",
    },
    {
      name: "Form-submit wrappers",
      detail:
        "A `useSubmit(handler)` template standardizes validation → submit → toast → redirect, while each form supplies only the actual submit handler.",
    },
  ],
  codeExamples: [
    {
      filename: "src/hooks/useAsyncResource.ts",
      language: "ts",
      description:
        "A template hook that owns the loading/error/retry skeleton once; each caller supplies only the varying fetch and transform steps.",
      code: `import { useCallback, useEffect, useState } from "react";

interface Options<Raw, T> {
  fetcher: () => Promise<Raw>;          // varying step: WHAT to fetch
  transform: (raw: Raw) => T;           // varying step: HOW to shape it
  onError?: (error: unknown) => void;   // optional hook into the fixed flow
}

// The template: the sequence and error/loading handling are fixed here.
export function useAsyncResource<Raw, T>({ fetcher, transform, onError }: Options<Raw, T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await fetcher();      // step supplied by caller
      setData(transform(raw));          // step supplied by caller
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      onError?.(err);                   // shared cross-cutting handling
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, transform, onError]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, error, isLoading, reload: load };
}

// Each feature hook fills in only the steps that differ:
// const { data } = useAsyncResource({
//   fetcher: () => fetch("/api/candidates").then((r) => r.json()),
//   transform: (raw: RawCandidate[]) => raw.map(adaptCandidate),
// });`,
    },
  ],
  pros: [
    "Shared skeleton (loading, error, retry) is written and fixed exactly once",
    "Variants can only change the intended steps, so they can't drift apart",
    "New variants are tiny — just the differing callbacks",
  ],
  cons: [
    "A rigid template resists variants that need to change a step you didn't make pluggable",
    "Overusing it where plain composition would do adds indirection",
  ],
};
