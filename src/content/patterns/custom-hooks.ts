import { Pattern } from "@/lib/types";

export const customHooks: Pattern = {
  slug: "custom-hooks",
  category: "react",
  code: "R-01",
  name: "Custom Hooks",
  oneLiner: "Extract stateful logic into a reusable function, so components stay about rendering.",
  problem:
    "The same stateful logic — debouncing a value, syncing to localStorage, tracking a media query, managing a fetch lifecycle — gets copy-pasted across components, tangled together with JSX. Components balloon, and fixing a bug in the logic means finding every copy.",
  solution:
    "Move the logic into a function whose name starts with `use`, which can call other hooks. It returns whatever the component needs (values, setters, handlers). Components call the hook and stay focused on rendering. This is the single most important composition primitive in modern React — most of the older HOC/render-prop use cases are now just custom hooks.",
  whenToUse: [
    "Any stateful or effectful logic reused in more than one component",
    "Wrapping a browser API (localStorage, matchMedia, IntersectionObserver) in a clean interface",
    "Encapsulating a fetch/mutation lifecycle for a specific resource",
    "Separating 'how the data behaves' from 'how it looks' without extra component layers",
  ],
  avoidWhen: [
    "The logic is used exactly once and inlining it is clearer than indirection",
    "You're tempted to build a 'mega-hook' that does five unrelated things — split it",
    "It's pure, non-reactive logic with no hooks inside — that's just a plain function, not a hook",
  ],
  realWorldExamples: [
    {
      name: "Library hooks are the norm",
      detail:
        "`useQuery`, `useForm`, `useSession`, `useMediaQuery` — nearly every modern React library ships its primary API as a custom hook, because that's how reusable logic travels in React today.",
    },
    {
      name: "`usehooks-ts` and in-house hook libraries",
      detail:
        "Teams maintain a `hooks/` folder of `useDebounce`, `useLocalStorage`, `useClickOutside` that standardize behavior across the whole app.",
    },
    {
      name: "Feature-scoped data hooks",
      detail:
        "In FSD/feature-based codebases, each slice exposes hooks like `useCandidates()` so components import behavior without knowing about the API layer underneath.",
    },
    {
      name: "Browser-API hooks (useMediaQuery, useIntersectionObserver)",
      detail:
        "Wrapping `matchMedia` or `IntersectionObserver` in a hook gives components a clean reactive value (`isMobile`, `isVisible`) without any component re-implementing listeners and cleanup.",
    },
  ],
  codeExamples: [
    {
      filename: "src/hooks/useDebouncedValue.ts",
      language: "ts",
      description:
        "A tiny reusable hook that debounces any value. Search inputs, autosave, and filters all consume it instead of re-implementing timers.",
      code: `import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer); // cancel on the next change or unmount
  }, [value, delayMs]);

  return debounced;
}

// The component stays about rendering — the debounce logic lives once:
// const [query, setQuery] = useState("");
// const debouncedQuery = useDebouncedValue(query, 400);
// useEffect(() => { search(debouncedQuery); }, [debouncedQuery]);`,
    },
    {
      filename: "src/hooks/useLocalStorage.ts",
      language: "ts",
      description:
        "A hook wrapping a browser API behind a useState-like interface, with SSR-safe initialization for Next.js.",
      code: `import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  // Initialize lazily and guard for SSR (no window on the server).
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable — fail quietly */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// Drop-in replacement for useState that persists:
// const [theme, setTheme] = useLocalStorage("theme", "dark");`,
    },
  ],
  pros: [
    "Reuses stateful logic across components with zero extra tree nesting (unlike HOCs/render props)",
    "Keeps components focused on rendering; logic is independently testable",
    "Composes freely — hooks can call hooks",
  ],
  cons: [
    "Easy to violate the Rules of Hooks (must be called unconditionally, at the top level)",
    "Over-extraction creates a maze of tiny hooks that's harder to follow than inline code",
    "Shared hooks with heavy effects can hide performance costs from the component using them",
  ],
};
