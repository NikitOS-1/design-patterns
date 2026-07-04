import { Pattern } from "@/lib/types";

// Creational
import { singleton } from "./singleton";
import { factoryMethod } from "./factory-method";
import { abstractFactory } from "./abstract-factory";
import { builder } from "./builder";
import { prototype } from "./prototype";

// Structural
import { adapter } from "./adapter";
import { decorator } from "./decorator";
import { facade } from "./facade";
import { proxy } from "./proxy";
import { composite } from "./composite";
import { bridge } from "./bridge";
import { flyweight } from "./flyweight";

// Behavioral
import { observer } from "./observer";
import { strategy } from "./strategy";
import { command } from "./command";
import { state } from "./state";
import { chainOfResponsibility } from "./chain-of-responsibility";
import { mediator } from "./mediator";
import { memento } from "./memento";
import { iterator } from "./iterator";
import { templateMethod } from "./template-method";
import { visitor } from "./visitor";

// React patterns (not GoF, but the real vocabulary of production React)
import { customHooks } from "./custom-hooks";
import { compoundComponents } from "./compound-components";
import { providerPattern } from "./provider-pattern";
import { renderProps } from "./render-props";
import { containerPresentational } from "./container-presentational";
import { errorBoundary } from "./error-boundary";
import { serverClientComponents } from "./server-client-components";
import { controlledComponents } from "./controlled-components";

// To add a new pattern:
//   1. Create src/content/patterns/your-pattern.ts modeled on any file here.
//   2. Import it above and add it to this array in the right category block.
// Everything else — sidebar, homepage grid, category grouping, detail
// pages, and prev/next links — is derived from this single list.
export const patterns: Pattern[] = [
  // Creational
  singleton,
  factoryMethod,
  abstractFactory,
  builder,
  prototype,
  // Structural
  adapter,
  decorator,
  facade,
  proxy,
  composite,
  bridge,
  flyweight,
  // Behavioral
  observer,
  strategy,
  command,
  state,
  chainOfResponsibility,
  mediator,
  memento,
  iterator,
  templateMethod,
  visitor,
  // React
  customHooks,
  compoundComponents,
  providerPattern,
  renderProps,
  containerPresentational,
  errorBoundary,
  serverClientComponents,
  controlledComponents,
];

export function getPatternBySlug(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}

export function getPatternsByCategory(category: Pattern["category"]): Pattern[] {
  return patterns.filter((p) => p.category === category);
}
