import { Pattern } from "@/lib/types";

export const microservicesArchitecture: Pattern = {
  slug: "microservices-architecture",
  category: "architecture-backend",
  code: "A-17",
  name: "Microservices Architecture",
  oneLiner:
    "Decompose a system into small, independently deployable services aligned to bounded contexts, each owning its data and communicating over the network.",
  problem:
    "A modular monolith may start well-structured but over time teams begin violating module boundaries: direct database joins span module tables, shared utility code accumulates cross-cutting state, and a bug in one module requires redeploying the entire application. The deployment pipeline becomes a bottleneck: a small change in the notification module forces a full regression of the payment module. Teams compete for release windows, testing cycles slow down, and scaling the entire monolith to handle high load on a single feature wastes infrastructure resources. Organizations with multiple independent product teams find it impossible to give ownership of a subdomain to one team without risk of collateral damage from adjacent teams merging code into the same artifact.",
  solution:
    "Identify bounded contexts within the domain — cohesive subdomains with clear ownership and stable interfaces — and extract each into its own independently deployable service. Each microservice owns its own database schema, preventing cross-service joins and enforcing data isolation. Services communicate through well-defined APIs: synchronous REST or gRPC for request/response interactions, and asynchronous event publishing for state changes that other services should react to. Teams deploy, scale, and version their services independently. Monitoring, health checks, and circuit breakers protect each service boundary. The key trade-off compared with a modular monolith is that microservices pay an upfront cost: distributed system complexity, network latency, eventual consistency, and operational burden become first-class concerns that the team must design and operate.",
  whenToUse: [
    "Organizations with multiple independent product teams that need to ship and deploy to production without coordinating release schedules",
    "Systems where individual bounded contexts have dramatically different scaling, performance, or technology requirements",
    "Mature domains with stable, well-understood bounded context boundaries that are unlikely to shift significantly",
    "Products where different parts of the system require different deployment frequencies, availability SLAs, or compliance boundaries",
  ],
  avoidWhen: [
    "Early-stage products where domain boundaries are still being discovered and premature decomposition leads to incorrect service splits that are expensive to correct",
    "Small teams where the operational overhead of running, monitoring, and deploying multiple services outweighs the autonomy benefits",
    "Domains where the cost of distributed transactions and eventual consistency is higher than the cost of a well-structured monolith with module boundaries",
  ],
  realWorldExamples: [
    {
      name: "Modular monolith to microservices migration path",
      detail:
        "Teams start with a NestJS modular monolith and enforce strict module boundaries; once a bounded context is stable and its interface is proven, it is extracted into a standalone service by promoting the module interface to a network API.",
    },
    {
      name: "NestJS microservices with transport layers",
      detail:
        "NestJS supports multiple transports — Kafka, RabbitMQ, Redis, gRPC, TCP — through the @nestjs/microservices package; each service runs as a separate Node.js process with its own database and deployment pipeline.",
    },
    {
      name: "E-commerce platform decomposition",
      detail:
        "An online store decomposes into catalog, inventory, pricing, checkout, order management, and notification services; each team owns one service end-to-end from database schema to deployment infrastructure.",
    },
    {
      name: "Kubernetes-orchestrated service mesh",
      detail:
        "Services deploy as independent Kubernetes pods with separate resource limits, autoscaling policies, and health probes; Istio or Linkerd handle mTLS, load balancing, and circuit breaking at the infrastructure layer.",
    },
  ],
  codeExamples: [
    {
      filename: "src/main.ts",
      language: "ts",
      description:
        "NestJS microservice bootstrapping: the service starts both an HTTP server for REST endpoints and a Kafka microservice listener, making it an independent deployable unit.",
      code: `import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { InventoryModule } from "./inventory.module";

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: "inventory-service",
        brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"],
      },
      consumer: {
        groupId: "inventory-consumer-group",
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();`,
    },
    {
      filename: "src/inventory/inventory.controller.ts",
      language: "ts",
      description:
        "A microservice controller handling both HTTP requests and async Kafka events. The service owns its inventory domain independently of any other service.",
      code: `import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { InventoryService } from "./inventory.service";

interface ReserveStockInput {
  productId: string;
  quantity: number;
}

interface OrderPlacedEventPayload {
  orderId: string;
  items: { productId: string; quantity: number }[];
}

@Controller("inventory")
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(":productId")
  async getStock(@Param("productId") productId: string) {
    const stock = await this.inventoryService.getAvailableStock(productId);
    return { productId, availableQuantity: stock.availableQuantity };
  }

  @Post("reserve")
  async reserveStock(@Body() input: ReserveStockInput) {
    await this.inventoryService.reserveStock(input.productId, input.quantity);
    return { success: true };
  }

  @EventPattern("orders.placed")
  async handleOrderPlaced(
    @Payload() payload: OrderPlacedEventPayload,
  ): Promise<void> {
    for (const item of payload.items) {
      await this.inventoryService.confirmReservation(
        item.productId,
        item.quantity,
        payload.orderId,
      );
    }
  }
}`,
    },
  ],
  pros: [
    "Independent deployability eliminates cross-team coordination for releases and enables faster delivery cycles",
    "Each service can be scaled, replicated, and allocated resources based on its own load profile independently",
    "Technology heterogeneity is possible: different services can use different databases, languages, or runtimes when justified",
  ],
  cons: [
    "Distributed systems introduce network failures, partial availability, and eventual consistency that a monolith never has to manage",
    "Service boundaries that are wrong are expensive to fix: cross-service data joins and distributed transactions signal a misaligned decomposition",
    "Operational complexity increases significantly: each service needs its own CI/CD pipeline, monitoring, logging, and on-call runbook",
  ],
};
