import { Pattern } from "@/lib/types";

export const reactArchitecturePlaybook: Pattern = {
  slug: "react-architecture-playbook",
  category: "architecture",
  code: "A-03",
  name: "React Architecture Playbook",
  oneLiner:
    "Choose React architecture by team size, domain complexity, and release topology, not by trend.",
  problem:
    "Teams often pick architecture labels without clear criteria, then mix incompatible rules in one codebase. That leads to folder inconsistency, unstable module boundaries, and repeated rewrites when product scope or team size grows.",
  solution:
    "Treat architecture as a decision matrix. Feature-Based and FSD are practical defaults for most product teams. Clean Architecture is useful when domain rules dominate and framework changes are expected. Atomic Design helps organize design-system primitives. Modular Monolith keeps one deployable frontend with strict module contracts. Micro Frontends are justified only when multiple teams must release independently at high scale.",
  whenToUse: [
    "Feature-Based Architecture for small to medium teams shipping one product in one deployable app",
    "FSD when you need strict layer boundaries and predictable feature ownership in growing teams",
    "Clean Architecture when business rules must outlive UI framework and transport details",
    "Atomic Design for design-system-heavy products with many reusable UI primitives",
    "Modular Monolith when you need domain isolation without distributed frontend deployment complexity",
    "Micro Frontends when independent teams require separate deployment pipelines and runtime composition",
  ],
  avoidWhen: [
    "Adopting Micro Frontends before domain boundaries and ownership models are stable",
    "Applying full Clean Architecture ceremony to a short-lived MVP",
    "Using Atomic Design as a replacement for feature boundaries instead of a UI-system layer",
  ],
  realWorldExamples: [
    {
      name: "FSD in large product UIs",
      detail:
        "Teams split app, pages, widgets, features, entities, and shared layers to enforce dependency direction and avoid cross-module leakage.",
    },
    {
      name: "Feature-Based architecture in SaaS products",
      detail:
        "Domains like billing, workspace, and notifications own their UI, hooks, API calls, and tests while sharing only common primitives.",
    },
    {
      name: "Modular monolith frontend",
      detail:
        "One Next.js app keeps strict module entrypoints, enabling local refactors and shared runtime performance without federation overhead.",
    },
    {
      name: "Micro Frontends in enterprise portals",
      detail:
        "Independent teams deploy separate frontend modules for account, reporting, and admin areas via module federation or runtime composition.",
    },
  ],
  codeExamples: [
    {
      filename: "src/architecture/reactArchitectureDecision.ts",
      language: "ts",
      description:
        "A typed decision helper that selects a baseline architecture from team and product constraints.",
      code: `type TeamScale = "small" | "medium" | "large";
type DomainComplexity = "low" | "medium" | "high";
type DeploymentNeed = "single-app" | "independent-modules";

export type ReactArchitectureOption =
  | "feature-based"
  | "fsd"
  | "clean-architecture"
  | "modular-monolith"
  | "micro-frontends";

interface ReactArchitectureInput {
  teamScale: TeamScale;
  domainComplexity: DomainComplexity;
  deploymentNeed: DeploymentNeed;
  uiSystemMaturity: "low" | "high";
}

export function chooseReactArchitecture(input: ReactArchitectureInput): ReactArchitectureOption {
  if (input.deploymentNeed === "independent-modules" && input.teamScale === "large") {
    return "micro-frontends";
  }

  if (input.domainComplexity === "high" && input.teamScale !== "small") {
    return "fsd";
  }

  if (input.domainComplexity === "high" && input.uiSystemMaturity === "high") {
    return "clean-architecture";
  }

  if (input.teamScale === "medium" || input.teamScale === "large") {
    return "modular-monolith";
  }

  return "feature-based";
}`,
    },
    {
      filename: "src/features/billing/index.ts",
      language: "ts",
      description:
        "A module public API pattern used in Feature-Based, FSD, and modular monolith styles to keep boundaries explicit.",
      code: `export { BillingOverviewCard } from "./ui/BillingOverviewCard";
export { useBillingOverview } from "./model/useBillingOverview";
export { fetchBillingOverview } from "./api/fetchBillingOverview";
export type { BillingOverview, BillingInvoice } from "./model/types";`,
    },
  ],
  pros: [
    "Makes architecture choice explicit and tied to real delivery constraints",
    "Reduces random mixing of patterns that create long-term maintenance debt",
    "Helps teams evolve from simple structures to scalable module ownership gradually",
  ],
  cons: [
    "Decision matrices still require engineering judgment and periodic re-evaluation",
    "Over-documenting architecture can slow teams if not connected to code review rules",
    "No architecture style removes the need for strong module ownership discipline",
  ],
};
