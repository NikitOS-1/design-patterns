import { Pattern } from "@/lib/types";

export const proxy: Pattern = {
  slug: "proxy",
  category: "structural",
  code: "S-04",
  name: "Proxy",
  oneLiner: "Stand in front of a real object to add caching, lazy-loading, access control, or logging — transparently.",
  problem:
    "You want to add behavior around access to something — cache API responses, defer loading an expensive resource until it's needed, check permissions before a call, or log every access — without changing the thing itself or every call site that uses it.",
  solution:
    "Put an object with the same interface in front of the real one. Callers talk to the proxy exactly as they'd talk to the original; the proxy decides when to hit the real thing, when to serve a cache, or whether to allow the call at all. JavaScript even has a built-in `Proxy` for this, but in frontend the pattern shows up more often as caching data-access wrappers, lazy-loaded components, and permission gates.",
  whenToUse: [
    "Caching/memoizing an expensive data source behind the same interface it already exposes",
    "Lazy-loading a heavy component or resource only when it's first needed",
    "A permission proxy that checks access before delegating to the real API client",
    "Logging or instrumenting every access to an object without touching its call sites",
  ],
  avoidWhen: [
    "You don't need to intercept access at all — a proxy is pure overhead then",
    "The added behavior belongs in the real object or a dedicated service, not a transparent wrapper",
  ],
  realWorldExamples: [
    {
      name: "React.lazy + Suspense",
      detail:
        "`React.lazy(() => import('./Heavy'))` returns a stand-in that has the same usage as the real component but only loads its code when first rendered — a lazy-loading proxy for a component.",
    },
    {
      name: "TanStack Query as a caching proxy",
      detail:
        "`useQuery` sits in front of your fetch function: callers ask for data the same way every time, but the query cache decides whether to return cached data or actually hit the network.",
    },
    {
      name: "Valtio / MobX reactive proxies",
      detail:
        "These libraries wrap state in a JavaScript `Proxy` so reads are tracked and writes trigger re-renders — access interception done transparently to the code using the state.",
    },
  ],
  codeExamples: [
    {
      filename: "src/lib/api/CachingClientProxy.ts",
      language: "ts",
      description:
        "A caching proxy that implements the same interface as the real client. Callers don't know or care whether a response came from the network or the cache.",
      code: `export interface DataClient {
  getCandidate(id: string): Promise<Candidate>;
}

interface Candidate {
  id: string;
  fullName: string;
}

// The "real" client actually hits the network.
class ApiDataClient implements DataClient {
  async getCandidate(id: string): Promise<Candidate> {
    const res = await fetch(\`/api/candidates/\${id}\`);
    return res.json();
  }
}

// The proxy has the SAME interface, so it's a drop-in replacement.
export class CachingClientProxy implements DataClient {
  private cache = new Map<string, { value: Candidate; expires: number }>();

  constructor(
    private readonly real: DataClient,
    private readonly ttlMs = 60_000
  ) {}

  async getCandidate(id: string): Promise<Candidate> {
    const cached = this.cache.get(id);
    if (cached && cached.expires > Date.now()) {
      return cached.value; // served from cache, real client untouched
    }

    const value = await this.real.getCandidate(id);
    this.cache.set(id, { value, expires: Date.now() + this.ttlMs });
    return value;
  }
}

// Callers depend on DataClient and never know a proxy is involved:
// const client: DataClient = new CachingClientProxy(new ApiDataClient());
// await client.getCandidate("abc"); // network
// await client.getCandidate("abc"); // cache`,
    },
  ],
  pros: [
    "Adds caching, lazy-loading, or access control without changing the real object or its call sites",
    "Fully transparent — callers use the same interface either way",
    "Can be swapped in and out (e.g. disable caching) by changing one construction line",
  ],
  cons: [
    "Another layer to reason about; a stale or buggy cache proxy causes confusing 'why is this data old?' bugs",
    "Overkill when the surrounding library (React Query, SWR) already provides the caching you were about to build",
  ],
};
