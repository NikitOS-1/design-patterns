import { Pattern } from "@/lib/types";

export const backendArchitectureNodejs: Pattern = {
  slug: "backend-architecture-nodejs",
  category: "architecture-backend",
  code: "A-02",
  name: "Backend Architecture (Node.js + NestJS)",
  oneLiner:
    "A practical map of NestJS and Node.js backend architectures: named styles, what each solves, how they look, and when to adopt them.",
  problem:
    "Backend teams often adopt buzzwords — Clean, Hexagonal, CQRS, Microservices — without clear scope. Controllers grow into god classes, domain rules mix with ORM queries, and scaling decisions arrive either too early (distributed complexity for a CRUD app) or too late (a monolith that cannot be split). Without named architectures and explicit boundaries, every change touches too many layers at once.",
  solution:
    "Start with a Modular Monolith and clear bounded contexts. Inside each context use Layered or Clean structure; put Hexagonal Ports and Adapters at infrastructure edges. Evolve to CQRS, Event Driven Architecture, BFF, API Gateway, Saga, and Microservices only when domain and scale demand it. Domain-Driven Design supplies the language and boundaries for all of these. Below is each architecture by name: what it is, what it solves, how it looks, and when it fits.",
  whenToUse: [
    "You need a shared vocabulary for NestJS / Node.js architecture reviews",
    "A backend is growing past “controllers + services + entities” without clear domain ownership",
    "You must choose between Layered, Clean, Hexagonal, CQRS, Event Driven, BFF, or Microservices",
    "Teams debate microservices before modular monolith boundaries are stable",
  ],
  avoidWhen: [
    "A tiny CRUD utility where a simple route + repository structure is enough",
    "Applying CQRS, Saga, and Microservices to a domain that only needs straightforward writes",
    "Copying a distributed architecture into a small team without observability and ownership",
  ],
  realWorldExamples: [
    {
      name: "Layered Architecture",
      detail:
        "What it is: horizontal layers — presentation → application → domain → infrastructure — with downward-only calls. What it solves: fat controllers and mixed responsibilities. NestJS shape: controller → service → repository. Dedicated page: /patterns/layered-architecture.",
    },
    {
      name: "Clean Architecture / Onion Architecture",
      detail:
        "What it is: domain and use cases at the center; NestJS, ORM, and SDKs as outer rings with inward dependencies. What it solves: business logic trapped in framework code. Dedicated page: /patterns/clean-architecture-backend.",
    },
    {
      name: "Hexagonal Architecture (Ports & Adapters)",
      detail:
        "What it is: application core defines ports; adapters implement HTTP, DB, Stripe, Kafka. What it solves: swapping infrastructure without rewriting use cases. Dedicated page: /patterns/hexagonal-architecture.",
    },
    {
      name: "CQRS (Command Query Responsibility Segregation)",
      detail:
        "What it is: separate write commands from read queries, often with different models or stores. What it solves: one overloaded model for complex writes and optimized reads. Dedicated page: /patterns/cqrs.",
    },
    {
      name: "Event Driven Architecture",
      detail:
        "What it is: publish and consume domain/integration events via brokers. What it solves: tight sync coupling and cascading request failures. Dedicated page: /patterns/event-driven-architecture.",
    },
    {
      name: "Microservices",
      detail:
        "What it is: independently deployable services per bounded context with their own data. What it solves: release and scale bottlenecks — after modular monolith boundaries are stable. Dedicated page: /patterns/microservices-architecture.",
    },
    {
      name: "BFF (Backend for Frontend) + API Gateway",
      detail:
        "What it is: Gateway for auth/routing/limits; BFF for client-specific aggregation. What it solves: one bloated API for every client shape. Dedicated page: /patterns/bff-api-gateway.",
    },
    {
      name: "Saga + Domain-Driven Design (DDD)",
      detail:
        "What it is: DDD for bounded contexts and language; Saga for multi-step cross-service workflows with compensations. Dedicated pages: /patterns/domain-driven-design and /patterns/saga-pattern.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/orders/application/placeOrder.ts",
      language: "ts",
      description:
        "Hexagonal / Clean use case: application logic depends on ports, not on NestJS, TypeORM, or Stripe SDKs.",
      code: `interface PlaceOrderInput {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
  currency: string;
}

interface OrderRepositoryPort {
  existsById(orderId: string): Promise<boolean>;
  save(order: PlaceOrderInput & { totalAmount: number }): Promise<void>;
}

interface PaymentGatewayPort {
  reserveFunds(input: {
    userId: string;
    amount: number;
    currency: string;
  }): Promise<{ reservationId: string }>;
}

export async function placeOrder(
  input: PlaceOrderInput,
  ports: { orders: OrderRepositoryPort; payments: PaymentGatewayPort }
) {
  if (await ports.orders.existsById(input.orderId)) {
    throw new Error("Order already exists");
  }

  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  await ports.payments.reserveFunds({
    userId: input.userId,
    amount: totalAmount,
    currency: input.currency,
  });

  await ports.orders.save({ ...input, totalAmount });
  return { orderId: input.orderId, totalAmount };
}`,
    },
    {
      filename: "src/modules/orders/application/commands/placeOrderCommandHandler.ts",
      language: "ts",
      description:
        "CQRS write side: command handler persists state and publishes a domain event for Event Driven consumers.",
      code: `interface PlaceOrderCommand {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}

interface OrderRepositoryPort {
  save(order: { orderId: string; userId: string; totalAmount: number }): Promise<void>;
}

interface EventBusPort {
  publish(eventName: string, payload: Record<string, unknown>): Promise<void>;
}

export class PlaceOrderCommandHandler {
  constructor(
    private readonly orders: OrderRepositoryPort,
    private readonly eventBus: EventBusPort
  ) {}

  async execute(command: PlaceOrderCommand) {
    const totalAmount = command.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    await this.orders.save({
      orderId: command.orderId,
      userId: command.userId,
      totalAmount,
    });

    await this.eventBus.publish("order.created", {
      orderId: command.orderId,
      userId: command.userId,
      totalAmount,
    });
  }
}`,
    },
    {
      filename: "src/modules/orders/infrastructure/http/ordersBffController.ts",
      language: "ts",
      description:
        "BFF-style NestJS controller: aggregates read models for a specific frontend screen without bloating core domain APIs.",
      code: `import { Controller, Get, Param } from "@nestjs/common";

interface OrderQueryService {
  getOrderSummary(orderId: string): Promise<{
    orderId: string;
    totalAmount: number;
    status: string;
  }>;
}

interface RecommendationGateway {
  getRecommendations(userId: string): Promise<{ productId: string; title: string }[]>;
}

@Controller("bff/orders")
export class OrdersBffController {
  constructor(
    private readonly orderQueryService: OrderQueryService,
    private readonly recommendationGateway: RecommendationGateway
  ) {}

  @Get(":orderId/users/:userId")
  async getOrderScreenData(
    @Param("orderId") orderId: string,
    @Param("userId") userId: string
  ) {
    const orderSummary = await this.orderQueryService.getOrderSummary(orderId);
    const recommendations = await this.recommendationGateway.getRecommendations(userId);

    return { orderSummary, recommendations };
  }
}`,
    },
  ],
  pros: [
    "Gives NestJS teams a clear progression from Modular Monolith to distributed patterns",
    "Separates transport, domain, and infrastructure so integrations can change without rewriting use cases",
    "Makes advanced patterns (CQRS, Saga, Microservices) optional and justified by real constraints",
  ],
  cons: [
    "Too many patterns at once increase cognitive load without architecture governance",
    "Distributed styles add operational cost — observability, retries, and ownership are mandatory",
    "Wrong DDD boundaries turn every architecture choice into a distributed mess",
  ],
};
