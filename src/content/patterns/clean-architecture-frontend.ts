import { Pattern } from "@/lib/types";

export const cleanArchitectureFrontend: Pattern = {
  slug: "clean-architecture-frontend",
  category: "architecture",
  code: "A-08",
  name: "Clean Architecture (Frontend)",
  oneLiner:
    "Protect domain and application logic from UI frameworks and infrastructure by pointing all dependencies inward toward a framework-agnostic core.",
  problem:
    "Frontend applications frequently entangle business rules with React component trees, Next.js route handlers, and third-party SDK calls. When the UI library changes, business logic must be rewritten alongside it. When an API contract shifts, the change ripples through components that should have no knowledge of transport. Validation rules get duplicated across form components and API handlers. Testing business flows requires mounting full component trees or mocking HTTP at the network level, making unit tests slow, brittle, and expensive to maintain. The fundamental problem is that the application's most valuable knowledge — the rules that define what the product does — is scattered across UI and infrastructure concerns that change for unrelated reasons.",
  solution:
    "Clean Architecture organizes code into concentric layers where the dependency rule is absolute: source code dependencies always point inward. The domain layer at the center holds entities and pure business rules with zero external dependencies — no React, no fetch, no Prisma. The application layer surrounds it with use cases that orchestrate domain logic and declare ports — TypeScript interfaces for repositories and gateways that the application needs but does not implement. The infrastructure layer provides concrete adapters that implement those ports: HTTP repositories that call an API, localStorage adapters, Stripe payment gateways. React and Next.js components live in the outermost UI layer and act as thin adapters that trigger use cases and render their results. Because use cases depend only on port interfaces and not on concrete implementations, the entire application layer is testable with pure TypeScript test doubles. The framework is a replaceable detail, not a structural anchor.",
  whenToUse: [
    "Applications with substantial domain logic — pricing engines, eligibility rules, workflow state machines — that must remain testable independently of the UI",
    "Long-lived products where framework migrations or API transport changes are plausible and should not require rewriting business rules",
    "Teams that want to write fast, deterministic unit tests for business flows without mounting React components or intercepting HTTP",
    "Codebases where multiple delivery mechanisms — web UI, API routes, CLI scripts — need to reuse the same application logic",
  ],
  avoidWhen: [
    "Short-lived MVPs and prototypes where the overhead of ports, use cases, and adapters slows delivery without payoff",
    "CRUD-heavy applications with minimal business logic where the domain layer would hold nothing meaningful",
    "Small teams unfamiliar with the pattern — half-applied Clean Architecture is harder to work in than no architecture at all",
  ],
  realWorldExamples: [
    {
      name: "Order placement use case",
      detail:
        "PlaceOrderUseCase depends on an OrderRepository port and a PaymentGateway port. The React checkout form calls it with user input. Tests inject fake implementations that return controlled results without any network or rendering overhead.",
    },
    {
      name: "Eligibility rule engine",
      detail:
        "Loan or insurance eligibility rules live as pure domain functions that take a structured input and return a typed decision. UI forms collect the input and pass it to a use case; the rules themselves are tested exhaustively with plain TypeScript.",
    },
    {
      name: "Multi-delivery application core",
      detail:
        "The same use cases power a Next.js server action, a REST API route, and a background job. Each delivery mechanism is a thin adapter that parses its input format and calls the same application layer.",
    },
    {
      name: "Analytics gateway swap",
      detail:
        "Switching from Segment to a self-hosted analytics backend requires only a new infrastructure adapter implementing the AnalyticsGateway port. No use case or UI component changes.",
    },
  ],
  codeExamples: [
    {
      filename: "src/domain/order/order.ts",
      language: "ts",
      description:
        "The domain layer: a pure entity with business invariants enforced through typed construction. Zero framework dependencies.",
      code: `export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface OrderLine {
  productId: string;
  quantity: number;
  unitPriceInCents: number;
}

export interface Order {
  orderId: string;
  userId: string;
  lines: OrderLine[];
  status: OrderStatus;
  totalInCents: number;
}

export function createOrder(input: {
  orderId: string;
  userId: string;
  lines: OrderLine[];
}): Order {
  if (input.lines.length === 0) {
    throw new Error("Order must contain at least one line");
  }

  const totalInCents = input.lines.reduce(
    (sum, line) => sum + line.quantity * line.unitPriceInCents,
    0
  );

  return {
    orderId: input.orderId,
    userId: input.userId,
    lines: input.lines,
    status: "pending",
    totalInCents,
  };
}`,
    },
    {
      filename: "src/application/order/placeOrderUseCase.ts",
      language: "ts",
      description:
        "The application layer: a use case that orchestrates domain logic using port interfaces. It has no knowledge of React, HTTP, or any concrete infrastructure.",
      code: `import { createOrder, Order, OrderLine } from "@/domain/order/order";

export interface OrderRepository {
  save(order: Order): Promise<void>;
}

export interface PaymentGateway {
  authorize(input: {
    userId: string;
    amountInCents: number;
  }): Promise<{ paymentIntentId: string }>;
}

export interface OrderIdFactory {
  create(): string;
}

export interface PlaceOrderInput {
  userId: string;
  lines: OrderLine[];
}

export interface PlaceOrderOutput {
  orderId: string;
  totalInCents: number;
  paymentIntentId: string;
}

export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly orderIdFactory: OrderIdFactory
  ) {}

  async execute(input: PlaceOrderInput): Promise<PlaceOrderOutput> {
    const order = createOrder({
      orderId: this.orderIdFactory.create(),
      userId: input.userId,
      lines: input.lines,
    });

    const { paymentIntentId } = await this.paymentGateway.authorize({
      userId: input.userId,
      amountInCents: order.totalInCents,
    });

    await this.orderRepository.save(order);

    return {
      orderId: order.orderId,
      totalInCents: order.totalInCents,
      paymentIntentId,
    };
  }
}`,
    },
    {
      filename: "src/infrastructure/order/httpOrderRepository.ts",
      language: "ts",
      description:
        "An infrastructure adapter implementing the OrderRepository port. The application layer never imports this — it is injected at the composition root.",
      code: `import { Order } from "@/domain/order/order";
import { OrderRepository } from "@/application/order/placeOrderUseCase";
import { apiClient } from "@/shared/infrastructure/apiClient";

export class HttpOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    await apiClient.post("/orders", {
      orderId: order.orderId,
      userId: order.userId,
      lines: order.lines,
      totalInCents: order.totalInCents,
    });
  }
}`,
    },
  ],
  pros: [
    "Domain and application logic is fully testable without React, HTTP, or browser APIs — tests run in milliseconds",
    "Framework and infrastructure changes are isolated to the outermost layer and do not touch business rules",
    "Port interfaces make every external dependency explicit, auditable, and replaceable with a different adapter",
  ],
  cons: [
    "Significant upfront investment in ports, use cases, and adapters that is only justified when business logic is substantial",
    "Teams unfamiliar with the dependency inversion principle often misplace responsibilities, defeating the structure",
    "More indirection than simpler architectures makes tracing a request through the system harder for new engineers",
  ],
};
