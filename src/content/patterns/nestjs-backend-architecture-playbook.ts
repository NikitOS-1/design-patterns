import { Pattern } from "@/lib/types";

export const nestjsBackendArchitecturePlaybook: Pattern = {
  slug: "nestjs-backend-architecture-playbook",
  category: "architecture-backend",
  code: "A-04",
  name: "NestJS Backend Architecture Playbook",
  oneLiner:
    "Build NestJS systems from clear module boundaries, then choose layered, clean, or distributed patterns based on scale.",
  problem:
    "Backend teams often adopt terms like Clean, Hexagonal, CQRS, or Microservices without clear scope, which results in partial implementations and duplicated complexity. Modules mix transport code with business rules, and scaling decisions are made too late or too early.",
  solution:
    "Start with a modular monolith and explicit bounded contexts. Apply Layered or Clean structure inside each context, use Hexagonal Ports and Adapters at infrastructure boundaries, and evolve to CQRS, Event Driven, BFF, API Gateway, Saga, and Microservices only for proven scaling needs. DDD provides the language and boundaries for all these patterns.",
  whenToUse: [
    "Layered Architecture for clear separation of controllers, services, repositories in most APIs",
    "Clean or Onion Architecture when domain logic is complex and must stay framework-agnostic",
    "Hexagonal Architecture when integrations and infrastructure adapters change frequently",
    "CQRS and Event Driven flows for write-heavy domains with complex side effects and audit requirements",
    "BFF and API Gateway when multiple frontends consume shared domain capabilities differently",
    "Saga and Microservices for cross-service business processes and independent scaling requirements",
  ],
  avoidWhen: [
    "Splitting into microservices before modular monolith boundaries are stable",
    "Applying CQRS and Saga in domains that only need straightforward CRUD operations",
    "Using many architectural patterns at once without explicit domain ownership",
  ],
  realWorldExamples: [
    {
      name: "Layered NestJS modules",
      detail:
        "Controller and resolver layers map transport concerns, services orchestrate use cases, and repositories handle persistence adapters.",
    },
    {
      name: "Hexagonal payments and notifications",
      detail:
        "Core order module depends on payment and messaging ports, while Stripe and RabbitMQ adapters implement those ports.",
    },
    {
      name: "CQRS with event publishing",
      detail:
        "Write-side command handlers emit domain events consumed by read-model updaters and integration handlers.",
    },
    {
      name: "BFF + API Gateway in multi-client ecosystems",
      detail:
        "Gateway handles auth, routing, and policies while separate BFFs optimize response shape for web, mobile, and partner portals.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/orders/application/commands/placeOrderCommandHandler.ts",
      language: "ts",
      description:
        "A CQRS write-side handler that persists aggregate state and emits a domain event through an abstract event bus port.",
      code: `interface PlaceOrderCommand {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}

interface OrderRepository {
  save(order: { orderId: string; userId: string; totalAmount: number }): Promise<void>;
}

interface EventBusPort {
  publish(eventName: string, payload: Record<string, unknown>): Promise<void>;
}

export class PlaceOrderCommandHandler {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventBusPort: EventBusPort
  ) {}

  async execute(command: PlaceOrderCommand) {
    const totalAmount = command.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    await this.orderRepository.save({
      orderId: command.orderId,
      userId: command.userId,
      totalAmount,
    });

    await this.eventBusPort.publish("order.created", {
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
        "A BFF-style NestJS controller that composes data from read-side query and recommendation services for frontend-specific response shape.",
      code: `import { Controller, Get, Param } from "@nestjs/common";

interface OrderQueryService {
  getOrderSummary(orderId: string): Promise<{ orderId: string; totalAmount: number; status: string }>;
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
  async getOrderScreenData(@Param("orderId") orderId: string, @Param("userId") userId: string) {
    const orderSummary = await this.orderQueryService.getOrderSummary(orderId);
    const recommendations = await this.recommendationGateway.getRecommendations(userId);

    return {
      orderSummary,
      recommendations,
    };
  }
}`,
    },
  ],
  pros: [
    "Provides a practical path from modular monolith to distributed architecture without big-bang rewrites",
    "Keeps NestJS transport concerns separate from domain and application logic",
    "Enables selective adoption of advanced patterns only where domain complexity justifies them",
  ],
  cons: [
    "Pattern combinations can increase cognitive load without strong architecture governance",
    "Distributed patterns add operational overhead and require mature observability",
    "Incorrect DDD boundaries will propagate coupling across all chosen architectural styles",
  ],
};
