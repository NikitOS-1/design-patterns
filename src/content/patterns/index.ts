import { Pattern } from "@/lib/types";

import { singleton } from "./singleton";
import { factoryMethod } from "./factory-method";
import { abstractFactory } from "./abstract-factory";
import { builder } from "./builder";
import { prototype } from "./prototype";

import { adapter } from "./adapter";
import { decorator } from "./decorator";
import { facade } from "./facade";
import { proxy } from "./proxy";
import { composite } from "./composite";
import { bridge } from "./bridge";
import { flyweight } from "./flyweight";
import { repositoryPattern } from "./repository-pattern";
import { serviceLayer } from "./service-layer";
import { dependencyInjection } from "./dependency-injection";

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

import { customHooks } from "./custom-hooks";
import { compoundComponents } from "./compound-components";
import { providerPattern } from "./provider-pattern";
import { renderProps } from "./render-props";
import { containerPresentational } from "./container-presentational";
import { errorBoundary } from "./error-boundary";
import { serverClientComponents } from "./server-client-components";
import { controlledComponents } from "./controlled-components";
import { higherOrderComponents } from "./higher-order-components";

import { frontendArchitectureReactNextjs } from "./frontend-architecture-react-nextjs";
import { backendArchitectureNodejs } from "./backend-architecture-nodejs";
import { reactArchitecturePlaybook } from "./react-architecture-playbook";
import { nestjsBackendArchitecturePlaybook } from "./nestjs-backend-architecture-playbook";
import { featureSlicedDesign } from "./feature-sliced-design";
import { featureBasedArchitecture } from "./feature-based-architecture";
import { cleanArchitectureFrontend } from "./clean-architecture-frontend";
import { atomicDesign } from "./atomic-design";
import { modularMonolithFrontend } from "./modular-monolith-frontend";
import { microFrontends } from "./micro-frontends";
import { layeredArchitecture } from "./layered-architecture";
import { cleanArchitectureBackend } from "./clean-architecture-backend";
import { hexagonalArchitecture } from "./hexagonal-architecture";
import { cqrs } from "./cqrs";
import { eventDrivenArchitecture } from "./event-driven-architecture";
import { microservicesArchitecture } from "./microservices-architecture";
import { bffApiGateway } from "./bff-api-gateway";
import { sagaPattern } from "./saga-pattern";
import { domainDrivenDesign } from "./domain-driven-design";

export const patterns: Pattern[] = [
  singleton,
  factoryMethod,
  abstractFactory,
  builder,
  prototype,
  adapter,
  decorator,
  facade,
  proxy,
  composite,
  bridge,
  flyweight,
  repositoryPattern,
  serviceLayer,
  dependencyInjection,
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
  customHooks,
  compoundComponents,
  providerPattern,
  renderProps,
  higherOrderComponents,
  containerPresentational,
  errorBoundary,
  serverClientComponents,
  controlledComponents,
  frontendArchitectureReactNextjs,
  featureSlicedDesign,
  featureBasedArchitecture,
  cleanArchitectureFrontend,
  atomicDesign,
  modularMonolithFrontend,
  microFrontends,
  backendArchitectureNodejs,
  layeredArchitecture,
  cleanArchitectureBackend,
  hexagonalArchitecture,
  cqrs,
  eventDrivenArchitecture,
  microservicesArchitecture,
  bffApiGateway,
  sagaPattern,
  domainDrivenDesign,
  reactArchitecturePlaybook,
  nestjsBackendArchitecturePlaybook,
];

export function getPatternBySlug(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}

export function getPatternsByCategory(category: Pattern["category"]): Pattern[] {
  return patterns.filter((p) => p.category === category);
}
