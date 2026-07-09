import { Pattern } from "@/lib/types";

export const cqrs: Pattern = {
  slug: "cqrs",
  category: "architecture-backend",
  code: "A-15",
  name: "CQRS",
  oneLiner:
    "Separate command handlers that mutate state from query handlers that read it, allowing each side to be optimized independently.",
  problem:
    "In a traditional service layer, the same model handles both reads and writes. A single OrderService might have a createOrder method that validates, persists, and publishes events alongside a getOrderDashboard method that joins multiple tables to build a complex projection. These two concerns pull in opposite directions: writes need strong consistency, validation, and transactional guarantees; reads need performance, denormalized projections, and flexible shaping for different consumers. As complexity grows, the service accumulates a mix of mutation logic and query optimization code that becomes hard to reason about, test independently, or scale differently. Attempts to add read replicas or caching are hampered by the fact that the same code path handles both concerns.",
  solution:
    "Explicitly divide the application into two separate flows. Commands represent intentions to change state: CreateOrderCommand, CancelOrderCommand, UpdateUserProfileCommand. Each command is handled by a dedicated command handler that validates business rules, mutates state, and optionally publishes domain events. Queries represent requests for data: GetOrderByIdQuery, GetUserOrderHistoryQuery. Each query handler reads from the most appropriate data source — which may be a denormalized read model, a search index, or a cached projection — and returns a data transfer object shaped for the specific consumer. The write model optimizes for correctness and transactional integrity; the read model optimizes for query performance. NestJS provides first-class CQRS support through the @nestjs/cqrs package, which registers command handlers and query handlers automatically via the CqrsModule and makes them discoverable through CommandBus and QueryBus.",
  whenToUse: [
    "Applications with complex write-side business rules that need to remain separate from flexible, consumer-specific read projections",
    "Systems that must scale reads and writes independently, for example with separate read replicas or dedicated search indexes",
    "Backends using NestJS where the @nestjs/cqrs module can enforce the separation without custom infrastructure",
    "Event-sourced systems where commands generate events and query models are rebuilt from event streams",
  ],
  avoidWhen: [
    "Simple CRUD applications where reads and writes are symmetric and adding two separate buses is unnecessary complexity",
    "Small teams where the cognitive overhead of managing separate command and query models slows feature development",
    "Services with very few operations that do not benefit from independent scaling or separate optimizations",
  ],
  realWorldExamples: [
    {
      name: "NestJS @nestjs/cqrs CommandBus and QueryBus",
      detail:
        "Controllers inject CommandBus and QueryBus; commands and queries are dispatched as typed classes; NestJS automatically routes them to decorated handler classes implementing ICommandHandler or IQueryHandler.",
    },
    {
      name: "E-commerce order processing",
      detail:
        "The write side processes PlaceOrderCommand through a handler that validates inventory, calculates pricing, and persists the order aggregate; the read side serves order history queries from a denormalized PostgreSQL view or Elasticsearch index.",
    },
    {
      name: "Event-sourced banking ledger",
      detail:
        "DebitAccountCommand and CreditAccountCommand produce domain events appended to an event store; multiple query handlers build balance projections, transaction history views, and audit trail reports from the same event stream.",
    },
    {
      name: "Dashboard analytics backend",
      detail:
        "Write commands handle user actions with strict validation and optimistic locking; query handlers read from pre-aggregated materialized views refreshed asynchronously, making dashboard endpoints fast without impacting the write path.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/orders/commands/placeOrder.command.ts",
      language: "ts",
      description:
        "Command class and its handler: the write side of CQRS. The handler validates business rules, persists the aggregate, and publishes a domain event through the EventBus.",
      code: `import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../domain/order.entity";
import { OrderPlacedEvent } from "../events/order-placed.event";

export class PlaceOrderCommand {
  constructor(
    readonly userId: string,
    readonly items: { productId: string; quantity: number; unitPrice: number }[],
  ) {}
}

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<{ orderId: string }> {
    if (command.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    const totalAmount = command.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const order = this.orderRepository.create({
      userId: command.userId,
      totalAmount,
      status: "pending",
    });

    const savedOrder = await this.orderRepository.save(order);

    this.eventBus.publish(
      new OrderPlacedEvent(savedOrder.orderId, command.userId, totalAmount)
    );

    return { orderId: savedOrder.orderId };
  }
}`,
    },
    {
      filename: "src/modules/orders/queries/getOrderHistory.query.ts",
      language: "ts",
      description:
        "Query class and its handler: the read side of CQRS. Returns a denormalized projection shaped for the consumer, reading from a dedicated read model table.",
      code: `import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderReadModel } from "../read-models/order-read-model.entity";

export interface OrderHistoryItem {
  orderId: string;
  totalAmount: number;
  status: string;
  placedAt: Date;
  itemCount: number;
}

export class GetOrderHistoryQuery {
  constructor(
    readonly userId: string,
    readonly limit: number,
    readonly offset: number,
  ) {}
}

@QueryHandler(GetOrderHistoryQuery)
export class GetOrderHistoryHandler
  implements IQueryHandler<GetOrderHistoryQuery>
{
  constructor(
    @InjectRepository(OrderReadModel)
    private readonly orderReadModelRepository: Repository<OrderReadModel>,
  ) {}

  async execute(query: GetOrderHistoryQuery): Promise<OrderHistoryItem[]> {
    const records = await this.orderReadModelRepository.find({
      where: { userId: query.userId },
      order: { placedAt: "DESC" },
      take: query.limit,
      skip: query.offset,
    });

    return records.map((record) => ({
      orderId: record.orderId,
      totalAmount: record.totalAmount,
      status: record.status,
      placedAt: record.placedAt,
      itemCount: record.itemCount,
    }));
  }
}`,
    },
  ],
  pros: [
    "Command and query paths are independently optimizable: write models enforce consistency while read models maximize query performance",
    "Business logic in command handlers is easier to unit test because it is isolated from read projections and view concerns",
    "Scales naturally to event sourcing, where query projections are rebuilt from the same event stream that commands produce",
  ],
  cons: [
    "Increases the total number of files, classes, and abstractions compared with a single service method handling both reads and writes",
    "Read model synchronization adds eventual consistency complexity that simple applications do not need to manage",
    "CommandBus and QueryBus indirection can make request tracing and debugging harder without proper correlation ID propagation",
  ],
};
