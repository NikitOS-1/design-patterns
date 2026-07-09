import { Pattern } from "@/lib/types";

export const layeredArchitecture: Pattern = {
  slug: "layered-architecture",
  category: "architecture",
  code: "A-12",
  name: "Layered Architecture",
  oneLiner:
    "Organize code into horizontal layers — presentation, application, domain, and infrastructure — where each layer depends only on the layer directly below it.",
  problem:
    "As Node.js and NestJS backends grow, route handlers begin calling database clients directly, validation logic bleeds into services, and business rules get duplicated across controllers. Without clear layer boundaries, a single change — swapping an ORM, adding an authentication strategy, or changing a response format — ripples through the entire codebase. Teams struggle to locate business logic, write unit tests without spinning up a database, or onboard developers who need to understand how a feature works end to end.",
  solution:
    "Divide the application into horizontal layers with explicit responsibilities and enforce a strict downward dependency rule. The presentation layer handles HTTP concerns: routing, request parsing, input validation, and response serialization. The application layer orchestrates use cases and workflows without knowing about HTTP or databases. The domain layer holds business entities, value objects, and invariants with no external dependencies. The infrastructure layer provides concrete implementations of persistence, messaging, and third-party clients. Each layer communicates with the layer below through defined interfaces, making it possible to swap infrastructure without touching business logic and to test use cases with in-memory fakes.",
  whenToUse: [
    "Backend APIs with moderate domain complexity where teams need a shared mental model for where code belongs",
    "NestJS applications that benefit from NestJS module boundaries aligning with layers",
    "Systems where unit testing business logic in isolation from the database is a priority",
    "Greenfield services where establishing clear conventions early prevents architectural drift",
  ],
  avoidWhen: [
    "Simple CRUD APIs where layers add ceremony without meaningful decoupling benefits",
    "Teams that treat layering as strict pass-through classes that mirror each other one-to-one",
    "High-performance hot paths where the indirection cost of multiple layer boundaries matters",
  ],
  realWorldExamples: [
    {
      name: "NestJS controllers → services → repositories",
      detail:
        "Controllers annotated with @Controller handle HTTP, services injected into controllers hold business logic, and TypeORM or Prisma repositories injected into services manage persistence — a classic three-tier layered stack within NestJS modules.",
    },
    {
      name: "Enterprise Java patterns ported to Node.js",
      detail:
        "Teams migrating from Spring Boot to NestJS naturally carry the layered architecture mental model, mapping @RestController to NestJS controllers, @Service to NestJS providers, and @Repository to TypeORM repositories.",
    },
    {
      name: "SaaS backend with multiple bounded contexts",
      detail:
        "A billing module, user module, and notification module each implement their own layered stack inside separate NestJS modules, sharing infrastructure utilities through a common layer but keeping domain logic isolated.",
    },
    {
      name: "Large monorepo with shared domain packages",
      detail:
        "A Turborepo workspace keeps domain packages as pure TypeScript with zero framework dependencies, while application packages depend on NestJS and import domain types through workspace references.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/orders/orders.controller.ts",
      language: "ts",
      description:
        "The presentation layer: NestJS controller handles HTTP, delegates to the application service, and returns a serialized response. No business logic lives here.",
      code: `import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.createOrder({
      userId: createOrderDto.userId,
      items: createOrderDto.items,
    });
    return { orderId: order.orderId, totalAmount: order.totalAmount };
  }

  @Get(":orderId")
  async getOrder(@Param("orderId") orderId: string) {
    const order = await this.ordersService.getOrderById(orderId);
    return {
      orderId: order.orderId,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
    };
  }
}`,
    },
    {
      filename: "src/modules/orders/orders.service.ts",
      language: "ts",
      description:
        "The application layer: orchestrates domain rules and repository calls. Depends on the domain entity and repository interface, not on HTTP or ORM internals.",
      code: `import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./domain/order.entity";
import { OrderItem } from "./domain/order-item.entity";

interface CreateOrderInput {
  userId: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const order = this.orderRepository.create({
      userId: input.userId,
      totalAmount,
      status: "pending",
      items: input.items.map((item) =>
        Object.assign(new OrderItem(), {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })
      ),
    });

    return this.orderRepository.save(order);
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId },
      relations: ["items"],
    });

    if (!order) {
      throw new NotFoundException(\`Order \${orderId} not found\`);
    }

    return order;
  }
}`,
    },
  ],
  pros: [
    "Provides a universally understood mental model that scales well with team size and onboarding",
    "Enforces separation of HTTP concerns from business logic, making services independently testable",
    "Aligns naturally with NestJS module system, providers, and dependency injection primitives",
  ],
  cons: [
    "Can degenerate into anemic layers where each class is a thin pass-through to the one below",
    "Horizontal layers do not naturally enforce vertical feature boundaries across bounded contexts",
    "Strict layering can introduce unnecessary abstraction in simple CRUD modules with no real domain logic",
  ],
};
