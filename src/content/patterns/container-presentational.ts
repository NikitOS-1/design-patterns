import { Pattern } from "@/lib/types";

export const containerPresentational: Pattern = {
  slug: "container-presentational",
  category: "react",
  code: "R-05",
  name: "Container / Presentational",
  oneLiner: "Separate components that fetch and manage data from components that just render it.",
  problem:
    "When a component both fetches data and renders complex markup, it becomes hard to test (you can't render it without mocking the network), hard to reuse (the visuals are welded to one data source), and hard to preview in isolation (Storybook, design review). Data concerns and presentation concerns are tangled in one file.",
  solution:
    "Split responsibilities: a container owns data fetching, state, and orchestration, and passes plain props down to a presentational component that only renders those props and emits callbacks. The presentational piece is pure and trivially testable; the container is thin. In the Next.js App Router this maps cleanly onto Server Components (fetch data) rendering Client Components (interactive presentation).",
  whenToUse: [
    "A view whose rendering you want to test or preview without hitting the network",
    "Presentational components you want to reuse with different data sources",
    "Next.js App Router: Server Components fetching, Client Components presenting",
    "Keeping Storybook stories simple by feeding presentational components plain props",
  ],
  avoidWhen: [
    "The component is tiny — splitting it just doubles the file count for no gain",
    "You'd split so aggressively that trivial 'pass-through' containers pile up",
    "A custom hook already separates the data logic well enough without a second component",
  ],
  realWorldExamples: [
    {
      name: "Server Components fetch, Client Components render",
      detail:
        "The App Router's idiomatic split is a Server Component that awaits data and renders an interactive Client Component with it as props — Container/Presentational enforced by the framework boundary.",
    },
    {
      name: "Storybook-driven design systems",
      detail:
        "Presentational components take plain props so they render in Storybook with mock data, while containers (excluded from stories) wire up the real data.",
    },
    {
      name: "Testable view components",
      detail:
        "Splitting out a pure `<CandidateTable candidates={...} />` lets unit tests render it with fixtures instead of mocking fetch, keeping tests fast and focused.",
    },
    {
      name: "Classic Redux connect() containers",
      detail:
        "The original container/presentational split: a `connect()`-ed container maps store state to props and passes them to a 'dumb' presentational component that just renders them.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/candidates/CandidateListContainer.tsx",
      language: "tsx",
      description:
        "The container (a Server Component) fetches and shapes data, then hands plain props to a pure presentational component.",
      code: `import { CandidateList } from "./CandidateList";
import { adaptCandidate } from "./adapters";

// CONTAINER: owns data. No markup decisions beyond passing props down.
export async function CandidateListContainer({ jobId }: { jobId: string }) {
  const res = await fetch(\`\${process.env.API_URL}/jobs/\${jobId}/candidates\`, {
    next: { revalidate: 60 },
  });
  const raw = await res.json();
  const candidates = raw.map(adaptCandidate);

  return <CandidateList candidates={candidates} />;
}`,
    },
    {
      filename: "src/features/candidates/CandidateList.tsx",
      language: "tsx",
      description:
        "The presentational component is pure: props in, markup out. It has no idea where the data came from, so it's trivial to test and preview.",
      code: `import type { Candidate } from "./types";

interface Props {
  candidates: Candidate[];
  onSelect?: (id: string) => void;
}

// PRESENTATIONAL: pure. Renders props, emits callbacks, fetches nothing.
export function CandidateList({ candidates, onSelect }: Props) {
  if (candidates.length === 0) {
    return <p className="text-sm text-ink-300">No candidates yet.</p>;
  }

  return (
    <ul className="divide-y divide-ink-600">
      {candidates.map((candidate) => (
        <li key={candidate.id}>
          <button onClick={() => onSelect?.(candidate.id)} className="w-full py-3 text-left">
            <span className="font-medium text-ink-100">{candidate.fullName}</span>
            <span className="ml-2 text-sm text-ink-400">{candidate.stage}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

// Tests/Storybook render this directly with fixtures — no network needed:
// <CandidateList candidates={mockCandidates} />`,
    },
  ],
  pros: [
    "Presentational components are pure, fast to test, and easy to preview in isolation",
    "The same view can be reused with different data sources",
    "Maps naturally onto the Server/Client Component boundary in Next.js",
  ],
  cons: [
    "Can produce a lot of thin pass-through containers if applied dogmatically",
    "Custom hooks often achieve the separation with less ceremony for smaller cases",
  ],
};
