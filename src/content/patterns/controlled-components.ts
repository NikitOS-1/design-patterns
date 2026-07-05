import { Pattern } from "@/lib/types";

export const controlledComponents: Pattern = {
  slug: "controlled-components",
  category: "react",
  code: "R-08",
  name: "Controlled Components",
  oneLiner: "Make React state the single source of truth for an input, instead of reading from the DOM.",
  problem:
    "An input can store its own value in the DOM (uncontrolled) or be driven by React state (controlled). If you mix the two, or read values off the DOM ad hoc, you get bugs: the displayed value and your state disagree, validation runs against stale data, and you can't easily transform input, disable a submit button, or sync fields.",
  solution:
    "Drive the input from state: pass `value` from state and update state in `onChange`. React state is now the single source of truth — what the user sees always equals what your code has. This makes derived UI (character counts, live validation, formatting, dependent fields) trivial. The counterpart, uncontrolled inputs with refs, is the right choice for simple or performance-sensitive forms where you only read values on submit.",
  whenToUse: [
    "Inputs needing live validation, formatting, or a character counter as the user types",
    "Fields that depend on or transform each other (uppercase, masks, dependent selects)",
    "Enabling/disabling actions based on current input values",
    "When state must always match what's on screen (the default for most forms)",
  ],
  avoidWhen: [
    "A large or performance-sensitive form where re-rendering on every keystroke hurts — use uncontrolled inputs + refs (this is why React Hook Form defaults to uncontrolled)",
    "You only need the value once, on submit — an uncontrolled input is simpler",
    "Integrating some non-React widgets that manage their own DOM value",
  ],
  realWorldExamples: [
    {
      name: "Controlled inputs for live UX",
      detail:
        "Search-as-you-type, password strength meters, and inline validation all rely on controlled inputs so the logic reacts to each keystroke from a single state source.",
    },
    {
      name: "React Hook Form's uncontrolled default",
      detail:
        "RHF deliberately uses uncontrolled inputs + refs for performance, opting into controlled mode via `<Controller>` only for components that need it — a real-world illustration of the trade-off.",
    },
    {
      name: "Formik controlled fields",
      detail:
        "Formik drives fields from form state so cross-field validation and derived UI update consistently as values change.",
    },
    {
      name: "Radix/Headless controlled + uncontrolled props",
      detail:
        "Primitives like Radix Select accept both `value`/`onValueChange` (controlled) and `defaultValue` (uncontrolled), letting you opt into React-state control exactly when you need to react to changes.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/profile/DisplayNameField.tsx",
      language: "tsx",
      description:
        "A controlled input: state is the source of truth, which makes the live character count and validation trivial and always in sync.",
      code: `"use client";

import { useState } from "react";

const MAX = 40;

export function DisplayNameField() {
  const [name, setName] = useState("");

  // Because state is the single source of truth, derived UI is easy
  // and can never disagree with what's on screen.
  const remaining = MAX - name.length;
  const isTooLong = remaining < 0;

  return (
    <div>
      <input
        value={name}                                   // driven by state
        onChange={(e) => setName(e.target.value)}      // state updates on input
        aria-invalid={isTooLong}
        className="w-full bg-ink-800 px-3 py-2"
      />
      <div className={\`mt-1 text-xs \${isTooLong ? "text-red-400" : "text-ink-400"}\`}>
        {remaining} characters left
      </div>
    </div>
  );
}`,
    },
    {
      filename: "src/features/newsletter/EmailForm.tsx",
      language: "tsx",
      description:
        "The uncontrolled counterpart: no per-keystroke state, the value is read from a ref only on submit. Cheaper when you don't need live reactivity.",
      code: `"use client";

import { useRef } from "react";

export function EmailForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const email = inputRef.current?.value ?? ""; // read from the DOM, once
    onSubmit(email);
  }

  return (
    <div className="flex gap-2">
      <input ref={inputRef} type="email" defaultValue="" className="flex-1 bg-ink-800 px-3 py-2" />
      <button onClick={handleSubmit}>Subscribe</button>
    </div>
  );
}`,
    },
  ],
  pros: [
    "State always matches the UI — no drift between DOM and React",
    "Live validation, formatting, counters, and dependent fields become trivial",
    "One obvious source of truth makes the data flow easy to reason about",
  ],
  cons: [
    "Re-renders on every keystroke can be costly in large forms",
    "More wiring than an uncontrolled input for cases that only need the value on submit",
  ],
};
