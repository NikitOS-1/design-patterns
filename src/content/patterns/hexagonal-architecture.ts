import { Pattern } from "@/lib/types";

export const hexagonalArchitecture: Pattern = {
  slug: "hexagonal-architecture",
  category: "architecture-backend",
  code: "A-14",
  name: "Hexagonal Architecture",
  oneLiner:
    "Isolate application logic inside a hexagon; connect it to the outside world only through named ports implemented by swappable adapters.",
  problem:
    "Backend applications accumulate an invisible coupling tax over time. REST controllers directly call services that reference Prisma models; those services also import Kafka producers, Redis clients, and third-party SDKs. The application logic — what the system actually does — becomes inseparable from how it is delivered over HTTP, how data is stored, and which external APIs it integrates with. Writing a test for a core business flow requires mocking a chain of infrastructure dependencies that have nothing to do with the logic under test. Every new delivery channel — adding a CLI, a gRPC endpoint, a background job runner, or a GraphQL resolver — forces changes inside the core application code, violating the open/closed principle.",
  solution:
    "Model the application as a hexagon. Inside the hexagon lives all application and domain logic: use cases, domain entities, and business rules. The hexagon declares ports — TypeScript interfaces that express what the application needs from the outside world and what it offers to the outside world. Driving ports describe capabilities the application exposes to initiators such as REST controllers, CLI commands, or message consumers. Driven ports describe capabilities the application needs from infrastructure: persistence, email, payment processing, or event publishing. Outside the hexagon, adapters provide concrete implementations of every port. Primary adapters translate external triggers into calls through driving ports. Secondary adapters satisfy driven ports by delegating to databases, message brokers, or HTTP APIs. This geometry keeps the hexagon free of framework imports and makes it possible to swap any adapter without touching application logic.",
  whenToUse: [
    "Applications that need to be driven by multiple delivery mechanisms simultaneously — REST, gRPC, CLI, and async message consumers — without duplicating business logic",
    "Systems where replacing the database or a third-party integration must not require changes to use-case code",
    "Backends requiring high-coverage use-case unit tests that run without infrastructure setup",
    "Teams that want explicit architectural vocabulary distinguishing what the system does from how it connects to the world",
  ],
  avoidWhen: [
    "Simple APIs with a single delivery channel and no complex domain logic, where the port/adapter indirection adds no value",
    "Prototypes or throwaway services where the primary goal is delivery speed rather than architectural sustainability",
    "Teams unfamiliar with the pattern who may implement it incorrectly and end up with leaky ports that expose infrastructure types",
  ],
  realWorldExamples: [
    {
      name: "NestJS with driving REST adapters and driven repository adapters",
      detail:
        "NestJS controllers act as primary adapters that translate HTTP requests into use-case calls through driving ports; TypeORM or Prisma implementations are secondary adapters satisfying repository ports declared by the application hexagon.",
    },
    {
      name: "Multi-protocol backend: REST and Kafka",
      detail:
        "A REST controller and a Kafka consumer both call the same use case through the same driving port; the business logic executes identically regardless of whether a request arrives over HTTP or as an async event.",
    },
    {
      name: "Payment service with swappable providers",
      detail:
        "The application declares a PaymentPort interface; a StripeAdapter satisfies it in production while a FakePaymentAdapter satisfies it in tests, enabling full use-case coverage without real API calls.",
    },
    {
      name: "CLI tooling sharing business logic with the web API",
      detail:
        "An admin CLI adapter calls the same use-case layer as the web API adapter; the hexagon does not know it is being driven from a terminal versus a browser request.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/subscriptions/application/ports.ts",
      language: "ts",
      description:
        "Ports declared inside the hexagon: the driving port defines what callers can invoke; the driven ports define what the application needs from infrastructure.",
      code: `export interface SubscriptionPlan {
  planId: string;
  name: string;
  monthlyPrice: number;
}

export interface Subscription {
  subscriptionId: string;
  userId: string;
  planId: string;
  status: "active" | "cancelled" | "past_due";
  startedAt: Date;
}

export interface SubscribeInput {
  userId: string;
  planId: string;
}

export interface SubscribeOutput {
  subscriptionId: string;
}

export interface SubscriptionDrivingPort {
  subscribe(input: SubscribeInput): Promise<SubscribeOutput>;
  cancel(input: { subscriptionId: string }): Promise<void>;
}

export interface SubscriptionRepository {
  save(subscription: Subscription): Promise<void>;
  findById(subscriptionId: string): Promise<Subscription | null>;
  findActiveByUserId(userId: string): Promise<Subscription | null>;
}

export interface PlanRepository {
  findById(planId: string): Promise<SubscriptionPlan | null>;
}

export interface BillingPort {
  createSubscription(input: {
    userId: string;
    planId: string;
    monthlyPrice: number;
  }): Promise<{ providerSubscriptionId: string }>;

  cancelSubscription(input: { providerSubscriptionId: string }): Promise<void>;
}`,
    },
    {
      filename: "src/modules/subscriptions/application/subscriptionHexagon.ts",
      language: "ts",
      description:
        "The application hexagon: pure business logic implementing the driving port and depending on driven ports through constructor injection. No NestJS decorators, no database imports.",
      code: `import {
  BillingPort,
  PlanRepository,
  SubscribeInput,
  SubscribeOutput,
  Subscription,
  SubscriptionDrivingPort,
  SubscriptionRepository,
} from "./ports";

export class SubscriptionHexagon implements SubscriptionDrivingPort {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly planRepository: PlanRepository,
    private readonly billingPort: BillingPort,
    private readonly generateSubscriptionId: () => string,
  ) {}

  async subscribe(input: SubscribeInput): Promise<SubscribeOutput> {
    const existingSubscription =
      await this.subscriptionRepository.findActiveByUserId(input.userId);
    if (existingSubscription) {
      throw new Error(\`User \${input.userId} already has an active subscription\`);
    }

    const plan = await this.planRepository.findById(input.planId);
    if (!plan) {
      throw new Error(\`Plan \${input.planId} not found\`);
    }

    await this.billingPort.createSubscription({
      userId: input.userId,
      planId: input.planId,
      monthlyPrice: plan.monthlyPrice,
    });

    const subscription: Subscription = {
      subscriptionId: this.generateSubscriptionId(),
      userId: input.userId,
      planId: input.planId,
      status: "active",
      startedAt: new Date(),
    };

    await this.subscriptionRepository.save(subscription);

    return { subscriptionId: subscription.subscriptionId };
  }

  async cancel(input: { subscriptionId: string }): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(
      input.subscriptionId
    );
    if (!subscription) {
      throw new Error(\`Subscription \${input.subscriptionId} not found\`);
    }
    if (subscription.status !== "active") {
      throw new Error(\`Subscription \${input.subscriptionId} is not active\`);
    }

    const updatedSubscription: Subscription = {
      ...subscription,
      status: "cancelled",
    };

    await this.subscriptionRepository.save(updatedSubscription);
  }
}`,
    },
  ],
  pros: [
    "Driving and driven ports make every external dependency explicit and replaceable, enabling fast in-memory test setups",
    "Multiple delivery channels can invoke the same application logic through the same driving port without code duplication",
    "Enforces a clear inside-out dependency direction that keeps business logic stable as infrastructure evolves",
  ],
  cons: [
    "Requires upfront design of port interfaces, which demands accurate domain knowledge before implementation begins",
    "Adds more files and indirection than a direct service-plus-repository approach, which can confuse developers new to the pattern",
    "Poorly defined ports that leak infrastructure types into the hexagon defeat the entire isolation guarantee",
  ],
};
