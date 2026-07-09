import { Pattern } from "@/lib/types";

export const higherOrderComponents: Pattern = {
  slug: "higher-order-components",
  category: "react",
  code: "R-09",
  name: "Higher Order Components",
  oneLiner:
    "Wrap a component with reusable behavior when you need to extend rendering logic without changing the component itself.",
  problem:
    "Before hooks became the default composition primitive, teams duplicated cross-cutting behavior such as auth guards, analytics tracking, and feature-flag checks across many components. Even today, some codebases and third-party libraries still expose HOC APIs, so teams need a clean way to apply that behavior consistently without editing every screen component.",
  solution:
    "Use a function that accepts a component and returns a new component with added behavior. The wrapper can inject props, gate rendering, or run side effects around the base component while preserving the original component contract. In modern React, HOCs are mostly historical, but they remain useful when integrating legacy libraries or composing cross-cutting concerns around class components.",
  whenToUse: [
    "Integrating legacy React codebases where behavior composition is already HOC-based",
    "Applying route-level access control, permissions, or tracking around many screens",
    "Wrapping third-party components that must receive injected props from shared context",
    "Migrating class-component modules incrementally while hooks are introduced elsewhere",
  ],
  avoidWhen: [
    "A custom hook can express the same behavior with less wrapper nesting",
    "You are stacking many wrappers and making component trees hard to inspect",
    "The behavior requires fine-grained composition that is clearer as render-time JSX",
  ],
  realWorldExamples: [
    {
      name: "Redux connect",
      detail:
        "Large codebases historically used connect to inject state and actions into components, which is a classic HOC application.",
    },
    {
      name: "Route authorization wrappers",
      detail:
        "Teams wrap page components with withAuth or withRoleGuard to enforce access rules in one place.",
    },
    {
      name: "Legacy analytics wrappers",
      detail:
        "A tracking HOC can emit page-view and lifecycle events around many route components without duplicating instrumentation.",
    },
    {
      name: "Framework plugin ecosystems",
      detail:
        "Some plugin systems still expose enhancer-style APIs that are effectively Higher Order Components over base views.",
    },
  ],
  codeExamples: [
    {
      filename: "src/shared/hoc/withAuthGuard.tsx",
      language: "tsx",
      description:
        "A reusable auth guard wrapper that redirects unauthenticated users and keeps the wrapped component focused on its own UI responsibilities.",
      code: `import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";
import { useSession } from "@/entities/session/model/useSession";

interface GuardOptions {
  redirectTo: string;
}

export function withAuthGuard<Props extends object>(
  WrappedComponent: ComponentType<Props>,
  options: GuardOptions
) {
  return function AuthGuardedComponent(props: Props) {
    const router = useRouter();
    const session = useSession();

    useEffect(() => {
      if (!session.isLoading && !session.user) {
        router.replace(options.redirectTo);
      }
    }, [router, session.isLoading, session.user]);

    if (session.isLoading || !session.user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}`,
    },
    {
      filename: "src/shared/hoc/withFeatureFlag.tsx",
      language: "tsx",
      description:
        "Feature-flag HOC that conditionally renders a fallback while keeping feature checks centralized and reusable.",
      code: `import { ComponentType } from "react";
import { useFeatureFlag } from "@/shared/model/useFeatureFlag";

interface FeatureFlagOptions {
  flagName: string;
  fallback: React.ReactNode;
}

export function withFeatureFlag<Props extends object>(
  WrappedComponent: ComponentType<Props>,
  options: FeatureFlagOptions
) {
  return function FeatureFlaggedComponent(props: Props) {
    const isEnabled = useFeatureFlag(options.flagName);
    if (!isEnabled) {
      return <>{options.fallback}</>;
    }
    return <WrappedComponent {...props} />;
  };
}`,
    },
  ],
  pros: [
    "Encapsulates cross-cutting behavior without changing the original component source",
    "Works well for legacy class-based modules and existing enhancer APIs",
    "Provides a consistent way to apply guards and wrappers across route components",
  ],
  cons: [
    "Wrapper stacking can make component trees and debugging harder",
    "TypeScript props inference becomes harder with deeply composed HOCs",
    "Hooks usually provide a simpler composition model for new React code",
  ],
};
