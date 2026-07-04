import { Pattern } from "@/lib/types";

export const builder: Pattern = {
  slug: "builder",
  category: "creational",
  code: "C-03",
  name: "Builder",
  oneLiner: "Construct a complex object step by step, instead of one constructor with a dozen optional params.",
  problem:
    "A data table, search page, or reporting screen typically needs to assemble a request out of many optional pieces: filters, sort order, pagination, included relations, date ranges. If you model that as one function with ten optional parameters (or one giant options object built inline at every call site), call sites become unreadable and it's easy to forget a piece or pass things in the wrong shape. Every screen that fetches similar data re-invents the same URL/query assembly.",
  solution:
    "Wrap the assembly in a small class (or a chain of pure functions) that exposes one method per piece — `.filter()`, `.sortBy()`, `.paginate()` — each returning `this` (or a new builder instance) so calls can be chained, ending in a `.build()` that produces the final request object or URL. The construction logic lives in one place, reads top-to-bottom like a sentence, and can't be built into an invalid half-state.",
  whenToUse: [
    "Assembling REST/GraphQL query parameters for filterable, sortable, paginated data tables",
    "Building complex class-name strings from variant/size/state flags (a 'variant builder')",
    "Constructing multi-step configuration objects, e.g. a chart config with axes, series, and legends added incrementally",
    "Composing a complex validation schema (Zod/Yup) piece by piece based on runtime conditions",
  ],
  avoidWhen: [
    "The object only has 2-3 always-required fields — a plain object literal is clearer",
    "You need immutability guarantees across concurrent builds — prefer a fluent builder that returns new instances rather than mutating `this`",
  ],
  realWorldExamples: [
    {
      name: "Prisma's fluent query builder",
      detail:
        "`prisma.candidate.findMany({ where, orderBy, include, skip, take })` is Prisma's object-literal builder; many teams wrap it in their own `.where().sortBy().paginate().build()` for reusable list-page logic.",
    },
    {
      name: "Zod schema composition",
      detail:
        "`z.object({...}).extend({...}).refine(...)` builds a validation schema incrementally, chaining refinements instead of one monolithic schema definition.",
    },
    {
      name: "Tailwind's `clsx`/`cva` (class-variance-authority)",
      detail:
        "`cva` builds up a final className string from base classes plus variant/size/state options — a builder for style strings instead of request objects.",
    },
    {
      name: "URLSearchParams-based API query builders",
      detail:
        "Data-table hooks in dashboards commonly wrap `URLSearchParams` in a small fluent builder so filters, sort, and page all compose into one query string.",
    },
  ],
  codeExamples: [
    {
      filename: "src/lib/api/CandidateQueryBuilder.ts",
      language: "ts",
      description:
        "A fluent builder for assembling a filtered, sorted, paginated API request — the kind of thing a recruiter dashboard's candidate list would use.",
      code: `export interface CandidateQuery {
  filters: Record<string, string | string[]>;
  sort?: { field: string; direction: "asc" | "desc" };
  page: number;
  pageSize: number;
}

export class CandidateQueryBuilder {
  private query: CandidateQuery = { filters: {}, page: 1, pageSize: 20 };

  filter(field: string, value: string | string[]): this {
    this.query.filters[field] = value;
    return this;
  }

  sortBy(field: string, direction: "asc" | "desc" = "asc"): this {
    this.query.sort = { field, direction };
    return this;
  }

  paginate(page: number, pageSize = 20): this {
    this.query.page = page;
    this.query.pageSize = pageSize;
    return this;
  }

  build(): CandidateQuery {
    return this.query;
  }

  toSearchParams(): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(this.query.filters)) {
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
    if (this.query.sort) {
      params.set("sort", \`\${this.query.sort.field}:\${this.query.sort.direction}\`);
    }
    params.set("page", String(this.query.page));
    params.set("pageSize", String(this.query.pageSize));
    return params;
  }
}

// Usage in a Server Component or a data-fetching hook:
const params = new CandidateQueryBuilder()
  .filter("stage", ["screening", "interview"])
  .filter("role", "frontend-engineer")
  .sortBy("appliedAt", "desc")
  .paginate(1, 25)
  .toSearchParams();

// fetch(\`/api/candidates?\${params.toString()}\`)`,
    },
  ],
  pros: [
    "Call sites read like a sentence and can't easily be built into an invalid half-state",
    "Optional pieces stay optional without ten undefined arguments",
    "Encourages reuse — the same builder serves every screen that needs similar queries",
  ],
  cons: [
    "Overkill for objects with only a couple of required fields",
    "A mutable `this`-returning builder can cause bugs if the same instance is reused across requests — prefer returning fresh instances in shared/server code",
  ],
};
