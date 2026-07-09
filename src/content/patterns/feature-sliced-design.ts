import { Pattern } from "@/lib/types";

export const featureSlicedDesign: Pattern = {
  slug: "feature-sliced-design",
  category: "architecture",
  code: "A-06",
  name: "Feature-Sliced Design (FSD)",
  oneLiner:
    "Organize a frontend codebase into strict horizontal layers and vertical domain slices so dependency direction is always predictable and bounded.",
  problem:
    "As React and Next.js applications grow, teams inevitably collide in shared folders. A components/ folder accumulates unrelated UI from a dozen domains. A utils/ barrel becomes a global catch-all. A hooks/ directory mixes HTTP calls, form state, and formatting helpers with no clear owner. When everything is reachable from everywhere, a change in one area causes unexpected breakage in another, and onboarding new engineers requires reading the entire codebase to understand boundaries. The core issue is that technical grouping — by file type — does not reflect how product domains change and who owns them. Two features that change together for different business reasons share the same folders, and teams must coordinate on every pull request.",
  solution:
    "Feature-Sliced Design introduces two structural axes: layers and slices. Layers are horizontal tiers in a fixed hierarchy — app, pages, widgets, features, entities, and shared — where a module at any layer may only import from layers below it. This one-way dependency rule eliminates circular imports and makes impact analysis trivial. Slices are vertical cuts within a layer that map to product domains such as cart, authentication, or user-profile. Within a slice, code is organized into segments — ui for React components, model for state and business logic, api for HTTP calls, lib for pure utilities, and config for constants and feature flags. Every slice exposes exactly one public API through its index.ts and never exposes internal files. No slice on the same layer may import another slice on the same layer, except through the explicit @x cross-import convention for intentional peer dependencies. The processes layer is considered deprecated and should not be used in new projects.",
  whenToUse: [
    "Medium to large product teams where multiple engineers work on overlapping domains simultaneously",
    "Applications where clear ownership per feature and predictable import direction reduce merge conflicts",
    "Long-lived codebases where the cost of tangled modules compounds over years of feature growth",
    "Teams that want onboarding rules enforced structurally rather than through documentation and code review conventions",
  ],
  avoidWhen: [
    "Small MVPs or prototypes where the ceremony of layers and public APIs slows delivery without measurable benefit",
    "Teams that lack the discipline to maintain public-API-only imports — partial adoption creates worse confusion than no structure",
    "Projects already using a well-working feature-based structure that does not yet need formal layer enforcement",
  ],
  realWorldExamples: [
    {
      name: "E-commerce storefront",
      detail:
        "cart, checkout, product-catalog, and user-account each become features with their own ui, model, and api segments. The CartButton widget composes features without owning their logic, and the pages layer hosts route-level components that assemble widgets.",
    },
    {
      name: "SaaS dashboard application",
      detail:
        "billing, workspace, analytics, and notifications are features. Entities hold the User and Organization domain models shared across features. The shared layer provides design-system components and HTTP client utilities.",
    },
    {
      name: "Next.js App Router with FSD",
      detail:
        "Next.js app/ directory maps to the FSD pages layer. Route segment folders import from widgets and features while the app/ directory itself holds global providers and root layout, matching the FSD app layer responsibility.",
    },
    {
      name: "Design system + product in one repository",
      detail:
        "The shared layer hosts atomic UI primitives and tokens. Entities expose domain-level components like UserAvatar. Features compose them with business logic. This avoids a second package while keeping concerns separated by layer.",
    },
  ],
  codeExamples: [
    {
      filename: "src/app/providers/index.ts",
      language: "ts",
      description:
        "The app layer wires global providers and imports only from shared. It never imports from features or pages directly.",
      code: `export { AppProviders } from "./AppProviders";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}`,
    },
    {
      filename: "src/features/cart/index.ts",
      language: "ts",
      description:
        "A feature's index.ts is its only public API. Consumers outside this slice import exclusively from here, never from internal paths.",
      code: `export { AddToCartButton } from "./ui/AddToCartButton";
export { CartSummary } from "./ui/CartSummary";
export { useCartSummary } from "./model/useCartSummary";
export { useAddToCart } from "./model/useAddToCart";
export type { CartItem, CartTotals } from "./model/types";`,
    },
    {
      filename: "src/pages/checkout/ui/CheckoutPage.tsx",
      language: "tsx",
      description:
        "A page assembles widgets and features using only their public APIs. Importing internal files from features is a boundary violation and should be caught by ESLint rules.",
      code: `import { CartSummary } from "@/features/cart";
import { CheckoutForm } from "@/features/checkout";
import { OrderConfirmationWidget } from "@/widgets/order-confirmation";

export function CheckoutPage() {
  return (
    <main>
      <CartSummary />
      <CheckoutForm />
      <OrderConfirmationWidget />
    </main>
  );
}

// Boundary violation — never do this:
// import { useCartStore } from "@/features/cart/model/cartStore";

// Correct — use the public API:
// import { useCartSummary } from "@/features/cart";`,
    },
  ],
  pros: [
    "One-way dependency rule eliminates circular imports and makes codebase impact analysis predictable",
    "Slice ownership maps directly to product domains, reducing cross-team coordination and merge conflicts",
    "Public API via index.ts enforces explicit contracts between modules and simplifies future refactors",
  ],
  cons: [
    "Requires consistent discipline across the entire team — partial adoption produces worse confusion than no structure",
    "Layer and segment decisions require upfront thinking that slows initial feature velocity on greenfield projects",
    "Tooling such as ESLint import boundary plugins needs configuration and maintenance alongside the architecture rules",
  ],
};
