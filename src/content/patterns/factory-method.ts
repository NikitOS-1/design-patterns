import { Pattern } from "@/lib/types";

export const factoryMethod: Pattern = {
  slug: "factory-method",
  category: "creational",
  code: "C-02",
  name: "Factory Method",
  oneLiner: "Centralize 'which component/object do I create for this case?' behind one function.",
  problem:
    "Dynamic forms, dashboards, and content renderers all face the same shape of problem: you receive data describing a *kind* of thing (a field type, a widget type, a block type from a CMS), and you need to render the right component for it. Without a factory, this decision — a growing if/else or switch — gets copy-pasted into every place that needs to render that data, so adding a new field type means hunting down every call site.",
  solution:
    "Write one function (or a lookup map) whose only job is: given a descriptor, return the right component or instance. Every consumer calls that one function instead of re-implementing the branching logic. Adding a new case means changing exactly one file — the factory — not every place that renders the data.",
  whenToUse: [
    "Rendering a schema-driven form where each field has a `type` (text, select, date, checkbox…)",
    "A CMS/page-builder where content blocks are described by a `type` field and rendered generically",
    "Choosing between multiple SDK clients (Stripe vs PayPal, S3 vs local disk) behind one interface",
    "Icon or avatar components chosen dynamically from a string key",
  ],
  avoidWhen: [
    "You only have 2-3 fixed variants and they never grow — plain conditional rendering is clearer",
    "The 'variants' actually differ by props/styling only, not by which component logic runs — a single flexible component is simpler than a factory",
  ],
  realWorldExamples: [
    {
      name: "React Hook Form + JSON Schema form builders",
      detail:
        "Libraries like react-jsonschema-form resolve a field's `type` to a widget component through a registry/factory instead of hardcoding a switch in the form renderer.",
    },
    {
      name: "CMS block renderers (Sanity, Contentful, Storyblok)",
      detail:
        "Each content block from the CMS carries a `_type`; a single `BlockFactory` maps that string to the React component that renders it, so authors can add block types without touching every page template.",
    },
    {
      name: "Payment provider abstraction",
      detail:
        "`createPaymentProvider('stripe' | 'paypal')` returns an object implementing the same `charge()`/`refund()` interface, so checkout code never branches on provider.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/dynamic-form/fieldFactory.tsx",
      language: "tsx",
      description:
        "A schema-driven form field factory: one function decides which input component to render for a given field definition. Adding a new field type only means adding one entry to the map.",
      code: `import { TextField } from "./fields/TextField";
import { SelectField } from "./fields/SelectField";
import { CheckboxField } from "./fields/CheckboxField";
import { DateField } from "./fields/DateField";

export type FieldSchema =
  | { type: "text"; name: string; label: string; placeholder?: string }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[] }
  | { type: "checkbox"; name: string; label: string }
  | { type: "date"; name: string; label: string };

export interface FieldProps<T extends FieldSchema = FieldSchema> {
  schema: T;
}

// The factory: the ONE place that maps a schema "type" to a component.
const FIELD_REGISTRY: {
  [K in FieldSchema["type"]]: React.ComponentType<{ schema: Extract<FieldSchema, { type: K }> }>;
} = {
  text: TextField,
  select: SelectField,
  checkbox: CheckboxField,
  date: DateField,
};

export function createField(schema: FieldSchema) {
  const Component = FIELD_REGISTRY[schema.type] as React.ComponentType<{ schema: FieldSchema }>;

  if (!Component) {
    throw new Error(\`No field renderer registered for type "\${schema.type}"\`);
  }

  return <Component key={schema.name} schema={schema} />;
}

// Usage anywhere a form is built from a schema — the caller never
// branches on field.type itself:
export function DynamicForm({ fields }: { fields: FieldSchema[] }) {
  return <form className="space-y-4">{fields.map(createField)}</form>;
}`,
    },
    {
      filename: "src/lib/payments/createPaymentProvider.ts",
      language: "ts",
      description:
        "Factory function returning a provider that implements one shared interface, so checkout logic never has to know whether it's talking to Stripe or PayPal.",
      code: `export interface PaymentProvider {
  charge(amountCents: number, currency: string): Promise<{ id: string; status: string }>;
  refund(chargeId: string): Promise<{ id: string; status: string }>;
}

class StripeProvider implements PaymentProvider {
  async charge(amountCents: number, currency: string) {
    // Stripe-specific SDK calls live only here.
    return { id: "ch_stripe_123", status: "succeeded" };
  }
  async refund(chargeId: string) {
    return { id: chargeId, status: "refunded" };
  }
}

class PaypalProvider implements PaymentProvider {
  async charge(amountCents: number, currency: string) {
    // PayPal-specific SDK calls live only here.
    return { id: "ch_paypal_456", status: "succeeded" };
  }
  async refund(chargeId: string) {
    return { id: chargeId, status: "refunded" };
  }
}

export function createPaymentProvider(kind: "stripe" | "paypal"): PaymentProvider {
  switch (kind) {
    case "stripe":
      return new StripeProvider();
    case "paypal":
      return new PaypalProvider();
  }
}

// Checkout code depends only on the interface:
// const provider = createPaymentProvider(org.paymentMethod);
// await provider.charge(amountCents, "usd");`,
    },
  ],
  pros: [
    "New variants are added in one file instead of hunting down every conditional",
    "Call sites stay simple — they call one function instead of re-implementing branching",
    "Plays nicely with TypeScript discriminated unions for exhaustiveness checking",
  ],
  cons: [
    "Adds a layer of indirection that's overkill for 2-3 stable variants",
    "A registry/map can become a dumping ground if it isn't kept close to the types it serves",
  ],
};
