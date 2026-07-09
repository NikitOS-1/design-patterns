import { Pattern } from "@/lib/types";

export const eventDrivenArchitecture: Pattern = {
  slug: "event-driven-architecture",
  category: "architecture-backend",
  code: "A-16",
  name: "Event-Driven Architecture",
  oneLiner:
    "Decouple services and modules by having producers publish domain events to a broker while consumers react independently and asynchronously.",
  problem:
    "When services communicate exclusively through synchronous HTTP calls, the system couples their availability, latency, and release cycles together. A checkout service calling the inventory service, the notification service, and the loyalty service in sequence becomes fragile: if any downstream service is slow or unavailable, the entire checkout fails. Adding a new integration — a recently introduced analytics service that also needs to react to order placement — requires modifying the checkout service code, redeploying it, and ensuring the new dependency is always online. Over time, orchestrated chains of synchronous calls create invisible dependency graphs that make the system increasingly brittle and hard to evolve.",
  solution:
    "Replace synchronous call chains with an event-driven model. When something meaningful happens in the domain — an order is placed, a payment is authorized, a user account is created — the originating service publishes a named domain event to a message broker such as Kafka, RabbitMQ, or AWS SNS/SQS. The event contains enough context to describe what happened without encoding instructions for what other services should do. Independent consumer services subscribe to the events they care about and react according to their own logic: the inventory service decrements stock, the notification service sends a confirmation email, the loyalty service awards points. Consumers are decoupled from the producer and from each other: they can be deployed, scaled, and modified independently. Eventual consistency replaces synchronous coordination, which means the system trades immediate consistency guarantees for resilience, scalability, and loose coupling.",
  whenToUse: [
    "Systems where multiple services or modules need to react to the same business event without the producer knowing who the consumers are",
    "High-throughput workflows where asynchronous processing prevents latency spikes from propagating across service boundaries",
    "Microservice ecosystems where independent deployability and loose coupling across bounded contexts are primary goals",
    "Systems requiring audit trails, event replay, or the ability to add new consumers without modifying existing producers",
  ],
  avoidWhen: [
    "Workflows that require an immediate, synchronous response from all participants before returning a result to the caller",
    "Simple applications where introducing a message broker adds operational overhead that exceeds the decoupling benefit",
    "Teams without operational experience running and monitoring Kafka or RabbitMQ in production",
  ],
  realWorldExamples: [
    {
      name: "Kafka-based order processing pipeline",
      detail:
        "An order service publishes OrderPlaced events to a Kafka topic; inventory, notification, analytics, and loyalty services each consume the topic independently, processing events at their own pace with separate consumer groups.",
    },
    {
      name: "NestJS microservices with RabbitMQ transport",
      detail:
        "NestJS @MessagePattern and @EventPattern decorators bind handlers to message patterns; services publish events through ClientProxy without knowing which handlers will consume them.",
    },
    {
      name: "AWS Lambda event processing",
      detail:
        "SNS topics carry domain events between AWS Lambda functions; each function subscribes to the events it needs and scales independently based on its own throughput requirements.",
    },
    {
      name: "Outbox pattern for reliable event publishing",
      detail:
        "Services write events to an outbox table inside the same database transaction as the business state change; a relay process reads undelivered outbox records and publishes them to the broker, guaranteeing at-least-once delivery.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/orders/events/order-placed.producer.ts",
      language: "ts",
      description:
        "Event producer: publishes an OrderPlaced domain event to Kafka after successfully persisting an order. The producer does not know or care which services will consume the event.",
      code: `import { Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";

export interface OrderPlacedEventPayload {
  orderId: string;
  userId: string;
  totalAmount: number;
  items: { productId: string; quantity: number; unitPrice: number }[];
  occurredAt: string;
}

@Injectable()
export class OrderPlacedProducer {
  constructor(
    @Inject("KAFKA_SERVICE")
    private readonly kafkaClient: ClientKafka,
  ) {}

  async publish(payload: OrderPlacedEventPayload): Promise<void> {
    await this.kafkaClient.emit("orders.placed", {
      key: payload.orderId,
      value: JSON.stringify(payload),
      headers: {
        "event-type": "OrderPlaced",
        "event-version": "1",
        "occurred-at": payload.occurredAt,
      },
    });
  }
}`,
    },
    {
      filename: "src/modules/notifications/events/order-placed.consumer.ts",
      language: "ts",
      description:
        "Event consumer: a NestJS microservice controller subscribing to the orders.placed Kafka topic. Completely independent from the order service — it only knows about the event schema.",
      code: `import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { NotificationsService } from "../notifications.service";

interface OrderPlacedEventPayload {
  orderId: string;
  userId: string;
  totalAmount: number;
  items: { productId: string; quantity: number; unitPrice: number }[];
  occurredAt: string;
}

@Controller()
export class OrderPlacedConsumer {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern("orders.placed")
  async handleOrderPlaced(
    @Payload() payload: OrderPlacedEventPayload,
  ): Promise<void> {
    await this.notificationsService.sendOrderConfirmation({
      userId: payload.userId,
      orderId: payload.orderId,
      totalAmount: payload.totalAmount,
      itemCount: payload.items.length,
    });
  }
}`,
    },
  ],
  pros: [
    "Producers and consumers are decoupled: adding a new consumer never requires changing the producer",
    "Each service can scale independently based on its own event consumption throughput requirements",
    "Supports resilient systems where consumers can retry failed event processing without impacting producers",
  ],
  cons: [
    "Eventual consistency means the system state is temporarily inconsistent across services after an event is published",
    "Debugging distributed event flows requires robust distributed tracing and correlation ID propagation across all services",
    "Message brokers introduce operational complexity: schema evolution, consumer group management, and dead letter queue handling",
  ],
};
