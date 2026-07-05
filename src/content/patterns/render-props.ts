import { Pattern } from "@/lib/types";

export const renderProps: Pattern = {
  slug: "render-props",
  category: "react",
  code: "R-04",
  name: "Render Props",
  oneLiner: "Pass a render function to a component so it supplies behavior/state and the caller controls the markup.",
  problem:
    "You want to share behavior (tracking mouse position, managing a toggle, measuring an element) but let each consumer decide exactly what to render with it. A regular component fixes both the behavior and the output; you need to keep the behavior reusable while leaving rendering fully open.",
  solution:
    "Have the component accept a function as its `children` (or a `render` prop) and call it with the state/behavior it manages. The consumer's function receives that state and returns whatever markup it wants. The behavior lives in one place; the presentation is entirely the caller's. Custom hooks have replaced many render-prop use cases, but render props remain the right tool when the shared thing must render something around the consumer's output (like a headless list virtualizer or a measured container).",
  whenToUse: [
    "A behavior needs to wrap or provide layout around the consumer's own markup",
    "Headless components that manage state but render nothing opinionated (virtualizers, drag-and-drop, popovers)",
    "When a hook can't express it because the shared piece must own part of the JSX tree",
    "Exposing internal state to arbitrary custom rendering (e.g. a data fetcher rendering loading/error/data slots)",
  ],
  avoidWhen: [
    "A custom hook expresses the same sharing more simply — prefer the hook",
    "The nesting of render-prop functions gets deep ('callback hell' in JSX)",
    "You only have one consumer — just write the component directly",
  ],
  realWorldExamples: [
    {
      name: "React virtualization / list libraries",
      detail:
        "Virtualized list components manage scroll windowing and call a render function per visible row, letting you render any markup while they own the virtualization.",
    },
    {
      name: "Downshift (autocomplete/select)",
      detail:
        "Downshift manages selection, keyboard, and a11y state, then hands it to a render prop so you control the entire visual output of the combobox.",
    },
    {
      name: "Formik's `<Field>` render prop",
      detail:
        "Formik exposes field state through a render function so consumers render custom inputs while Formik owns the form logic.",
    },
    {
      name: "Measurement / motion render props",
      detail:
        "Components that measure an element or track gestures (a `<Measure>` or `<Motion>`) call a children function with the live size or transform, letting the consumer render anything positioned by it.",
    },
  ],
  codeExamples: [
    {
      filename: "src/components/utils/Toggle.tsx",
      language: "tsx",
      description:
        "A headless Toggle that owns the on/off behavior and hands it to a render function — the consumer decides entirely what to render.",
      code: `import { useState, useCallback } from "react";

interface ToggleApi {
  on: boolean;
  toggle: () => void;
  setOn: (v: boolean) => void;
}

// The component owns behavior and renders nothing of its own —
// it delegates all markup to the children function.
export function Toggle({ children }: { children: (api: ToggleApi) => React.ReactNode }) {
  const [on, setOn] = useState(false);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return <>{children({ on, toggle, setOn })}</>;
}

// Each consumer renders whatever it wants with the shared behavior:
// <Toggle>
//   {({ on, toggle }) => (
//     <button onClick={toggle} aria-pressed={on}>
//       {on ? "Enabled" : "Disabled"}
//     </button>
//   )}
// </Toggle>`,
    },
    {
      filename: "src/components/utils/Fetch.tsx",
      language: "tsx",
      description:
        "A headless data-fetcher that owns the request lifecycle and hands loading/error/data to a render function, so the consumer decides exactly how each state looks.",
      code: `import { useEffect, useState } from "react";

type State<T> =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

// Owns fetching; renders nothing of its own — the children function does.
export function Fetch<T>({
  url,
  children,
}: {
  url: string;
  children: (state: State<T>) => React.ReactNode;
}) {
  const [state, setState] = useState<State<T>>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    fetch(url)
      .then((r) => r.json())
      .then((data) => active && setState({ status: "success", data }))
      .catch((e) => active && setState({ status: "error", error: String(e) }));
    return () => {
      active = false;
    };
  }, [url]);

  return <>{children(state)}</>;
}

// The consumer owns every state's markup:
// <Fetch<Candidate[]> url="/api/candidates">
//   {(s) =>
//     s.status === "loading" ? <Spinner /> :
//     s.status === "error"   ? <ErrorNote msg={s.error} /> :
//     <List items={s.data} />
//   }
// </Fetch>`,
    },
  ],
  pros: [
    "Maximum rendering flexibility — the consumer owns the markup entirely",
    "Works when the shared component must render part of the tree (a hook can't)",
    "Behavior stays in one reusable place",
  ],
  cons: [
    "Nested render props get hard to read ('wrapper hell')",
    "For most 'just share logic' cases a custom hook is now cleaner",
    "Inline render functions can hurt memoization if not handled carefully",
  ],
};
