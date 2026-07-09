import { Pattern } from "@/lib/types";

export const cleanArchitectureBackend: Pattern = {
  slug: "clean-architecture-backend",
  category: "architecture-backend",
  code: "A-13",
  name: "Clean Architecture / Onion (Backend)",
  oneLiner:
    "Organize a backend around a stable domain core with a strict inward dependency rule: outer layers depend on inner layers, never the reverse.",
  problem:
    "When business rules are scattered across NestJS controllers, TypeORM entities, and Prisma query files, they are impossible to test without the full infrastructure stack. Swapping a database, replacing an HTTP framework, or migrating from REST to GraphQL becomes a major rewrite because application logic is physically tangled with framework annotations and ORM decorators. Teams cannot describe what the system does independently of how it is deployed, which makes reasoning about correctness, testing use cases in isolation, and evolving the codebase progressively extremely difficult.",
  solution:
    "Structure the backend as concentric rings. The innermost ring contains the domain layer: pure TypeScript entities, value objects, domain events, and business invariants with zero external dependencies. The next ring is the application layer: use cases and application services that orchestrate domain objects and declare the interfaces — ports — they need for persistence, messaging, and external services. The outer rings are adapters: concrete implementations of those ports using TypeORM, Prisma, Kafka, or HTTP clients. The framework layer wraps NestJS controllers and module configuration at the very outside. The dependency rule is absolute: source code dependencies point inward only. Domain code never imports application code; application code never imports adapter code. This means every use case can be tested by injecting in-memory ports without starting a server or connecting to a database.",
  whenToUse: [
    "Backends with complex, long-lived domain rules that must outlive framework and ORM choices",
    "Systems where use-case-level unit testing without infrastructure is a hard requirement",
    "Teams that foresee migrating from one database technology to another or adding new delivery channels like gRPC or GraphQL alongside REST",
    "Microservices or modules where the domain model is rich enough to justify isolating it from persistence concerns",
  ],
  avoidWhen: [
    "CRUD-heavy services where there is no meaningful domain logic to protect and ports add pure ceremony",
    "Small teams on tight timelines where the full onion structure slows feature delivery without payoff",
    "Services that are intentionally glue code between external APIs and will never contain original business rules",
  ],
  realWorldExamples: [
    {
      name: "NestJS with domain use cases and TypeORM adapters",
      detail:
        "Domain entities and use-case classes live in framework-free TypeScript packages; TypeORM repository implementations satisfy domain repository interfaces declared in the application layer; NestJS modules wire adapters to use cases through the DI container.",
    },
    {
      name: "Fintech transaction processing engine",
      detail:
        "Transaction validation, balance calculation, and fraud scoring live in a pure domain core tested with fast unit tests; Kafka consumers and REST controllers are outer adapters that translate external events into domain commands.",
    },
    {
      name: "Multi-channel notification service",
      detail:
        "A NotificationUseCase depends on NotificationPort; adapters implement the port for email via SendGrid, SMS via Twilio, and push via FCM without the use case knowing which channel is active at runtime.",
    },
    {
      name: "Backend-agnostic domain packages in monorepos",
      detail:
        "In a Turborepo, a packages/domain workspace exports domain entities and interfaces; apps/api-server and apps/worker both depend on the same domain package and provide their own adapter implementations.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/payments/application/processPayment.usecase.ts",
      language: "ts",
      description:
        "Application layer use case: depends only on domain types and port interfaces declared locally. No NestJS decorators, no ORM imports, no framework coupling.",
      code: `import { Payment } from "../domain/payment";
import { PaymentStatus } from "../domain/payment-status";

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(paymentId: string): Promise<Payment | null>;
}

export interface PaymentGateway {
  authorize(input: {
    amount: number;
    currency: string;
    paymentMethodId: string;
  }): Promise<{ providerTransactionId: string }>;
}

export interface PaymentIdGenerator {
  generate(): string;
}

interface ProcessPaymentInput {
  userId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
}

interface ProcessPaymentOutput {
  paymentId: string;
  status: PaymentStatus;
}

export class ProcessPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly paymentIdGenerator: PaymentIdGenerator
  ) {}

  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentOutput> {
    const { providerTransactionId } = await this.paymentGateway.authorize({
      amount: input.amount,
      currency: input.currency,
      paymentMethodId: input.paymentMethodId,
    });

    const paymentId = this.paymentIdGenerator.generate();
    const payment = Payment.create({
      paymentId,
      userId: input.userId,
      amount: input.amount,
      currency: input.currency,
      providerTransactionId,
      status: PaymentStatus.Authorized,
    });

    await this.paymentRepository.save(payment);

    return { paymentId, status: payment.status };
  }
}`,
    },
    {
      filename: "src/modules/payments/infrastructure/stripePaymentGateway.ts",
      language: "ts",
      description:
        "Outer adapter: implements the PaymentGateway port declared in the application layer. NestJS and Stripe SDK dependencies are fully contained here.",
      code: `import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { PaymentGateway } from "../application/processPayment.usecase";

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  private readonly stripeClient: Stripe;

  constructor() {
    this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2024-12-18.acacia",
    });
  }

  async authorize(input: {
    amount: number;
    currency: string;
    paymentMethodId: string;
  }): Promise<{ providerTransactionId: string }> {
    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency,
      payment_method: input.paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    return { providerTransactionId: paymentIntent.id };
  }
}`,
    },
  ],
  pros: [
    "Domain and application logic are independently testable without any infrastructure or framework setup",
    "The dependency rule makes it safe to replace databases, message brokers, or HTTP frameworks without touching business rules",
    "Enforces a clear vocabulary of use cases, ports, and adapters that improves architecture communication across teams",
  ],
  cons: [
    "Significantly higher initial scaffolding cost compared with direct NestJS service-plus-TypeORM patterns",
    "Requires discipline to maintain: teams regularly violate the inward dependency rule by importing ORM decorators into domain entities",
    "Rich domain models with ports and adapters are overkill for services where the main logic is reading and writing database rows",
  ],
};
