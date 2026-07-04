import { Pattern } from "@/lib/types";

export const errorBoundary: Pattern = {
  slug: "error-boundary",
  category: "react",
  code: "R-06",
  name: "Error Boundary",
  oneLiner: "Contain a render-time crash to one part of the UI instead of blanking the whole app.",
  problem:
    "A JavaScript error thrown during render anywhere in the tree unmounts the entire React app by default — one bad widget takes down the whole page. You want a crashing chart or a malformed piece of content to show a localized fallback while the rest of the app keeps working, and you want that error reported.",
  solution:
    "Wrap a subtree in an Error Boundary — a component that catches render errors from its descendants, renders a fallback UI, and reports the error. Place boundaries around independent regions (each dashboard widget, the main content area, a risky third-party embed) so failures stay contained. In the Next.js App Router, an `error.tsx` file is a built-in route-level error boundary.",
  whenToUse: [
    "Around independent widgets/panels so one crash doesn't blank the page",
    "Around risky third-party embeds or dynamically-rendered content",
    "Route-level fallback UI via Next.js `error.tsx`",
    "Anywhere you want a crash reported to monitoring plus a graceful local fallback",
  ],
  avoidWhen: [
    "As a substitute for handling expected errors (failed fetches) — handle those in state, not by throwing",
    "Wrapping every tiny component individually — boundaries belong at meaningful region edges",
    "For event-handler or async errors — boundaries only catch render/lifecycle errors; use try/catch there",
  ],
  realWorldExamples: [
    {
      name: "Next.js App Router error.tsx",
      detail:
        "Dropping an `error.tsx` in a route segment gives that segment an automatic error boundary with a reset action, isolating failures to that part of the route tree.",
    },
    {
      name: "react-error-boundary",
      detail:
        "The de-facto library wraps the class-component boilerplate in a `<ErrorBoundary FallbackComponent={...} onError={...}>` with a reset key — the standard way teams add boundaries.",
    },
    {
      name: "Sentry error boundaries",
      detail:
        "Monitoring SDKs provide error-boundary wrappers that render a fallback and automatically report the captured error with component stack context.",
    },
  ],
  codeExamples: [
    {
      filename: "src/components/ErrorBoundary.tsx",
      language: "tsx",
      description:
        "A reusable Error Boundary (still a class component — the one place React requires one) that contains crashes, reports them, and shows a fallback.",
      code: `"use client";

import { Component, type ReactNode } from "react";

interface Props {
  fallback: (reset: () => void) => ReactNode;
  onError?: (error: Error) => void;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Error boundaries must be class components — this is the one spot
// modern React still requires one.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error }; // switch to the fallback on the next render
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error); // report to Sentry/monitoring here
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) return this.props.fallback(this.reset);
    return this.props.children;
  }
}

// Contain each widget independently — one crash won't take down the page:
// <ErrorBoundary
//   onError={(e) => captureException(e)}
//   fallback={(reset) => (
//     <div className="p-4">
//       <p>This widget failed to load.</p>
//       <button onClick={reset}>Try again</button>
//     </div>
//   )}
// >
//   <RevenueChart />
// </ErrorBoundary>`,
    },
  ],
  pros: [
    "A crash stays contained to its region instead of unmounting the whole app",
    "Central place to report render errors to monitoring with component context",
    "Next.js `error.tsx` makes route-level boundaries nearly free",
  ],
  cons: [
    "Only catches render/lifecycle errors — not event handlers, async code, or SSR data errors",
    "Still requires a class component (or a library) since there's no hook equivalent",
    "Too-coarse placement (one boundary at the root) defeats the point of containment",
  ],
};
