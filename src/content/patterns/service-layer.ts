import { Pattern } from "@/lib/types";

export const serviceLayer: Pattern = {
  slug: "service-layer",
  category: "structural",
  code: "S-09",
  name: "Service Layer",
  oneLiner:
    "Centralize application use-case orchestration in services so controllers and UI adapters stay thin and consistent.",
  problem:
    "When controllers, route handlers, or React server actions orchestrate business logic directly, each endpoint implements validation, policy checks, transactions, and side effects differently. Duplicate flow logic appears across transport layers, and changing one business rule requires editing multiple handlers.",
  solution:
    "Move orchestration into service methods that represent explicit use cases. Controllers and UI adapters map input and output only, while the service layer coordinates repositories, policies, and integrations in one place. This keeps transport concerns separate and creates a stable application core.",
  whenToUse: [
    "Features where one business action touches multiple repositories or external systems",
    "Backends exposing the same use cases via REST, GraphQL, queue workers, and cron jobs",
    "Codebases that need consistent error handling and transaction boundaries",
    "Teams that want business flows to be testable without HTTP framework bootstrapping",
  ],
  avoidWhen: [
    "A very small endpoint where adding a service only introduces extra indirection",
    "Service classes that become generic utility dumps instead of clear use-case boundaries",
    "Cases where domain methods already encapsulate the entire behavior cleanly",
  ],
  realWorldExamples: [
    {
      name: "NestJS application services",
      detail:
        "Controllers handle transport mapping while service classes execute use cases and coordinate repositories and gateways.",
    },
    {
      name: "BFF endpoints",
      detail:
        "Frontend-specific endpoints call service-layer methods to aggregate data from multiple downstream APIs without duplicating orchestration per route.",
    },
    {
      name: "Shared business flows across transports",
      detail:
        "A single placeOrder service method can be called by REST handlers, GraphQL resolvers, and message consumers.",
    },
    {
      name: "Transactional workflows",
      detail:
        "Service methods define transaction scope and ensure side effects execute in a predictable order.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/orders/application/orderService.ts",
      language: "ts",
      description:
        "A service method that coordinates repository, inventory, and notifications for a single place-order use case.",
      code: `interface PlaceOrderInput {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number }[];
}

interface OrderRepository {
  save(order: { orderId: string; userId: string; items: PlaceOrderInput["items"] }): Promise<void>;
}

interface InventoryGateway {
  reserve(input: { productId: string; quantity: number }[]): Promise<void>;
}

interface NotificationGateway {
  sendOrderCreated(input: { userId: string; orderId: string }): Promise<void>;
}

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly inventoryGateway: InventoryGateway,
    private readonly notificationGateway: NotificationGateway
  ) {}

  async placeOrder(input: PlaceOrderInput): Promise<{ orderId: string }> {
    await this.inventoryGateway.reserve(input.items);

    await this.orderRepository.save({
      orderId: input.orderId,
      userId: input.userId,
      items: input.items,
    });

    await this.notificationGateway.sendOrderCreated({
      userId: input.userId,
      orderId: input.orderId,
    });

    return { orderId: input.orderId };
  }
}`,
    },
    {
      filename: "src/modules/orders/infrastructure/http/orderController.ts",
      language: "ts",
      description:
        "Controller remains thin by delegating orchestration to the service layer and focusing on request mapping.",
      code: `import { FastifyInstance } from "fastify";
import { OrderService } from "@/modules/orders/application/orderService";

interface PlaceOrderRequestBody {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number }[];
}

export function registerOrderController(app: FastifyInstance, orderService: OrderService) {
  app.post<{ Body: PlaceOrderRequestBody }>("/orders", async (request, reply) => {
    const result = await orderService.placeOrder({
      orderId: request.body.orderId,
      userId: request.body.userId,
      items: request.body.items,
    });

    return reply.status(201).send(result);
  });
}`,
    },
  ],
  pros: [
    "Keeps transport adapters simple and consistent across REST, GraphQL, and queues",
    "Concentrates business orchestration in one place for easier testing and refactoring",
    "Improves cross-team collaboration by exposing explicit use-case APIs",
  ],
  cons: [
    "Can become a bloated god-service layer without strict domain boundaries",
    "Adds an extra abstraction for very small handlers with trivial logic",
    "Requires disciplined naming to avoid turning services into generic helper buckets",
  ],
};
