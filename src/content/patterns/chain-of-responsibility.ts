import { Pattern } from "@/lib/types";

export const chainOfResponsibility: Pattern = {
  slug: "chain-of-responsibility",
  category: "behavioral",
  code: "B-05",
  name: "Chain of Responsibility",
  oneLiner: "Pass a request through a chain of handlers until one handles it — each stays independent.",
  problem:
    "A request often needs to go through several independent steps, each of which might handle it, transform it, or pass it along: an API request pipeline (auth → rate-limit → validate → log), a form validation sequence, or event handling that bubbles up until something responds. Hardcoding all steps into one function couples them together and makes reordering or adding a step invasive.",
  solution:
    "Represent each step as an independent handler that either handles the request or delegates to the next handler in the chain. The sender doesn't know which handler will act; handlers don't know about each other beyond 'call next'. Adding, removing, or reordering steps is just editing the chain. Next.js middleware and Express-style middleware are this pattern exactly.",
  whenToUse: [
    "Request/response middleware pipelines (auth, logging, rate-limiting, headers)",
    "Sequential validation where each validator can pass or reject and stop the chain",
    "Event handling that should try handlers in order until one consumes the event",
    "Processing pipelines where steps should be independently composable and reorderable",
  ],
  avoidWhen: [
    "There's a fixed, small set of steps that never change — a straight-line function is clearer",
    "Every step always runs regardless — that's a simple pipeline/`reduce`, not a 'stop when handled' chain",
  ],
  realWorldExamples: [
    {
      name: "Next.js / Express middleware",
      detail:
        "Each middleware receives the request and either responds or calls `next()`. The pipeline is a chain of responsibility where any link can short-circuit (e.g. auth middleware redirecting before the handler runs).",
    },
    {
      name: "Redux middleware",
      detail:
        "An action flows through a chain of middleware (logger → thunk → api), each choosing to handle it, transform it, or pass it on with `next(action)`.",
    },
    {
      name: "Composable form validation",
      detail:
        "A field's value passes through required → format → async-uniqueness validators in order; the first failure stops the chain and reports the error.",
    },
    {
      name: "Apollo Link / axios interceptor chains",
      detail:
        "A request flows through a chain of links (auth → retry → error → http); each link handles or forwards it, so adding retry logic means inserting one link, not editing the transport.",
    },
  ],
  codeExamples: [
    {
      filename: "src/lib/pipeline/validationChain.ts",
      language: "ts",
      description:
        "A validation chain: each validator either passes the value along or stops the chain with an error. Reordering or adding rules is just editing the array.",
      code: `export type ValidationResult = { ok: true } | { ok: false; error: string };
export type Validator<T> = (value: T, next: () => ValidationResult) => ValidationResult;

// Each handler is independent and only knows about "next".
export const required: Validator<string> = (value, next) =>
  value.trim() === "" ? { ok: false, error: "This field is required" } : next();

export const email: Validator<string> = (value, next) =>
  !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(value)
    ? { ok: false, error: "Enter a valid email" }
    : next();

export const maxLength =
  (max: number): Validator<string> =>
  (value, next) =>
    value.length > max ? { ok: false, error: \`Must be \${max} characters or fewer\` } : next();

// Build the chain from independent links, in any order you like.
export function runChain<T>(value: T, validators: Validator<T>[]): ValidationResult {
  const run = (index: number): ValidationResult => {
    const validator = validators[index];
    if (!validator) return { ok: true }; // reached the end — all passed
    return validator(value, () => run(index + 1));
  };
  return run(0);
}

// Usage — add/remove/reorder validators freely:
// const result = runChain(email, [required, maxLength(120), email]);
// if (!result.ok) showError(result.error);`,
    },
    {
      filename: "src/lib/pipeline/middlewareChain.ts",
      language: "ts",
      description:
        "An Express-style middleware chain: each handler either responds (short-circuits) or calls next(). Auth, logging, and the final handler are independent, composable links.",
      code: `interface Ctx {
  userId: string | null;
  path: string;
  response?: string;
}

type Middleware = (ctx: Ctx, next: () => void) => void;

// Each link is independent and only knows about "next".
const requireAuth: Middleware = (ctx, next) => {
  if (!ctx.userId) {
    ctx.response = "401 Unauthorized"; // short-circuit: don't call next()
    return;
  }
  next();
};

const logRequest: Middleware = (ctx, next) => {
  console.log(\`\${ctx.userId ?? "anon"} -> \${ctx.path}\`);
  next();
};

const handler: Middleware = (ctx) => {
  ctx.response = \`200 OK: \${ctx.path}\`;
};

export function runChain(ctx: Ctx, chain: Middleware[]): Ctx {
  const run = (i: number) => {
    const mw = chain[i];
    if (mw) mw(ctx, () => run(i + 1));
  };
  run(0);
  return ctx;
}

// Reorder or insert links freely — the handler never changes:
// runChain(ctx, [logRequest, requireAuth, handler]);`,
    },
  ],
  pros: [
    "Steps are independent and composable — add, remove, or reorder without touching the others",
    "Each handler is small and single-purpose, easy to test in isolation",
    "The sender is fully decoupled from which handler ends up acting",
  ],
  cons: [
    "A request can fall off the end of the chain unhandled if you're not careful",
    "Debugging 'which link handled this?' can be harder than reading a linear function",
  ],
};
