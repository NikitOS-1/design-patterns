import { Pattern } from "@/lib/types";

export const modularMonolithFrontend: Pattern = {
  slug: "modular-monolith-frontend",
  category: "architecture",
  code: "A-10",
  name: "Modular Monolith (Frontend)",
  oneLiner:
    "Ship one deployable Next.js application while enforcing hard module boundaries and public entrypoints that behave as if the modules were independent packages.",
  problem:
    "Teams that identify real domain boundaries often jump to Micro Frontends as the natural next step, taking on distributed deployment complexity, module federation configuration, and cross-team versioning problems before their ownership model is mature enough to justify it. Equally common is the opposite failure: a large monolith application with no module structure at all, where every domain reaches into every other domain's internals and the codebase becomes untestable and unmaintainable over time. Both failure modes share the same root cause — the absence of deliberate module contracts that let teams work independently without the operational overhead of separate deployments.",
  solution:
    "A Modular Monolith Frontend is a single deployable application — typically one Next.js app — divided into strongly bounded modules. Each module owns a directory, exposes a single index.ts public API, and considers all other paths private. Modules do not import from each other's internal files; they import only from each other's public APIs. A linting rule enforces this. The application shell composes modules at the page and layout level. A shared layer provides true primitives — HTTP client, UI atoms, date formatting — that are not owned by any module. The key insight is that module isolation is a code-level and review-level discipline that does not require separate deployments to be effective. When domain boundaries are well established and team ownership is stable, individual modules can later be extracted to separate deployable units with minimal architectural rework because their contracts are already explicit. Until that point, the single deployment gives better runtime performance, simpler CI/CD, shared caching, and easier cross-module transactions.",
  whenToUse: [
    "Teams that need clear domain isolation and independent feature ownership within one application without paying the operational cost of Micro Frontends",
    "Next.js applications that are outgrowing flat folder structures and need enforced module contracts to scale team collaboration",
    "Organizations planning a future transition to Micro Frontends who want to establish clean module boundaries first, avoiding a big-bang migration later",
    "Products where runtime performance, shared caching, and unified deployment pipelines are priorities over independent release cadences",
  ],
  avoidWhen: [
    "Teams that genuinely need independent deployment of frontend modules with separate release cycles — in that case accept the full Micro Frontends model deliberately",
    "Applications so small that module boundary enforcement adds structural overhead without reducing coordination cost",
    "Situations where the team lacks the discipline to maintain public-API-only imports — without enforcement, a modular monolith degrades into a tangled monolith faster than a simpler structure would",
  ],
  realWorldExamples: [
    {
      name: "Multi-domain SaaS application",
      detail:
        "modules/billing/, modules/workspace/, modules/analytics/, and modules/notifications/ each export their public API via index.ts. The app shell in app/ imports only those public APIs and never reaches into module internals. ESLint no-restricted-imports rules enforce the contract.",
    },
    {
      name: "Gradual extraction toward Micro Frontends",
      detail:
        "A fintech platform starts as a modular monolith. After twelve months, the trading module's ownership and release cadence diverge enough from the account module to justify separate deployment. Because module contracts are already explicit, the extraction is a packaging and routing change rather than a refactor.",
    },
    {
      name: "E-commerce storefront with checkout isolation",
      detail:
        "The checkout module has its own state, API calls, and UI components. Marketing experiments on the product listing module never accidentally break checkout because the two modules share only typed data contracts through their public APIs.",
    },
    {
      name: "Internal tooling platform",
      detail:
        "An internal enterprise dashboard ships as one Next.js application with modules for HR tools, expense management, and IT helpdesk. One deployment, one CI pipeline, shared authentication — but each module is developed and reviewed by a separate team without coupling.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/billing/index.ts",
      language: "ts",
      description:
        "A module's public API. This is the only file other modules and the app shell may import from. Everything else under src/modules/billing/ is private.",
      code: `export { BillingOverviewCard } from "./ui/BillingOverviewCard";
export { InvoiceTable } from "./ui/InvoiceTable";
export { UpgradePlanModal } from "./ui/UpgradePlanModal";
export { useBillingOverview } from "./model/useBillingOverview";
export { usePlanUpgrade } from "./model/usePlanUpgrade";
export type { BillingPlan, Invoice, BillingOverview } from "./model/types";`,
    },
    {
      filename: "src/app/(dashboard)/billing/page.tsx",
      language: "tsx",
      description:
        "The app shell composes modules at the page level using only public APIs. It has no knowledge of module internals.",
      code: `import { BillingOverviewCard, InvoiceTable, UpgradePlanModal } from "@/modules/billing";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function BillingPage() {
  return (
    <div>
      <PageHeader title="Billing" />
      <BillingOverviewCard />
      <InvoiceTable />
      <UpgradePlanModal />
    </div>
  );
}

// Boundary violation — never import from a module's internal paths:
// import { useBillingStore } from "@/modules/billing/model/billingStore";

// Correct — use the public API:
// import { useBillingOverview } from "@/modules/billing";`,
    },
    {
      filename: ".eslintrc.json (module boundary rule)",
      language: "ts",
      description:
        "An ESLint configuration fragment that enforces module boundary contracts by restricting imports to public API entrypoints only.",
      code: `{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["@/modules/*/ui/*", "@/modules/*/model/*", "@/modules/*/api/*"],
            "message": "Import from the module public API (index.ts) only."
          }
        ]
      }
    ]
  }
}`,
    },
  ],
  pros: [
    "Provides genuine domain isolation and independent team ownership without the operational complexity of separate frontend deployments",
    "Single deployment keeps runtime performance high — no module federation latency, waterfall loading, or cross-module version mismatches",
    "Clean module contracts make a future extraction to Micro Frontends a packaging decision rather than an architectural refactor",
  ],
  cons: [
    "Requires disciplined enforcement of public-API imports — without linting rules, internal imports accumulate quietly and defeat the boundaries",
    "Cannot satisfy teams that truly need independent release cadences for separate modules without switching to Micro Frontends",
    "Module boundary decisions require upfront domain analysis; wrong boundaries are expensive to correct after significant code is written inside them",
  ],
};
