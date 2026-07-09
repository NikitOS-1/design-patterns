import { Pattern } from "@/lib/types";

export const frontendArchitectureReactNextjs: Pattern = {
  slug: "frontend-architecture-react-nextjs",
  category: "architecture-frontend",
  code: "A-01",
  name: "Frontend Architecture (React + Next.js)",
  oneLiner:
    "A practical map of React and Next.js architectures: what each one looks like, what problem it solves, and when to choose it.",
  problem:
    "React and Next.js projects rarely fail because of missing components — they fail because folders, ownership, and server/client boundaries stay undefined. Teams mix Feature-Based folders with Atomic Design atoms, sprinkle Clean Architecture layers without contracts, or jump to Micro Frontends before domain ownership is clear. The result is inconsistent imports, duplicated logic, and rewrites every time the product or team grows.",
  solution:
    "Treat frontend architecture as a named decision, not a folder fashion. Start from Feature-Based or Feature-Sliced Design for most product apps. Use Atomic Design for the design-system layer only. Apply Clean Architecture when domain rules must outlive UI frameworks. Keep a Modular Monolith when one deployable Next.js app needs strict module contracts. Reach for Micro Frontends only when independent teams must ship and deploy separately. Below is each architecture by name: what it is, what it solves, how it looks, and when it fits.",
  whenToUse: [
    "You need a shared vocabulary for architecture reviews across React and Next.js teams",
    "A product is growing past a flat `components/` folder and needs clear ownership",
    "You must decide between Feature-Based, FSD, Clean Architecture, Modular Monolith, or Micro Frontends",
    "Onboarding slows down because nobody can explain where new code should live",
  ],
  avoidWhen: [
    "A one-page prototype where any layered architecture is pure overhead",
    "Copying an enterprise architecture into a two-person MVP without ownership rules",
    "Mixing several architectures in one repo without documenting which layer owns what",
  ],
  realWorldExamples: [
    {
      name: "Feature-Sliced Design (FSD)",
      detail:
        "What it is: a layered frontend methodology with fixed layers — app → pages → widgets → features → entities → shared — and a strict one-way dependency rule (higher layers may import lower only). What it solves: uncontrolled cross-imports, unclear feature ownership, and god shared folders. How it looks: each slice has segments like ui/model/api and a public index.ts. Full deep-dive with flow diagrams in code: /patterns/feature-sliced-design.",
    },
    {
      name: "Feature-Based Architecture",
      detail:
        "What it is: organize by product feature (features/billing) instead of by file type (components/, hooks/). What it solves: weak ownership and hunting across folders for one feature. How it looks: each feature owns UI, hooks, API, and a public entrypoint. Dedicated page: /patterns/feature-based-architecture.",
    },
    {
      name: "Clean Architecture (frontend)",
      detail:
        "What it is: domain and use cases at the center; React/Next.js and HTTP as outer adapters with inward dependencies. What it solves: business rules trapped in components and hard-to-test flows. Dedicated page: /patterns/clean-architecture-frontend.",
    },
    {
      name: "Atomic Design",
      detail:
        "What it is: atoms → molecules → organisms → templates → pages for a design system — not a substitute for feature boundaries. What it solves: inconsistent UI primitives. Dedicated page: /patterns/atomic-design.",
    },
    {
      name: "Modular Monolith (frontend)",
      detail:
        "What it is: one deployable Next.js app with hard module public APIs and no separate frontend deploys. What it solves: spaghetti imports without Micro Frontend operational cost. Dedicated page: /patterns/modular-monolith-frontend.",
    },
    {
      name: "Micro Frontends",
      detail:
        "What it is: independently built and deployed frontend modules composed by a shell/host. What it solves: release bottlenecks for many teams — and amplifies bad boundaries if domains are unclear. Dedicated page: /patterns/micro-frontends.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/catalog/index.ts",
      language: "ts",
      description:
        "Feature-Based / FSD-style public API: the outside world imports only from the slice entrypoint, never from internal files.",
      code: `export { CatalogPage } from "./ui/CatalogPage";
export { CatalogFiltersPanel } from "./ui/CatalogFiltersPanel";
export { useCatalogFilters } from "./model/useCatalogFilters";
export { getCatalogPage } from "./api/getCatalogPage";
export type { CatalogProduct, CatalogFilters } from "./model/types";

// Allowed:   import { CatalogPage } from "@/features/catalog";
// Forbidden: import { CatalogPage } from "@/features/catalog/ui/CatalogPage";`,
    },
    {
      filename: "src/app/catalog/page.tsx",
      language: "tsx",
      description:
        "Next.js App Router as the composition root: server page loads data and passes props into feature UI — Modular Monolith / FSD pages layer.",
      code: `import { CatalogFiltersPanel, getCatalogPage, ProductGrid } from "@/features/catalog";

interface CatalogRouteProps {
  searchParams: { q?: string; category?: string };
}

export default async function CatalogRoute({ searchParams }: CatalogRouteProps) {
  const query = searchParams.q ?? "";
  const category = searchParams.category ?? "all";
  const catalogPage = await getCatalogPage({ query, category });

  return (
    <section className="space-y-6">
      <CatalogFiltersPanel initialQuery={query} initialCategory={category} />
      <ProductGrid products={catalogPage.products} />
    </section>
  );
}`,
    },
    {
      filename: "src/application/checkout/placeOrder.ts",
      language: "ts",
      description:
        "Clean Architecture use case: pure application logic depends on ports, not on React or fetch — UI and HTTP stay in outer adapters.",
      code: `export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRepositoryPort {
  save(order: { orderId: string; userId: string; totalAmount: number }): Promise<void>;
}

export interface PaymentGatewayPort {
  charge(input: { userId: string; amount: number }): Promise<{ paymentId: string }>;
}

export async function placeOrder(
  input: { orderId: string; userId: string; items: CartItem[] },
  ports: { orders: OrderRepositoryPort; payments: PaymentGatewayPort }
) {
  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  await ports.payments.charge({ userId: input.userId, amount: totalAmount });
  await ports.orders.save({
    orderId: input.orderId,
    userId: input.userId,
    totalAmount,
  });

  return { orderId: input.orderId, totalAmount };
}`,
    },
  ],
  pros: [
    "Gives teams a shared naming language for architecture choices instead of vague folder debates",
    "Makes trade-offs explicit: what each architecture solves and what it costs",
    "Supports gradual evolution — Feature-Based → FSD / Modular Monolith → Micro Frontends when justified",
  ],
  cons: [
    "Reading about six architectures does not replace enforcing one set of rules in code review",
    "Mixing styles without a written decision record recreates the original chaos",
    "Enterprise patterns applied too early slow small teams more than they help",
  ],
};
