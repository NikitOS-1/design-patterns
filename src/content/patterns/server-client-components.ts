import { Pattern } from "@/lib/types";

export const serverClientComponents: Pattern = {
  slug: "server-client-components",
  category: "react",
  code: "R-07",
  name: "Server / Client Components",
  oneLiner: "Render on the server by default; opt into client-side interactivity only where you actually need it.",
  problem:
    "Shipping every component to the browser means large JS bundles, data fetching that waterfalls on the client, and secrets/heavy libraries that have no business being in client code. But some components genuinely need interactivity — state, effects, event handlers — which only runs in the browser.",
  solution:
    "In the Next.js App Router, components are Server Components by default: they run only on the server, can be async, fetch data directly, and ship zero JS to the client. You opt a component into the client with `\"use client\"` at the top — only then does it (and its imports) get bundled for the browser. The pattern is to keep the tree server-rendered and push `\"use client\"` down to the smallest interactive leaves, passing server-fetched data down as props.",
  whenToUse: [
    "Data fetching and rendering that doesn't need browser interactivity (keep it a Server Component)",
    "Accessing secrets, databases, or heavy server-only libraries without leaking them to the client",
    "Isolating interactivity (forms, toggles, menus) into small `\"use client\"` leaves",
    "Reducing client bundle size by keeping most of the tree on the server",
  ],
  avoidWhen: [
    "The component needs state, effects, event handlers, or browser APIs — it must be a Client Component",
    "Marking a high-up component `\"use client\"` and dragging its whole subtree to the client — push the boundary down instead",
    "Trying to pass functions or non-serializable values from a Server to a Client Component as props (not allowed)",
  ],
  realWorldExamples: [
    {
      name: "Server Component fetches, Client Component interacts",
      detail:
        "The idiomatic App Router shape: an async Server Component awaits data and renders a small `\"use client\"` component (a filter bar, an editable form) with that data as props — interactivity stays a leaf.",
    },
    {
      name: "Keeping secrets and DB access server-side",
      detail:
        "Server Components query the database or use API keys directly; because they never ship to the browser, those secrets and the ORM never enter the client bundle.",
    },
    {
      name: "Streaming with Suspense",
      detail:
        "Server Components paired with `<Suspense>` stream HTML as data resolves, so the shell renders instantly while slower sections fill in — impossible with an all-client tree.",
    },
    {
      name: "Server Actions from client forms",
      detail:
        "A client form calls a server action (a `'use server'` function) directly as its onSubmit; the mutation runs on the server with DB access while the form stays an interactive client leaf.",
    },
  ],
  codeExamples: [
    {
      filename: "src/app/candidates/page.tsx",
      language: "tsx",
      description:
        "A Server Component (the default — note there's no \"use client\") that fetches data on the server and passes it to a small interactive client leaf.",
      code: `import { CandidateFilters } from "./CandidateFilters"; // a "use client" leaf
import { db } from "@/lib/db";

// Server Component: async, runs only on the server, ships no JS itself.
export default async function CandidatesPage() {
  // Direct DB access — safe, because this never reaches the browser.
  const candidates = await db.candidate.findMany({ orderBy: { appliedAt: "desc" } });

  return (
    <section>
      <h1 className="text-2xl font-semibold">Candidates</h1>
      {/* Only the interactive part is a client component. Data flows
          down as serializable props. */}
      <CandidateFilters initialCandidates={candidates} />
    </section>
  );
}`,
    },
    {
      filename: "src/app/candidates/CandidateFilters.tsx",
      language: "tsx",
      description:
        "The interactive leaf opts into the client with \"use client\". Only this component and its imports are bundled for the browser.",
      code: `"use client";

import { useState, useMemo } from "react";
import type { Candidate } from "@/features/candidates/types";

// Client Component: has state and event handlers, so it runs in the browser.
export function CandidateFilters({ initialCandidates }: { initialCandidates: Candidate[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => initialCandidates.filter((c) => c.fullName.toLowerCase().includes(query.toLowerCase())),
    [initialCandidates, query]
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter candidates…"
        className="mb-4 w-full bg-ink-800 px-3 py-2"
      />
      <ul>
        {filtered.map((c) => (
          <li key={c.id}>{c.fullName}</li>
        ))}
      </ul>
    </div>
  );
}`,
    },
  ],
  pros: [
    "Smaller client bundles — most of the tree ships zero JS",
    "Data fetching happens on the server, close to the source, with no client waterfalls",
    "Secrets, DB access, and heavy libraries stay off the client entirely",
  ],
  cons: [
    "A real mental-model shift: what runs where, and the serialization boundary between them",
    "Props crossing the boundary must be serializable — no functions, classes, or Dates-with-methods",
    "Accidentally marking a high component `\"use client\"` pulls its whole subtree to the client",
  ],
};
