import { Pattern } from "@/lib/types";

export const decorator: Pattern = {
  slug: "decorator",
  category: "structural",
  code: "S-02",
  name: "Decorator",
  oneLiner: "Wrap a component or hook to add behavior, without changing what it already does.",
  problem:
    "Cross-cutting concerns — requiring auth, logging renders, tracking analytics, adding a loading boundary — apply to many components, but stuffing that logic directly into each one duplicates it everywhere and tangles unrelated concerns together inside a single component body.",
  solution:
    "Write a function that takes a component (or a hook) and returns a new one that layers extra behavior around it, then delegates to the original. In React this is the Higher-Order Component (`withAuth(Page)`) or a hook wrapper (`useTrackedState` wrapping `useState`). The original component/hook stays untouched and reusable on its own; the decorator adds behavior at the boundary.",
  whenToUse: [
    "Guarding a page behind authentication/authorization without repeating the check in every page component",
    "Adding logging, analytics, or performance tracing around specific components in development",
    "Layering extra behavior onto a hook (e.g. persisting state, or logging every state change) without modifying its internals",
    "Wrapping a third-party component to inject app-specific defaults or error boundaries",
  ],
  avoidWhen: [
    "The 'extra behavior' is actually one component's own core responsibility — don't decorate what should just be written inline",
    "You need to change the wrapped component's internal rendering, not just add behavior around it — that calls for composition/props, not a decorator",
    "A plain custom hook composing another hook already reads more clearly than a HOC wrapper",
  ],
  realWorldExamples: [
    {
      name: "Next.js middleware / route guards",
      detail:
        "Wrapping a protected page or API route handler with an auth-check function that redirects unauthenticated users before rendering — the guard logic is written once and applied to every protected route.",
    },
    {
      name: "Redux's `connect()` and React Query's `withErrorBoundary`",
      detail:
        "Both are classic HOC decorators: they take a component and return a new one wired up to the store or wrapped in retry/error UI, without changing the original component's implementation.",
    },
    {
      name: "Sentry's `withSentryConfig` / error-tracking wrappers",
      detail:
        "Error-monitoring SDKs commonly ship a HOC that wraps a page or component to automatically capture render errors and performance spans around it.",
    },
  ],
  codeExamples: [
    {
      filename: "src/components/hoc/withAuthGuard.tsx",
      language: "tsx",
      description:
        "A Higher-Order Component that decorates any page component with an authentication check, redirecting unauthenticated users — written once, applied to every protected page.",
      code: `import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/features/auth/useSession";

export function withAuthGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { redirectTo?: string } = {}
) {
  function GuardedComponent(props: P) {
    const { session, isLoading } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !session) {
        router.replace(options.redirectTo ?? "/login");
      }
    }, [isLoading, session, router]);

    if (isLoading || !session) {
      return <div className="p-8 text-center text-sm text-ink-300">Checking session…</div>;
    }

    // Delegate to the original component — its own logic is untouched.
    return <WrappedComponent {...props} />;
  }

  GuardedComponent.displayName = \`withAuthGuard(\${WrappedComponent.displayName || WrappedComponent.name})\`;
  return GuardedComponent;
}

// Usage: the page component knows nothing about auth.
// function DashboardPage() { ... }
// export default withAuthGuard(DashboardPage, { redirectTo: "/login" });`,
    },
    {
      filename: "src/hooks/useTrackedState.ts",
      language: "ts",
      description:
        "A hook decorator: wraps useState to add analytics logging on every change, without touching how useState itself works.",
      code: `import { useCallback, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function useTrackedState<T>(
  initial: T,
  eventName: string
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initial);

  const setTrackedState = useCallback(
    (value: T) => {
      trackEvent(eventName, { from: state, to: value });
      setState(value);
    },
    [state, eventName]
  );

  return [state, setTrackedState];
}

// Usage — identical call shape to useState, extra behavior included:
// const [stage, setStage] = useTrackedState<CandidateStage>("new", "candidate_stage_changed");`,
    },
  ],
  pros: [
    "Cross-cutting behavior (auth, logging, tracing) is written once and reused everywhere",
    "The wrapped component/hook stays simple and testable on its own",
    "Decorators can be composed: `withAuthGuard(withAnalytics(Page))`",
  ],
  cons: [
    "Deep HOC chains can make the component tree harder to read in devtools (extra wrapper layers)",
    "TypeScript generics for HOCs can get verbose to type correctly",
    "Modern React often prefers hooks composition over HOCs for the same problem — worth checking whether a hook decorator is enough",
  ],
};
