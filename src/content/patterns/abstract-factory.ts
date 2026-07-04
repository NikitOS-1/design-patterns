import { Pattern } from "@/lib/types";

export const abstractFactory: Pattern = {
  slug: "abstract-factory",
  category: "creational",
  code: "C-04",
  name: "Abstract Factory",
  oneLiner: "Produce whole families of related objects that must stay consistent with each other.",
  problem:
    "Sometimes you don't need one component — you need a matched set. A theming system needs a Button, Input, and Card that all belong to the same theme; a multi-tenant app needs a whole family of branded components per tenant. If each component independently looks up 'which theme am I?', it's easy to end up with a light-theme button next to a dark-theme card, because nothing guarantees the family stays consistent.",
  solution:
    "Define one factory interface that produces a whole family of related pieces (`createButton()`, `createInput()`, `createCard()`), then implement one concrete factory per family (light theme, dark theme, tenant A, tenant B). Callers pick a factory once; everything they build from it is guaranteed to belong to the same family. Where Factory Method makes one product, Abstract Factory makes a coordinated set.",
  whenToUse: [
    "A theming/branding system where a set of components must all match one theme",
    "Multi-tenant white-label apps that swap an entire component family per tenant",
    "Platform-specific families (web vs. React Native) sharing one interface",
    "Design-system 'primitives' that come in coordinated variants (density: compact vs. comfortable)",
  ],
  avoidWhen: [
    "You only need one product type — that's Factory Method, not Abstract Factory",
    "The families never actually need to stay in sync — the extra abstraction buys nothing",
    "A Context-based theme provider + CSS variables already solves it more simply (often the case in React)",
  ],
  realWorldExamples: [
    {
      name: "Component libraries with themeable primitive sets",
      detail:
        "Design systems expose a coordinated family (Button/Input/Card) whose styling is resolved together from one theme object, so a component set never mixes tokens from two themes.",
    },
    {
      name: "react-native-web / platform abstractions",
      detail:
        "A shared interface backed by one 'factory' per platform lets the same feature code build web or native versions of a family of primitives.",
    },
    {
      name: "Multi-tenant white-label dashboards",
      detail:
        "Each tenant gets a concrete factory producing its own branded Button, Header, and EmptyState, selected once at the app root so the whole UI stays on-brand.",
    },
  ],
  codeExamples: [
    {
      filename: "src/design-system/themeFactory.ts",
      language: "ts",
      description:
        "One factory interface, one implementation per theme. Pick a factory once and every primitive you build from it is guaranteed to match.",
      code: `import type { ComponentType } from "react";

export interface UIComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// The abstract factory: a whole coordinated family of primitives.
export interface ThemeFactory {
  createButton(): ComponentType<UIComponentProps & { onClick?: () => void }>;
  createCard(): ComponentType<UIComponentProps>;
  createInput(): ComponentType<UIComponentProps & { value: string; onChange: (v: string) => void }>;
}

// One concrete factory per theme — every product here shares the same tokens.
export const lightThemeFactory: ThemeFactory = {
  createButton: () => (props) => (
    <button className={\`bg-white text-ink-900 border border-ink-200 \${props.className ?? ""}\`} onClick={props.onClick}>
      {props.children}
    </button>
  ),
  createCard: () => (props) => (
    <div className={\`bg-white text-ink-900 shadow-sm \${props.className ?? ""}\`}>{props.children}</div>
  ),
  createInput: () => (props) => (
    <input className="bg-white text-ink-900" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
  ),
};

export const darkThemeFactory: ThemeFactory = {
  createButton: () => (props) => (
    <button className={\`bg-ink-800 text-ink-50 border border-ink-600 \${props.className ?? ""}\`} onClick={props.onClick}>
      {props.children}
    </button>
  ),
  createCard: () => (props) => (
    <div className={\`bg-ink-800 text-ink-50 \${props.className ?? ""}\`}>{props.children}</div>
  ),
  createInput: () => (props) => (
    <input className="bg-ink-800 text-ink-50" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
  ),
};

// Choose the family once:
// const factory = theme === "dark" ? darkThemeFactory : lightThemeFactory;
// const Button = factory.createButton();
// const Card = factory.createCard(); // guaranteed to match Button`,
    },
  ],
  pros: [
    "Guarantees a family of components/objects stays internally consistent",
    "Swapping the whole family (theme, tenant, platform) is a one-line change at the root",
    "Isolates each family's construction details behind a shared interface",
  ],
  cons: [
    "Heavier than needed when a Context + CSS variables would theme things just as well",
    "Adding a new product to the family means updating every concrete factory",
  ],
};
