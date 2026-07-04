import { Pattern } from "@/lib/types";

export const singleton: Pattern = {
  slug: "singleton",
  category: "creational",
  code: "C-01",
  name: "Singleton",
  oneLiner: "Guarantee exactly one instance of something, with one global point of access to it.",
  problem:
    "Some things must exist exactly once for the whole app to behave correctly: the database client, the API client with its interceptors, the analytics client, the query cache. If every module that needs one just does `new PrismaClient()` or `new ApiClient()`, you end up with dozens of instances, each holding its own connections, caches, and interceptor state. In Next.js this gets worse: in development, hot module reloading re-executes your module files on every save, so a naive `new PrismaClient()` at the top of a file creates a fresh client — and a fresh pool of database connections — on every single edit, until you exhaust the database's connection limit.",
  solution:
    "Instead of letting every caller construct their own instance, you centralize construction behind a single accessor and cache the result — either in a module-level variable (which Node.js and the bundler already keep alive for the life of the process) or, in Next.js dev mode, on the `globalThis` object so it survives hot reloads. Every import of that module gets the same object back. The 'access point' can be a plain exported constant, an exported `getInstance()` function, or a React Context Provider mounted once at the root — the important part isn't the syntax, it's that construction happens once and is memoized.",
  whenToUse: [
    "A database client, ORM client, or connection pool shared by all API routes / Server Actions",
    "A configured HTTP client (axios/fetch wrapper) with shared interceptors, base URL, and auth headers",
    "A single analytics/telemetry client that buffers and batches events",
    "A shared in-memory cache or feature-flag client that must reflect the same state everywhere",
  ],
  avoidWhen: [
    "The 'shared state' is actually just React UI state — use Context or a store (Zustand/Redux) instead, which are testable and don't leak between requests",
    "You're on the server and the singleton would be shared across different users' requests (e.g. a per-request auth session) — that's a request-scoping bug, not a Singleton",
    "You need multiple configurations of the same client (e.g. two API endpoints) — that's a Factory, not a Singleton",
  ],
  realWorldExamples: [
    {
      name: "Prisma Client in Next.js",
      detail:
        "Prisma's own docs recommend caching the client on `globalThis` in development specifically to survive Next.js hot reloads without exhausting your Postgres connection limit.",
    },
    {
      name: "TanStack Query's QueryClient",
      detail:
        "One QueryClient instance is created per app and passed down via QueryClientProvider — every `useQuery` call reads and writes the same in-memory cache.",
    },
    {
      name: "A configured axios/fetch instance",
      detail:
        "`lib/apiClient.ts` exporting one configured instance means auth-refresh interceptors, base URL, and retry logic are defined exactly once and reused by every feature slice.",
    },
    {
      name: "next-auth's shared auth() handler",
      detail:
        "The auth configuration object is built once and imported everywhere a session needs to be read, instead of every route re-parsing environment variables and providers.",
    },
  ],
  codeExamples: [
    {
      filename: "src/lib/db.ts",
      language: "ts",
      description:
        "The canonical Next.js Prisma singleton: cache on globalThis in dev so hot reload doesn't spawn new connection pools, but not in production, where each server instance should own one client for its lifetime.",
      code: `import { PrismaClient } from "@prisma/client";

// Augment globalThis so TypeScript knows about our cached instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// The single access point. Every file does:
//   import { prisma } from "@/lib/db";
// and gets back the exact same client.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

// Only cache on globalThis outside production. In prod, each server
// process legitimately gets exactly one client for its lifetime anyway;
// in dev, this line is what survives Next.js hot module reloads.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}`,
    },
    {
      filename: "src/lib/apiClient.ts",
      language: "ts",
      description:
        "A shared, pre-configured fetch wrapper. Auth-refresh logic and base URL are defined once; every feature slice imports the same instance instead of re-implementing retry/refresh logic.",
      code: `type RequestOptions = RequestInit & { skipAuthRefresh?: boolean };

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const res = await fetch(\`\${this.baseUrl}\${path}\`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.accessToken ? { Authorization: \`Bearer \${this.accessToken}\` } : {}),
        ...options.headers,
      },
    });

    if (res.status === 401 && !options.skipAuthRefresh) {
      await this.refreshToken();
      return this.request<T>(path, { ...options, skipAuthRefresh: true });
    }

    if (!res.ok) throw new Error(\`API error \${res.status}: \${await res.text()}\`);
    return res.json() as Promise<T>;
  }

  private async refreshToken() {
    const res = await fetch(\`\${this.baseUrl}/auth/refresh\`, { method: "POST" });
    const { accessToken } = await res.json();
    this.setAccessToken(accessToken);
  }
}

// One instance, constructed once, imported everywhere.
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL!);`,
    },
  ],
  pros: [
    "One source of truth for connection pools, caches, and configuration — no drift between instances",
    "Solves a real Next.js dev-mode problem (hot reload exhausting DB connections)",
    "Cheap to reason about: import the module, use the export",
  ],
  cons: [
    "Global mutable state is harder to test in isolation — you often need to reset it between tests",
    "Easy to misuse for things that should be per-request (auth session) or per-component (UI state)",
    "Hides a hard dependency inside every module that imports it, which can make swapping implementations harder later",
  ],
};
