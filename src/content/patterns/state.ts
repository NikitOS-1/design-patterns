import { Pattern } from "@/lib/types";

export const state: Pattern = {
  slug: "state",
  category: "behavioral",
  code: "B-04",
  name: "State",
  oneLiner: "Let an object change its behavior when its internal state changes — model states explicitly instead of with boolean soup.",
  problem:
    "Async UI, wizards, and forms drift into a pile of booleans: `isLoading`, `isError`, `isSuccess`, `isEmpty`, `isSubmitting`. These booleans can express impossible combinations (loading AND error at once), and the rendering logic becomes a maze of `if (isLoading) … else if (isError) …` that's easy to get into an inconsistent state.",
  solution:
    "Model the finite set of states explicitly — usually a discriminated union (`{ status: 'idle' } | { status: 'loading' } | { status: 'success', data } | { status: 'error', error }`) — and let transitions move you between them. Each state carries exactly the data valid for it, impossible combinations become unrepresentable, and rendering is a clean `switch` over one field. Formal state machines (XState) take this further with explicit transition rules.",
  whenToUse: [
    "Async data fetching UI (idle → loading → success/error)",
    "Multi-step wizards and checkout flows with well-defined steps and transitions",
    "Anything currently drowning in interdependent boolean flags",
    "Media players, uploads, or connections with clear lifecycle states",
  ],
  avoidWhen: [
    "There are only two trivial states and one flag genuinely captures it",
    "A library already models the states for you (React Query gives you status directly)",
  ],
  realWorldExamples: [
    {
      name: "TanStack Query / SWR status field",
      detail:
        "These libraries expose a single `status: 'pending' | 'error' | 'success'` instead of separate booleans, so components switch on one value rather than juggling flags — the State pattern productized.",
    },
    {
      name: "XState-driven flows",
      detail:
        "Checkout, onboarding, and auth flows are commonly modeled as explicit state machines where each state defines which transitions are legal, preventing invalid jumps.",
    },
    {
      name: "Discriminated-union fetch results",
      detail:
        "A hand-rolled `useAsync` returning a discriminated union is a lightweight State pattern that makes 'loading with data already present' or 'error but still loading' impossible to represent by accident.",
    },
  ],
  codeExamples: [
    {
      filename: "src/hooks/useAsyncState.ts",
      language: "ts",
      description:
        "A fetch state modeled as a discriminated union. Impossible combinations (loading + error) simply can't be constructed, and each state carries exactly the data valid for it.",
      code: `import { useState, useCallback } from "react";

// The explicit, finite set of states — the heart of the State pattern.
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export function useAsyncState<T>() {
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" });

  const run = useCallback(async (promise: Promise<T>) => {
    setState({ status: "loading" }); // transition: idle/any -> loading
    try {
      const data = await promise;
      setState({ status: "success", data }); // -> success (carries data)
    } catch (err) {
      setState({ status: "error", error: err instanceof Error ? err.message : "Failed" });
    }
  }, []);

  return { state, run };
}

// Rendering is a clean switch — no boolean soup, no impossible states:
// switch (state.status) {
//   case "idle":    return <Empty />;
//   case "loading": return <Spinner />;
//   case "success": return <List items={state.data} />; // data guaranteed here
//   case "error":   return <Error message={state.error} />;
// }`,
    },
  ],
  pros: [
    "Impossible state combinations become unrepresentable in the type system",
    "Each state carries exactly the data that's valid for it — no more optional-everything",
    "Rendering and transitions are explicit and easy to follow",
  ],
  cons: [
    "More upfront modeling than dropping in a `useState(false)`",
    "Full state-machine libraries add a learning curve that's overkill for simple flows",
  ],
};
