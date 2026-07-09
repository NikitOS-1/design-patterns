import { Pattern } from "@/lib/types";

export const domainDrivenDesign: Pattern = {
  slug: "domain-driven-design",
  category: "architecture",
  code: "A-20",
  name: "Domain-Driven Design",
  oneLiner:
    "Build software around a deep model of the business domain using ubiquitous language, bounded contexts, aggregates, and domain events as the primary design vocabulary.",
  problem:
    "Large software systems routinely fail not because of technology choices but because the software model drifts away from the actual business domain it represents. Technical teams build data models around database tables, not around business concepts. The word 'account' means something different in the billing module, the identity module, and the customer support module, but they share one database table with a confusingly combined schema. Business rules are scattered across service methods, database triggers, and frontend validation. When business experts and developers discuss a feature, they use different vocabulary, and the translation overhead produces requirements that misrepresent the actual intent. Systems become impossible to extend because the code does not reflect the domain structure that domain experts actually think in.",
  solution:
    "Apply Domain-Driven Design as a set of strategic and tactical patterns that bridge the gap between business complexity and code structure. At the strategic level, identify Bounded Contexts — cohesive parts of the domain where a specific model applies and has precise meaning. Within each context, establish a Ubiquitous Language: a shared vocabulary of terms that domain experts and developers use identically in conversation, documentation, and code. Define explicit Context Maps that describe how bounded contexts relate to each other: shared kernels, customer/supplier relationships, anticorruption layers, and conformist integrations. At the tactical level, model each bounded context around Aggregates — clusters of domain objects that are always kept consistent together, accessed through an Aggregate Root that enforces all invariants. Value Objects represent concepts with no identity — a Money type, an Email type — that are defined purely by their attributes and are always immutable. Domain Events express meaningful business occurrences in past tense: OrderPlaced, PaymentAuthorized, InventoryReserved. Repositories provide collection-like access to aggregates without exposing persistence details. Domain Services hold business logic that does not naturally belong to any single aggregate. DDD is the conceptual foundation that makes Clean Architecture, Hexagonal Architecture, CQRS, Event-Driven Architecture, Sagas, and Microservice decomposition all coherent: each of those patterns is a technique for implementing a well-modeled domain boundary.",
  whenToUse: [
    "Complex business domains with rich rules, invariants, and deep domain expert knowledge that must be accurately modeled in code",
    "Systems that will be maintained and extended over years where misaligned models become increasingly expensive to correct",
    "Organizations investing in microservices decomposition, where bounded contexts provide the principled basis for service boundaries",
    "Teams where knowledge transfer between domain experts and developers is a bottleneck and shared language would reduce translation overhead",
  ],
  avoidWhen: [
    "Data-centric CRUD applications with minimal business logic where aggregates and value objects add structure without capturing real domain complexity",
    "Short-lived projects or prototypes where the investment in deep domain modeling will not be amortized over the system's lifetime",
    "Teams without access to domain experts, where attempting DDD produces speculative models that do not reflect real business rules",
  ],
  realWorldExamples: [
    {
      name: "Bounded contexts as microservice boundaries",
      detail:
        "A Billing context, an Identity context, and a Fulfillment context each have their own definition of what a 'customer' is; microservices are aligned to these contexts so that service ownership maps to domain ownership, preventing cross-service coupling through shared data models.",
    },
    {
      name: "Aggregates with TypeScript invariant enforcement",
      detail:
        "An Order aggregate root controls all state transitions for itself and its OrderItems; no code outside the aggregate can directly modify item quantities or order status — all mutations go through the aggregate's methods which enforce business invariants before applying changes.",
    },
    {
      name: "Value objects for precise domain types",
      detail:
        "A Money value object encapsulates amount and currency together, making it impossible to accidentally add amounts in different currencies; an Email value object validates format on construction, eliminating primitive obsession across the codebase.",
    },
    {
      name: "Anticorruption layer between legacy and new contexts",
      detail:
        "When integrating with a legacy ERP system that uses its own terminology and data formats, an anticorruption layer translates ERP concepts into the current bounded context's ubiquitous language, preventing the legacy model from corrupting the new domain model.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/orders/domain/order.aggregate.ts",
      language: "ts",
      description:
        "An Order aggregate root: enforces business invariants, controls all state transitions, and produces domain events. No framework dependencies — pure domain TypeScript.",
      code: `import { Money } from "./money.value-object";
import { OrderItem } from "./order-item";
import { OrderStatus } from "./order-status";
import { OrderPlacedEvent } from "./events/order-placed.event";
import { OrderCancelledEvent } from "./events/order-cancelled.event";

interface CreateOrderProps {
  orderId: string;
  userId: string;
  items: { productId: string; quantity: number; unitPrice: Money }[];
}

export class Order {
  private readonly domainEvents: unknown[] = [];

  readonly orderId: string;
  readonly userId: string;
  private status: OrderStatus;
  private items: OrderItem[];
  private totalAmount: Money;

  private constructor(props: {
    orderId: string;
    userId: string;
    items: OrderItem[];
    totalAmount: Money;
    status: OrderStatus;
  }) {
    this.orderId = props.orderId;
    this.userId = props.userId;
    this.items = props.items;
    this.totalAmount = props.totalAmount;
    this.status = props.status;
  }

  static place(props: CreateOrderProps): Order {
    if (props.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    const orderItems = props.items.map(
      (item) => new OrderItem(item.productId, item.quantity, item.unitPrice)
    );

    const totalAmount = orderItems.reduce(
      (sum, item) => sum.add(item.subtotal()),
      Money.zero("USD")
    );

    const order = new Order({
      orderId: props.orderId,
      userId: props.userId,
      items: orderItems,
      totalAmount,
      status: OrderStatus.Pending,
    });

    order.domainEvents.push(
      new OrderPlacedEvent(props.orderId, props.userId, totalAmount)
    );

    return order;
  }

  cancel(reason: string): void {
    if (this.status !== OrderStatus.Pending) {
      throw new Error(
        \`Order \${this.orderId} cannot be cancelled in status \${this.status}\`
      );
    }

    this.status = OrderStatus.Cancelled;
    this.domainEvents.push(new OrderCancelledEvent(this.orderId, reason));
  }

  pullDomainEvents(): unknown[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getTotalAmount(): Money {
    return this.totalAmount;
  }
}`,
    },
    {
      filename: "src/modules/orders/domain/money.value-object.ts",
      language: "ts",
      description:
        "A Money value object: immutable, self-validating, and precise. Eliminates primitive obsession across the codebase and makes currency arithmetic type-safe.",
      code: `export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {
    if (amount < 0) {
      throw new Error("Money amount cannot be negative");
    }
    if (currency.length !== 3) {
      throw new Error("Currency must be a 3-letter ISO code");
    }
  }

  static of(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  static zero(currency: string): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(
        \`Cannot add \${this.currency} and \${other.currency}: currency mismatch\`
      );
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error("Money multiplication factor cannot be negative");
    }
    return new Money(this.amount * factor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error("Cannot compare amounts in different currencies");
    }
    return this.amount > other.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  toString(): string {
    return \`\${this.amount.toFixed(2)} \${this.currency}\`;
  }
}`,
    },
  ],
  pros: [
    "Produces a codebase where naming, structure, and logic reflect the actual business domain, dramatically reducing the translation cost between developers and domain experts",
    "Bounded contexts provide the principled foundation for microservice decomposition, CQRS projections, saga boundaries, and event-driven integrations",
    "Aggregates with enforced invariants centralize business rules, making them consistently testable and preventing invalid state from ever being persisted",
  ],
  cons: [
    "Requires sustained investment in domain discovery and close collaboration with business stakeholders — it is not a purely technical exercise",
    "Tactical patterns like aggregates and value objects add significant boilerplate compared with direct ORM entity mapping",
    "Bounded context boundaries that are drawn incorrectly are expensive to correct and can be worse than a simpler model without DDD structure",
  ],
};
