import { Pattern } from "@/lib/types";

export const providerPattern: Pattern = {
  slug: "provider-pattern",
  category: "react",
  code: "R-03",
  name: "Provider Pattern",
  oneLiner: "Share values across a subtree via Context, so deep children don't need props drilled through every layer.",
  problem:
    "Some data is needed by many components at different depths: the current theme, the authenticated user, a locale, a feature-flag set. Passing it down through props means every intermediate component has to accept and forward props it doesn't even use — 'prop drilling' — which couples the whole tree to that data.",
  solution:
    "Create a Context, wrap the relevant subtree in a Provider that supplies the value, and let any descendant read it with a `use*` hook. Intermediate components stay untouched. The clean version pairs each context with a custom hook that throws if used outside its provider, so misuse fails loudly and consumers get full typing.",
  whenToUse: [
    "App-wide concerns: theme, current user/session, locale, feature flags",
    "Compound components sharing implicit state (Tabs, Accordion internals)",
    "Any value read by many components across several nesting levels",
    "Dependency injection — providing a client/service to a subtree for testability",
  ],
  avoidWhen: [
    "The value changes very frequently and is read widely — every consumer re-renders on each change; use a store (Zustand/Redux) with selectors instead",
    "Only a parent and its direct child need it — plain props are simpler",
    "You'd be creating a single 'global context' holding unrelated things — split by concern",
  ],
  realWorldExamples: [
    {
      name: "Theme providers (next-themes, MUI, styled-components)",
      detail:
        "A ThemeProvider at the root supplies theme tokens to the whole tree; any component reads the theme without it being threaded through props.",
    },
    {
      name: "Auth/session providers",
      detail:
        "`<SessionProvider>` from next-auth exposes the current user to the entire app so any component can call `useSession()` without prop drilling.",
    },
    {
      name: "React Query's QueryClientProvider",
      detail:
        "Provides the single QueryClient to the subtree, giving every `useQuery` call access to the shared cache — dependency injection via context.",
    },
    {
      name: "i18n providers (react-i18next, next-intl)",
      detail:
        "An `I18nProvider` supplies the active locale and translations to the whole tree, so any component calls `t('key')` without the locale being threaded through props — exactly how this site's own LocaleProvider works.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/theme/ThemeProvider.tsx",
      language: "tsx",
      description:
        "A provider plus a guarded consumer hook — the clean-code shape for context: strongly typed, and it throws loudly if used outside the provider.",
      code: `"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

// Default is null so we can detect "used outside provider".
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Memoize so consumers don't re-render unless the value truly changes.
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// The guarded consumer hook — the piece that makes context safe to use.
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

// Any descendant, at any depth, reads it directly:
// const { theme, toggle } = useTheme();`,
    },
    {
      filename: "src/features/flags/FlagsProvider.tsx",
      language: "tsx",
      description:
        "A feature-flags provider: flags are resolved once at the root and supplied to the tree, and a guarded useFlag() hook reads a single flag anywhere — dependency injection for gating UI.",
      code: `"use client";

import { createContext, useContext } from "react";

type Flags = Record<string, boolean>;

const FlagsContext = createContext<Flags | null>(null);

export function FlagsProvider({ flags, children }: { flags: Flags; children: React.ReactNode }) {
  // \`flags\` is resolved once (e.g. in a Server Component) and passed in,
  // so the value is stable and every consumer reads the same set.
  return <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>;
}

// Guarded hook: reads one flag, throws loudly if used outside the provider.
export function useFlag(name: string): boolean {
  const flags = useContext(FlagsContext);
  if (!flags) throw new Error("useFlag must be used within <FlagsProvider>");
  return flags[name] ?? false;
}

// Any component gates itself without prop drilling:
// const showNewEditor = useFlag("new-editor");
// return showNewEditor ? <NewEditor /> : <LegacyEditor />;`,
    },
  ],
  pros: [
    "Eliminates prop drilling for genuinely shared, cross-cutting values",
    "A guarded hook gives strong typing and a clear runtime error on misuse",
    "Doubles as dependency injection, which helps testing",
  ],
  cons: [
    "Every consumer re-renders when the context value changes — bad for high-frequency updates",
    "Overusing one big context couples unrelated concerns; split contexts by responsibility",
    "Forgetting to memoize the value causes needless re-renders across the subtree",
  ],
};
