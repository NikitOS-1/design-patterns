import { Pattern } from "@/lib/types";

export const sagaPattern: Pattern = {
  slug: "saga-pattern",
  category: "architecture",
  code: "A-19",
  name: "Saga Pattern",
  oneLiner:
    "Coordinate multi-step distributed transactions through a sequence of local transactions and compensating actions that undo completed steps on failure.",
  problem:
    "Distributed systems cannot use traditional ACID database transactions across service boundaries. When a checkout flow spans an order service, a payment service, and an inventory service, there is no distributed transaction manager that can atomically commit or roll back all three. If payment succeeds but inventory reservation fails, the system is left in an inconsistent state: the customer was charged but no stock was reserved. Naively calling each service in sequence without a recovery strategy leads to stuck orders, orphaned payment authorizations, and inventory counts that do not match reality. As the number of steps grows, the probability of partial failure increases and the surface area of inconsistency expands.",
  solution:
    "Model the multi-step business transaction as a saga: a sequence of local transactions, each within a single service's own database, connected by domain events or explicit messages. Every step in the saga has a corresponding compensating transaction that undoes its effect if a later step fails. There are two implementation styles. In the choreography approach, each service publishes an event after completing its step; other services subscribe to those events and execute their steps independently. There is no central coordinator — the saga progresses through implicit event chains. In the orchestration approach, a dedicated saga orchestrator holds the entire workflow state: it sends commands to each service in order, waits for success or failure responses, and issues compensating commands if any step fails. Orchestration is easier to visualize, monitor, and debug because the entire workflow lives in one place. NestJS sagas, using the @Saga decorator from @nestjs/cqrs, implement orchestration using RxJS observable pipelines that react to domain events and emit follow-up commands.",
  whenToUse: [
    "Multi-step business workflows spanning multiple services or bounded contexts where each step must be undoable if a later step fails",
    "E-commerce checkout, travel booking, financial transfer, and similar flows that touch inventory, payments, and notifications in sequence",
    "Systems using event-driven architecture where services must coordinate without shared databases or distributed transactions",
    "Teams that need observable, debuggable long-running workflows with explicit compensating actions modeled in code",
  ],
  avoidWhen: [
    "Simple workflows within a single service where a local database transaction provides full ACID guarantees without saga complexity",
    "Teams that have not yet established reliable event delivery and idempotent message processing — sagas require these foundations to work correctly",
    "Domains where the business accepts strong coupling through synchronous orchestration and eventual consistency is not acceptable to stakeholders",
  ],
  realWorldExamples: [
    {
      name: "E-commerce checkout saga",
      detail:
        "Steps: reserve inventory → authorize payment → confirm order → release inventory reservation on failure or refund payment on fulfilment failure; each compensating action is a reverse command sent to the corresponding service.",
    },
    {
      name: "NestJS @Saga with @nestjs/cqrs",
      detail:
        "The @Saga decorator on a service method receives a stream of domain events and returns an Observable of commands; the CqrsModule dispatches those commands automatically, making orchestration declarative.",
    },
    {
      name: "Bank transfer across accounts",
      detail:
        "DebitSourceAccount → CreditTargetAccount → NotifyBothParties; if CreditTargetAccount fails, a CreditSourceAccountCompensation command reverses the debit, maintaining overall consistency across two account contexts.",
    },
    {
      name: "Travel booking with multiple external APIs",
      detail:
        "Flight reservation, hotel booking, and car rental are booked in sequence; a failure at any step triggers cancellation commands to all previously confirmed services, with each external API adapter implementing a cancel endpoint.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/checkout/sagas/checkout.saga.ts",
      language: "ts",
      description:
        "NestJS orchestration saga using @Saga from @nestjs/cqrs: reacts to OrderPlacedEvent and emits a ReserveInventoryCommand to start the next step in the workflow.",
      code: `import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { Observable, map, catchError, EMPTY } from "rxjs";
import { OrderPlacedEvent } from "../../orders/events/order-placed.event";
import { ReserveInventoryCommand } from "../../inventory/commands/reserve-inventory.command";
import { CancelOrderCommand } from "../../orders/commands/cancel-order.command";

@Injectable()
export class CheckoutSaga {
  @Saga()
  checkoutFlow(events$: Observable<unknown>): Observable<ICommand> {
    return events$.pipe(
      ofType(OrderPlacedEvent),
      map(
        (event: OrderPlacedEvent) =>
          new ReserveInventoryCommand(
            event.orderId,
            event.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            }))
          )
      )
    );
  }

  @Saga()
  inventoryReservationFailed(events$: Observable<unknown>): Observable<ICommand> {
    return events$.pipe(
      ofType(InventoryReservationFailedEvent),
      map(
        (event: InventoryReservationFailedEvent) =>
          new CancelOrderCommand(event.orderId, "inventory_unavailable")
      ),
      catchError(() => EMPTY)
    );
  }
}`,
    },
    {
      filename: "src/modules/checkout/sagas/compensations.ts",
      language: "ts",
      description:
        "Compensating command handlers: each reverses the effect of a completed step when a downstream failure requires rollback of the overall saga.",
      code: `import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../../orders/domain/order.entity";
import { PaymentService } from "../../payments/payment.service";

export class CancelOrderCommand {
  constructor(
    readonly orderId: string,
    readonly cancellationReason: string,
  ) {}
}

export class RefundPaymentCommand {
  constructor(
    readonly orderId: string,
    readonly providerTransactionId: string,
  ) {}
}

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async execute(command: CancelOrderCommand): Promise<void> {
    await this.orderRepository.update(
      { orderId: command.orderId },
      { status: "cancelled", cancellationReason: command.cancellationReason }
    );
  }
}

@CommandHandler(RefundPaymentCommand)
export class RefundPaymentHandler
  implements ICommandHandler<RefundPaymentCommand>
{
  constructor(private readonly paymentService: PaymentService) {}

  async execute(command: RefundPaymentCommand): Promise<void> {
    await this.paymentService.refund({
      orderId: command.orderId,
      providerTransactionId: command.providerTransactionId,
    });
  }
}`,
    },
  ],
  pros: [
    "Provides a structured model for distributed consistency without requiring distributed transactions or two-phase commit protocols",
    "Orchestrated sagas make the full workflow visible in one place, simplifying monitoring, debugging, and business process documentation",
    "Compensating transactions explicitly model the business meaning of rollback rather than relying on generic database rollbacks",
  ],
  cons: [
    "Compensating transactions must be designed, implemented, and tested for every step, significantly increasing development surface area",
    "Eventual consistency between steps means the system is temporarily in an intermediate state that may be visible to users",
    "Choreography sagas without a central coordinator are difficult to visualize, monitor, and debug as event chains grow in complexity",
  ],
};
