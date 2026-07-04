import { Pattern } from "@/lib/types";

export const iterator: Pattern = {
  slug: "iterator",
  category: "behavioral",
  code: "B-08",
  name: "Iterator",
  oneLiner: "Traverse a collection one item at a time without exposing how it's stored underneath.",
  problem:
    "Consumers of a collection shouldn't need to know whether it's an array, a tree, a paginated API, or a linked list to walk through it. And some sequences are effectively infinite or lazily computed (an endless feed, paginated results), where materializing the whole thing up front is impossible or wasteful.",
  solution:
    "Expose a standard way to produce the next item on demand. JavaScript builds this in: any object implementing the iterator protocol (or a generator function with `yield`) can be walked with `for...of` and spread, regardless of its internal structure. Async iterators (`for await...of`) extend this to streams and pagination — you consume pages one at a time without ever holding the full result set.",
  whenToUse: [
    "Lazily walking paginated API results as an async stream",
    "Exposing a custom data structure (tree, graph) for uniform traversal",
    "Generating sequences on demand (infinite scroll cursors, id generators)",
    "Streaming responses (SSE, chunked LLM output) consumed chunk by chunk",
  ],
  avoidWhen: [
    "You already have a plain array and `.map`/`.filter` do the job — no custom iterator needed",
    "The whole collection is small and eager loading is simplest",
  ],
  realWorldExamples: [
    {
      name: "Async iteration over paginated APIs",
      detail:
        "An async generator yields items page by page; the caller writes `for await (const item of fetchAll())` and never manages page cursors itself.",
    },
    {
      name: "Streaming LLM / SSE responses",
      detail:
        "Reading a streamed response with `for await...of` over the body reader consumes tokens as they arrive, rather than waiting for and buffering the whole response.",
    },
    {
      name: "Built-in iterables (Map, Set, generators)",
      detail:
        "JS Maps, Sets, and generator functions all implement the iterator protocol, so `for...of` and spread work uniformly no matter the internal storage.",
    },
  ],
  codeExamples: [
    {
      filename: "src/lib/api/paginate.ts",
      language: "ts",
      description:
        "An async generator that yields candidates page by page. The consumer iterates one item at a time and never touches page cursors.",
      code: `interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

// The iterator hides pagination entirely behind a simple async sequence.
export async function* iterateCandidates(
  fetchPage: (cursor: string | null) => Promise<Page<Candidate>>
): AsyncGenerator<Candidate> {
  let cursor: string | null = null;

  do {
    const page = await fetchPage(cursor);
    for (const candidate of page.items) {
      yield candidate; // hand out one at a time, lazily
    }
    cursor = page.nextCursor;
  } while (cursor !== null);
}

interface Candidate {
  id: string;
  fullName: string;
}

// Consumer never sees a cursor or a page — just a stream of candidates:
// for await (const candidate of iterateCandidates(fetchCandidatePage)) {
//   process(candidate);
//   if (someCondition) break; // stops fetching further pages, too
// }`,
    },
  ],
  pros: [
    "Consumers traverse without knowing the underlying storage or transport",
    "Lazy: items (and pages) are produced only as consumed, so you can stop early",
    "Works with native `for...of` / `for await...of` and spread — no custom API to learn",
  ],
  cons: [
    "Generators can be harder to debug than a plain loop over an array",
    "Lazy evaluation surprises people expecting the whole collection to already exist",
  ],
};
