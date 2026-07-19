import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * slug → "how it works" diagram component.
 *
 * Each entry is code-split via next/dynamic, so a pattern page only ships
 * the one diagram it renders. Patterns absent from this map simply don't
 * show a "How it works" section (see PatternDetail + hasAnimation).
 *
 * GoF, structural and React entries are animated; architecture entries are
 * calm static schematics. To add one: create patterns/<slug>.tsx and add a
 * line here.
 */
export const animationRegistry: Record<string, ComponentType> = {
  // Creational
  singleton: dynamic(() => import("./patterns/singleton").then((m) => m.SingletonAnim)),
  "factory-method": dynamic(() =>
    import("./patterns/factory-method").then((m) => m.FactoryMethodAnim),
  ),
  "abstract-factory": dynamic(() =>
    import("./patterns/abstract-factory").then((m) => m.AbstractFactoryAnim),
  ),
  builder: dynamic(() => import("./patterns/builder").then((m) => m.BuilderAnim)),
  prototype: dynamic(() => import("./patterns/prototype").then((m) => m.PrototypeAnim)),

  // Structural
  adapter: dynamic(() => import("./patterns/adapter").then((m) => m.AdapterAnim)),
  decorator: dynamic(() => import("./patterns/decorator").then((m) => m.DecoratorAnim)),
  facade: dynamic(() => import("./patterns/facade").then((m) => m.FacadeAnim)),
  proxy: dynamic(() => import("./patterns/proxy").then((m) => m.ProxyAnim)),
  composite: dynamic(() => import("./patterns/composite").then((m) => m.CompositeAnim)),
  bridge: dynamic(() => import("./patterns/bridge").then((m) => m.BridgeAnim)),
  flyweight: dynamic(() => import("./patterns/flyweight").then((m) => m.FlyweightAnim)),
  "repository-pattern": dynamic(() =>
    import("./patterns/repository-pattern").then((m) => m.RepositoryPatternAnim),
  ),
  "service-layer": dynamic(() =>
    import("./patterns/service-layer").then((m) => m.ServiceLayerAnim),
  ),
  "dependency-injection": dynamic(() =>
    import("./patterns/dependency-injection").then((m) => m.DependencyInjectionAnim),
  ),

  // Behavioral
  observer: dynamic(() => import("./patterns/observer").then((m) => m.ObserverAnim)),
  strategy: dynamic(() => import("./patterns/strategy").then((m) => m.StrategyAnim)),
  command: dynamic(() => import("./patterns/command").then((m) => m.CommandAnim)),
  state: dynamic(() => import("./patterns/state").then((m) => m.StateAnim)),
  "chain-of-responsibility": dynamic(() =>
    import("./patterns/chain-of-responsibility").then((m) => m.ChainOfResponsibilityAnim),
  ),
  mediator: dynamic(() => import("./patterns/mediator").then((m) => m.MediatorAnim)),
  memento: dynamic(() => import("./patterns/memento").then((m) => m.MementoAnim)),
  iterator: dynamic(() => import("./patterns/iterator").then((m) => m.IteratorAnim)),
  "template-method": dynamic(() =>
    import("./patterns/template-method").then((m) => m.TemplateMethodAnim),
  ),
  visitor: dynamic(() => import("./patterns/visitor").then((m) => m.VisitorAnim)),

  // React
  "custom-hooks": dynamic(() => import("./patterns/custom-hooks").then((m) => m.CustomHooksAnim)),
  "compound-components": dynamic(() =>
    import("./patterns/compound-components").then((m) => m.CompoundComponentsAnim),
  ),
  "provider-pattern": dynamic(() =>
    import("./patterns/provider-pattern").then((m) => m.ProviderPatternAnim),
  ),
  "render-props": dynamic(() => import("./patterns/render-props").then((m) => m.RenderPropsAnim)),
  "higher-order-components": dynamic(() =>
    import("./patterns/higher-order-components").then((m) => m.HigherOrderComponentsAnim),
  ),
  "container-presentational": dynamic(() =>
    import("./patterns/container-presentational").then((m) => m.ContainerPresentationalAnim),
  ),
  "error-boundary": dynamic(() =>
    import("./patterns/error-boundary").then((m) => m.ErrorBoundaryAnim),
  ),
  "server-client-components": dynamic(() =>
    import("./patterns/server-client-components").then((m) => m.ServerClientComponentsAnim),
  ),
  "controlled-components": dynamic(() =>
    import("./patterns/controlled-components").then((m) => m.ControlledComponentsAnim),
  ),

  // Architecture (static schematics)
  "frontend-architecture-react-nextjs": dynamic(() =>
    import("./patterns/frontend-architecture-react-nextjs").then(
      (m) => m.FrontendArchitectureReactNextjsAnim,
    ),
  ),
  "feature-sliced-design": dynamic(() =>
    import("./patterns/feature-sliced-design").then((m) => m.FeatureSlicedDesignAnim),
  ),
  "feature-based-architecture": dynamic(() =>
    import("./patterns/feature-based-architecture").then((m) => m.FeatureBasedArchitectureAnim),
  ),
  "clean-architecture-frontend": dynamic(() =>
    import("./patterns/clean-architecture-frontend").then((m) => m.CleanArchitectureFrontendAnim),
  ),
  "atomic-design": dynamic(() => import("./patterns/atomic-design").then((m) => m.AtomicDesignAnim)),
  "modular-monolith-frontend": dynamic(() =>
    import("./patterns/modular-monolith-frontend").then((m) => m.ModularMonolithFrontendAnim),
  ),
  "micro-frontends": dynamic(() =>
    import("./patterns/micro-frontends").then((m) => m.MicroFrontendsAnim),
  ),
  "backend-architecture-nodejs": dynamic(() =>
    import("./patterns/backend-architecture-nodejs").then((m) => m.BackendArchitectureNodejsAnim),
  ),
  "layered-architecture": dynamic(() =>
    import("./patterns/layered-architecture").then((m) => m.LayeredArchitectureAnim),
  ),
  "clean-architecture-backend": dynamic(() =>
    import("./patterns/clean-architecture-backend").then((m) => m.CleanArchitectureBackendAnim),
  ),
  "hexagonal-architecture": dynamic(() =>
    import("./patterns/hexagonal-architecture").then((m) => m.HexagonalArchitectureAnim),
  ),
  cqrs: dynamic(() => import("./patterns/cqrs").then((m) => m.CqrsAnim)),
  "event-driven-architecture": dynamic(() =>
    import("./patterns/event-driven-architecture").then((m) => m.EventDrivenArchitectureAnim),
  ),
  "microservices-architecture": dynamic(() =>
    import("./patterns/microservices-architecture").then((m) => m.MicroservicesArchitectureAnim),
  ),
  "bff-api-gateway": dynamic(() =>
    import("./patterns/bff-api-gateway").then((m) => m.BffApiGatewayAnim),
  ),
  "saga-pattern": dynamic(() => import("./patterns/saga-pattern").then((m) => m.SagaPatternAnim)),
  "domain-driven-design": dynamic(() =>
    import("./patterns/domain-driven-design").then((m) => m.DomainDrivenDesignAnim),
  ),
  "react-architecture-playbook": dynamic(() =>
    import("./patterns/react-architecture-playbook").then((m) => m.ReactArchitecturePlaybookAnim),
  ),
  "nestjs-backend-architecture-playbook": dynamic(() =>
    import("./patterns/nestjs-backend-architecture-playbook").then(
      (m) => m.NestjsBackendArchitecturePlaybookAnim,
    ),
  ),
};

export function hasAnimation(slug: string): boolean {
  return slug in animationRegistry;
}
