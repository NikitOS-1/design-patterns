import { Pattern } from "@/lib/types";

export const microFrontends: Pattern = {
  slug: "micro-frontends",
  category: "architecture",
  code: "A-11",
  name: "Micro Frontends",
  oneLiner:
    "Independently develop, deploy, and compose separate frontend applications into a unified user interface through a host shell and runtime integration.",
  problem:
    "Large organizations with multiple teams contributing to one frontend application face a coordination ceiling. A team working on the trading module must coordinate deployment timing with the team working on account management, even when their changes are completely unrelated. A broken build in one domain blocks the release of another. Different teams have different quality gates, release cadences, and technology preferences, but a monolithic frontend forces a single CI/CD pipeline, a single framework version, and a single deployment decision. Feature flags and branch strategies help at the margins but do not eliminate the fundamental coupling. Attempts to modularize within the monolith reach a point where the only remaining coordination bottleneck is the deployment pipeline itself.",
  solution:
    "Micro Frontends decompose a web application into independently deployable frontend units, each owned by a separate team. A host shell application is responsible for routing, authentication, global navigation, and the runtime composition of remote modules. Individual micro frontends — remote applications — own their domain slice entirely: their own repository, CI/CD pipeline, deployments, and release schedule. Module Federation, pioneered by Webpack 5 and available in Rspack and Vite, is the dominant runtime integration mechanism. The host shell loads federated modules at runtime by fetching their manifest, resolving shared dependencies, and mounting the remote component into a designated container. Teams agree on a thin contract: the remote exposes a named component and the host provides an injection point. Shared dependencies such as React are negotiated at runtime to avoid duplicate bundles. Alternative composition strategies include server-side includes, iframes for strict isolation, and edge-level route stitching. Each strategy trades off isolation level, shared state capability, and performance differently. The distributed monolith is the principal failure mode: teams build independent deployments but retain tight runtime coupling through shared global state, cross-domain imports, or undeclared shared dependency versions, inheriting the complexity of both architectures without the benefits of either.",
  whenToUse: [
    "Organizations where multiple autonomous teams each own a domain and genuinely require independent deployment pipelines and release cadences",
    "Platforms where different sections have meaningfully different technology requirements — for example, a legacy AngularJS section and a new React section must coexist before full migration",
    "Enterprises operating at a scale where the coordination cost of a unified deployment pipeline is measurably blocking team velocity",
    "Incremental strangler-fig migrations where a new React application gradually replaces pages of a legacy monolith through runtime composition",
  ],
  avoidWhen: [
    "Teams that do not have stable, independent domain ownership — premature decomposition creates a distributed monolith with cross-team coupling and no deployment independence",
    "Applications where bundle size, initial load performance, and runtime latency are critical and the overhead of federated module loading is not acceptable",
    "Organizations without the platform engineering capacity to maintain shell infrastructure, dependency negotiation, and cross-micro-frontend contracts at scale",
  ],
  realWorldExamples: [
    {
      name: "Financial platform with trading and account modules",
      detail:
        "The trading team deploys their React application multiple times per day. The account management team deploys weekly. The shell routes /trade/* to the trading remote and /account/* to the account remote. Each team owns their deployment pipeline with no cross-team release coordination.",
    },
    {
      name: "Enterprise portal with legacy integration",
      detail:
        "A company is migrating from a server-rendered Java application to React. New sections are built as React micro frontends loaded into a shell. The legacy application continues serving unmigrated sections. Users see one consistent navigation while the migration proceeds route by route.",
    },
    {
      name: "E-commerce mega-site",
      detail:
        "Product search, checkout, account, and recommendations are owned by separate teams with separate repositories and deploy pipelines. Module Federation negotiates the React version at runtime. Each team can adopt React updates independently as long as they remain within the agreed version range.",
    },
    {
      name: "Multi-brand platform",
      detail:
        "A retail conglomerate operates multiple brands from one platform. Shared infrastructure — authentication, payment, analytics — is provided by the shell. Brand-specific storefronts are individual micro frontends that consume shell-provided context and inject their own product catalog and visual identity.",
    },
  ],
  codeExamples: [
    {
      filename: "remote/checkout/webpack.config.ts",
      language: "ts",
      description:
        "The checkout micro frontend exposes its root component through Module Federation. React is a shared singleton to avoid double-loading.",
      code: `import { ModuleFederationPlugin } from "@module-federation/webpack";
import path from "path";
import type { Configuration } from "webpack";

const config: Configuration = {
  entry: "./src/index",
  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "checkout",
      filename: "remoteEntry.js",
      exposes: {
        "./CheckoutApp": "./src/CheckoutApp",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
      },
    }),
  ],
};

export default config;`,
    },
    {
      filename: "host/shell/src/remotes/CheckoutRemote.tsx",
      language: "tsx",
      description:
        "The host shell lazily loads the checkout micro frontend at runtime. A Suspense boundary handles the async module resolution. Error boundary handles federation failures gracefully.",
      code: `import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RemoteLoadingFallback } from "@/shared/ui/RemoteLoadingFallback";
import { RemoteErrorFallback } from "@/shared/ui/RemoteErrorFallback";

const CheckoutApp = lazy(
  () => import("checkout/CheckoutApp") as Promise<{ default: React.ComponentType }>
);

export function CheckoutRemote() {
  return (
    <ErrorBoundary FallbackComponent={RemoteErrorFallback}>
      <Suspense fallback={<RemoteLoadingFallback />}>
        <CheckoutApp />
      </Suspense>
    </ErrorBoundary>
  );
}`,
    },
    {
      filename: "host/shell/src/app/router.tsx",
      language: "tsx",
      description:
        "The shell router maps URL prefixes to remote applications. Each route mounts a different micro frontend without the shell knowing the remote's internal routing.",
      code: `import { Routes, Route, Navigate } from "react-router-dom";
import { ShellLayout } from "@/shared/ui/ShellLayout";
import { CheckoutRemote } from "@/remotes/CheckoutRemote";
import { AccountRemote } from "@/remotes/AccountRemote";
import { CatalogRemote } from "@/remotes/CatalogRemote";

export function ShellRouter() {
  return (
    <ShellLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog/*" element={<CatalogRemote />} />
        <Route path="/checkout/*" element={<CheckoutRemote />} />
        <Route path="/account/*" element={<AccountRemote />} />
      </Routes>
    </ShellLayout>
  );
}`,
    },
  ],
  pros: [
    "Teams deploy independently with no cross-team release coordination, removing the primary bottleneck in large frontend organizations",
    "Technology and framework heterogeneity is possible — teams can adopt new versions or different tools without a global migration",
    "Clear runtime boundaries make it possible to fault-isolate a failing remote without taking down the entire application",
  ],
  cons: [
    "Distributed monolith risk is real — without careful contract discipline, cross-remote coupling reinstates the coordination problem at the network and runtime level",
    "Module federation configuration, shared dependency negotiation, and shell infrastructure require sustained platform engineering investment",
    "Initial page load performance is harder to optimize — async remote loading introduces latency that server-side rendering and edge integration can only partially mitigate",
  ],
};
