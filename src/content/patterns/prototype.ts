import { Pattern } from "@/lib/types";

export const prototype: Pattern = {
  slug: "prototype",
  category: "creational",
  code: "C-05",
  name: "Prototype",
  oneLiner: "Create a new object by cloning an existing one, instead of rebuilding it from scratch.",
  problem:
    "Features like 'Duplicate this candidate', 'Copy this dashboard widget', or 'Start from template' need a new object that's mostly identical to an existing one. Reconstructing it field-by-field is error-prone: you forget a nested field, or you accidentally share a reference so editing the copy mutates the original.",
  solution:
    "Give the object a `clone()` operation (or use a well-defined deep-copy) that produces an independent duplicate, then tweak only what differs. In frontend code this is the everyday work of immutable state updates — `structuredClone`, spread copies, and template-based creation are all Prototype in practice.",
  whenToUse: [
    "'Duplicate' / 'Copy' / 'Save as template' actions in editors and builders",
    "Seeding a new form from an existing record ('create similar')",
    "Producing independent copies of config objects so edits don't leak between instances",
    "Immutable state updates where you clone-then-modify rather than mutate in place",
  ],
  avoidWhen: [
    "The object is cheap and simple to construct fresh — a plain factory is clearer",
    "A shallow copy would silently share nested references — reach for a real deep clone or you'll create aliasing bugs",
  ],
  realWorldExamples: [
    {
      name: "'Duplicate' in page/form builders (Notion, Figma, form tools)",
      detail:
        "Duplicating a block or frame clones the full node subtree — including nested children and styles — then assigns fresh IDs, rather than reconstructing the element type by type.",
    },
    {
      name: "Immer / immutable Redux updates",
      detail:
        "Producing the next state by cloning the previous state and modifying the copy is Prototype applied to app state — the original stays untouched so time-travel and memoization work.",
    },
    {
      name: "`structuredClone` for deep config copies",
      detail:
        "The built-in `structuredClone()` gives an independent deep copy of a settings object so an editable draft never mutates the saved original.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/dashboard/cloneWidget.ts",
      language: "ts",
      description:
        "A 'duplicate widget' action: deep-clone the source so the copy is fully independent, then assign a fresh id and offset its position.",
      code: `export interface Widget {
  id: string;
  type: "chart" | "table" | "metric";
  title: string;
  position: { x: number; y: number };
  config: Record<string, unknown>; // nested — must not be shared with the copy
}

export function cloneWidget(source: Widget): Widget {
  // structuredClone gives a fully independent deep copy: editing the
  // clone's config never mutates the original's config.
  const copy = structuredClone(source);

  return {
    ...copy,
    id: crypto.randomUUID(),
    title: \`\${source.title} (copy)\`,
    position: { x: source.position.x + 24, y: source.position.y + 24 },
  };
}

// Usage in a "Duplicate" handler:
// const duplicated = cloneWidget(widget);
// setWidgets((prev) => [...prev, duplicated]);`,
    },
  ],
  pros: [
    "Copying is reliable even for deeply nested objects — no field-by-field reconstruction",
    "Avoids aliasing bugs where the copy secretly shares references with the original",
    "Matches how immutable state updates already work in React/Redux",
  ],
  cons: [
    "Deep cloning can be expensive for very large objects",
    "`structuredClone` can't copy functions or class instances with methods — know your data's shape",
  ],
};
