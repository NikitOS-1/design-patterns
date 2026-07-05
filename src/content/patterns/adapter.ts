import { Pattern } from "@/lib/types";

export const adapter: Pattern = {
  slug: "adapter",
  category: "structural",
  code: "S-01",
  name: "Adapter",
  oneLiner: "Translate a shape you don't control into a shape your app actually wants to work with.",
  problem:
    "Real backends and third-party APIs almost never return data in the shape your components want. An ATS integration might expose candidates with `first_name`/`last_name`, dates as Unix timestamps, and stage names specific to that vendor; another ATS provider names all of these differently. If every component that renders a candidate has to know about all of that, your UI becomes coupled to whichever vendor happens to be behind it, and adding a second provider means changing every component.",
  solution:
    "Write one function per external shape whose only job is converting it into your app's internal, vendor-agnostic type. Components only ever import and render the internal type. When a new provider is added, you write one new adapter function — the rest of the app doesn't change at all.",
  whenToUse: [
    "Normalizing payloads from multiple third-party integrations (ATS providers, payment providers, CRMs) into one internal type",
    "Converting REST API snake_case JSON into camelCase TypeScript interfaces at the network boundary",
    "Wrapping an old component's prop shape so it can be dropped into code written against a new prop shape",
    "Adapting a legacy Redux store's shape into the interface a new feature slice expects",
  ],
  avoidWhen: [
    "You control both shapes and they could just be made the same — fix the source instead of adapting around it",
    "The 'translation' is really business logic (e.g. computing a derived score) — that belongs in a use-case/service function, not an adapter",
  ],
  realWorldExamples: [
    {
      name: "Unified.to / Merge.dev style ATS integrations",
      detail:
        "Unified-API platforms are themselves a large adapter layer: each ATS vendor's candidate/job shape gets normalized into one common schema so the product's UI only ever renders one internal `Candidate` type.",
    },
    {
      name: "next-auth session adapters",
      detail:
        "next-auth ships database adapters (Prisma, MongoDB, etc.) that translate each database's schema into the shape next-auth's session/JWT logic expects, so the auth flow never touches provider-specific queries directly.",
    },
    {
      name: "date-fns / dayjs wrappers around native Date",
      detail:
        "Teams often wrap whichever date library they use behind their own `formatDate()` helpers so the rest of the app depends on one internal date interface, not the library's own API.",
    },
    {
      name: "Analytics adapters (GA4, Segment, PostHog)",
      detail:
        "One `track(event)` interface with a thin adapter per vendor lets product code fire a single internal event shape; swapping or adding an analytics provider touches only its adapter.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/candidates/adapters/peopleForceAdapter.ts",
      language: "ts",
      description:
        "Adapting a specific ATS provider's raw candidate payload into the app's internal, provider-agnostic Candidate type — the shape every component actually renders.",
      code: `// The internal shape every component in the app depends on.
export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  appliedAt: Date;
  stage: "new" | "screening" | "interview" | "offer" | "hired" | "rejected";
}

// The raw shape PeopleForce's API actually returns — outside our control.
interface PeopleForceCandidateDTO {
  candidate_id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  applied_unix_ts: number;
  pipeline_stage: "New" | "Screening" | "Interview" | "Offer" | "Hired" | "Declined";
}

const STAGE_MAP: Record<PeopleForceCandidateDTO["pipeline_stage"], Candidate["stage"]> = {
  New: "new",
  Screening: "screening",
  Interview: "interview",
  Offer: "offer",
  Hired: "hired",
  Declined: "rejected",
};

// The adapter: the ONLY place that knows PeopleForce's field names exist.
export function adaptPeopleForceCandidate(dto: PeopleForceCandidateDTO): Candidate {
  return {
    id: dto.candidate_id,
    fullName: \`\${dto.first_name} \${dto.last_name}\`,
    email: dto.email_address,
    appliedAt: new Date(dto.applied_unix_ts * 1000),
    stage: STAGE_MAP[dto.pipeline_stage],
  };
}

// A second provider gets its own adapter, same output type:
// export function adaptGreenhouseCandidate(dto: GreenhouseCandidateDTO): Candidate { ... }

// Components only ever import Candidate and never see a DTO:
// <CandidateCard candidate={adaptPeopleForceCandidate(rawFromApi)} />`,
    },
    {
      filename: "src/features/billing/adapters/stripeInvoiceAdapter.ts",
      language: "ts",
      description:
        "Adapting Stripe's raw invoice shape (amounts in cents, Unix timestamps, vendor status strings) into the app's internal Invoice type, so billing UI depends on one clean shape.",
      code: `export interface Invoice {
  id: string;
  amount: number; // whole currency units, not cents
  currency: string;
  status: "paid" | "open" | "void";
  dueDate: Date | null;
}

// Stripe's raw shape — amounts in cents, dates as Unix seconds, extra statuses.
interface StripeInvoiceDTO {
  id: string;
  amount_due: number;
  currency: string;
  status: "paid" | "open" | "uncollectible" | "void" | "draft";
  due_date: number | null;
}

const STATUS_MAP: Record<StripeInvoiceDTO["status"], Invoice["status"]> = {
  paid: "paid",
  open: "open",
  draft: "open",
  uncollectible: "open",
  void: "void",
};

// The adapter: the only place that knows Stripe's field names and units.
export function adaptStripeInvoice(dto: StripeInvoiceDTO): Invoice {
  return {
    id: dto.id,
    amount: dto.amount_due / 100,
    currency: dto.currency.toUpperCase(),
    status: STATUS_MAP[dto.status],
    dueDate: dto.due_date ? new Date(dto.due_date * 1000) : null,
  };
}

// Billing components import Invoice and never see a Stripe DTO.`,
    },
  ],
  pros: [
    "Isolates vendor-specific field names, casing, and enums to one file per provider",
    "Adding a new provider never touches existing components",
    "Makes it trivial to unit test the translation logic in isolation from network calls",
  ],
  cons: [
    "Adds a mapping step and a duplicate type definition (internal vs. external shape) to maintain",
    "If the internal shape is designed too close to one provider, later providers still feel awkward to adapt",
  ],
};
