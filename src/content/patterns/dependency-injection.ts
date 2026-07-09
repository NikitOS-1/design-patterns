import { Pattern } from "@/lib/types";

export const dependencyInjection: Pattern = {
  slug: "dependency-injection",
  category: "structural",
  code: "S-10",
  name: "Dependency Injection",
  oneLiner:
    "Provide dependencies from the outside instead of creating them inside modules, so behavior stays testable and replaceable.",
  problem:
    "When modules instantiate repositories, gateways, or SDK clients internally, concrete dependencies become hardcoded and impossible to swap in tests or different environments. Business logic becomes tightly coupled to specific infrastructure classes, and cross-cutting concerns such as logging, caching, and retries are scattered.",
  solution:
    "Inject dependencies through constructors or factory parameters and define contracts for what a module needs. Composition roots wire concrete implementations once, while application code works with interfaces. This enables test doubles, environment-specific adapters, and cleaner separation between business logic and infrastructure.",
  whenToUse: [
    "Application services depending on repositories, payment clients, or messaging gateways",
    "Modules requiring testability with fakes, stubs, or contract test adapters",
    "Systems with environment-specific infrastructure wiring for local, staging, and production",
    "Large codebases where ownership and boundaries require explicit dependency graphs",
  ],
  avoidWhen: [
    "Small scripts where direct object creation is simpler and fully sufficient",
    "Cases where DI containers hide too much and make runtime wiring opaque",
    "Teams that inject everything by default without meaningful boundaries",
  ],
  realWorldExamples: [
    {
      name: "NestJS providers",
      detail:
        "Classes declare constructor dependencies while modules register concrete providers, which is DI as a first-class framework primitive.",
    },
    {
      name: "React context as DI for frontend services",
      detail:
        "Apps inject API clients, analytics adapters, or feature flags through providers so components stay infrastructure-agnostic.",
    },
    {
      name: "Testing with fakes",
      detail:
        "Use cases receive fake repositories and gateways to validate business flows without network and database setup.",
    },
    {
      name: "BFF composition roots",
      detail:
        "Gateway and service implementations are wired at startup, while route handlers depend on abstract application services.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/subscriptions/application/subscriptionService.ts",
      language: "ts",
      description:
        "Constructor injection keeps use-case logic independent from concrete billing and persistence implementations.",
      code: `interface SubscriptionRepository {
  create(input: { subscriptionId: string; userId: string; planCode: string }): Promise<void>;
}

interface BillingGateway {
  createCustomerSubscription(input: {
    userId: string;
    planCode: string;
  }): Promise<{ providerSubscriptionId: string }>;
}

interface SubscriptionIdFactory {
  create(): string;
}

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly billingGateway: BillingGateway,
    private readonly subscriptionIdFactory: SubscriptionIdFactory
  ) {}

  async subscribe(input: { userId: string; planCode: string }) {
    await this.billingGateway.createCustomerSubscription({
      userId: input.userId,
      planCode: input.planCode,
    });

    const subscriptionId = this.subscriptionIdFactory.create();

    await this.subscriptionRepository.create({
      subscriptionId,
      userId: input.userId,
      planCode: input.planCode,
    });

    return { subscriptionId };
  }
}`,
    },
    {
      filename: "src/app/bootstrap/createSubscriptionModule.ts",
      language: "ts",
      description:
        "A composition root that wires concrete adapters once and returns the ready-to-use service.",
      code: `import { SubscriptionService } from "@/modules/subscriptions/application/subscriptionService";
import { createStripeBillingGateway } from "@/modules/subscriptions/infrastructure/billing/stripeBillingGateway";
import { createPostgresSubscriptionRepository } from "@/modules/subscriptions/infrastructure/persistence/postgresSubscriptionRepository";
import { createUuidFactory } from "@/shared/infrastructure/uuid/uuidFactory";

export function createSubscriptionModule() {
  const subscriptionRepository = createPostgresSubscriptionRepository();
  const billingGateway = createStripeBillingGateway();
  const subscriptionIdFactory = createUuidFactory();

  return new SubscriptionService(
    subscriptionRepository,
    billingGateway,
    subscriptionIdFactory
  );
}`,
    },
  ],
  pros: [
    "Improves testability by replacing real dependencies with controlled test doubles",
    "Keeps business logic independent from infrastructure and vendor-specific SDKs",
    "Enables flexible wiring for environments and gradual adapter migrations",
  ],
  cons: [
    "Adds configuration and wiring complexity compared with direct instantiation",
    "Poorly managed DI can make dependency graphs hard to trace",
    "Excessive abstraction can slow feature development in small projects",
  ],
};
