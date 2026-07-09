import { Pattern } from "@/lib/types";

export const repositoryPattern: Pattern = {
  slug: "repository-pattern",
  category: "structural",
  code: "S-08",
  name: "Repository Pattern",
  oneLiner:
    "Hide persistence and transport details behind a repository contract so business logic works with domain objects, not storage mechanics.",
  problem:
    "When use-case logic queries databases or REST endpoints directly, persistence concerns leak into business rules. Every schema change, pagination detail, or API contract update spreads across service code and tests, which makes refactoring expensive and tightly couples the domain to one storage technology.",
  solution:
    "Define repository interfaces around domain needs and provide infrastructure implementations per data source. Use cases depend only on repository contracts and work with normalized domain entities. This keeps business logic stable while database clients, query builders, or HTTP APIs can evolve independently.",
  whenToUse: [
    "Domain-heavy modules where business rules should not depend on ORM or HTTP details",
    "Systems that may switch storage providers or split read and write data flows over time",
    "Codebases requiring isolated use-case tests without real databases",
    "Backends where each bounded context has clear aggregate roots and entity lifecycle rules",
  ],
  avoidWhen: [
    "Simple CRUD endpoints where direct ORM usage is sufficient and easier to read",
    "Teams that introduce repositories but mirror every ORM method one-to-one",
    "Tiny services where abstraction overhead outweighs flexibility benefits",
  ],
  realWorldExamples: [
    {
      name: "NestJS domain modules",
      detail:
        "Application services depend on repository interfaces while TypeORM, Prisma, or SQL adapters provide concrete implementations.",
    },
    {
      name: "DDD-oriented modular monoliths",
      detail:
        "Each bounded context exposes repositories for aggregates so use cases are isolated from persistence implementation details.",
    },
    {
      name: "React server actions with data gateways",
      detail:
        "Server-side business flows call repository abstractions while adapters fetch from internal APIs or databases depending on deployment topology.",
    },
    {
      name: "Testing without infrastructure bootstrapping",
      detail:
        "In-memory repository fakes let teams verify business invariants fast without Dockerized dependencies.",
    },
  ],
  codeExamples: [
    {
      filename: "src/modules/payments/domain/paymentRepository.ts",
      language: "ts",
      description:
        "A domain-focused repository contract and use case that stays independent from persistence technology.",
      code: `export interface Payment {
  paymentId: string;
  userId: string;
  amount: number;
  status: "pending" | "authorized" | "captured" | "failed";
}

export interface PaymentRepository {
  findById(paymentId: string): Promise<Payment | null>;
  save(payment: Payment): Promise<void>;
}

interface AuthorizePaymentInput {
  paymentId: string;
  userId: string;
  amount: number;
}

export async function authorizePayment(
  input: AuthorizePaymentInput,
  dependencies: { paymentRepository: PaymentRepository }
) {
  const existingPayment = await dependencies.paymentRepository.findById(input.paymentId);
  if (existingPayment) {
    throw new Error("Payment already exists");
  }

  const payment: Payment = {
    paymentId: input.paymentId,
    userId: input.userId,
    amount: input.amount,
    status: "authorized",
  };

  await dependencies.paymentRepository.save(payment);
  return payment;
}`,
    },
    {
      filename: "src/modules/payments/infrastructure/postgresPaymentRepository.ts",
      language: "ts",
      description:
        "PostgreSQL implementation of the repository contract that maps raw records into domain entities.",
      code: `import { Kysely } from "kysely";
import { Payment, PaymentRepository } from "@/modules/payments/domain/paymentRepository";

interface Database {
  payments: {
    payment_id: string;
    user_id: string;
    amount: number;
    status: "pending" | "authorized" | "captured" | "failed";
  };
}

export function createPostgresPaymentRepository(db: Kysely<Database>): PaymentRepository {
  return {
    async findById(paymentId) {
      const row = await db
        .selectFrom("payments")
        .selectAll()
        .where("payment_id", "=", paymentId)
        .executeTakeFirst();

      if (!row) {
        return null;
      }

      return {
        paymentId: row.payment_id,
        userId: row.user_id,
        amount: row.amount,
        status: row.status,
      };
    },
    async save(payment) {
      await db
        .insertInto("payments")
        .values({
          payment_id: payment.paymentId,
          user_id: payment.userId,
          amount: payment.amount,
          status: payment.status,
        })
        .execute();
    },
  };
}`,
    },
  ],
  pros: [
    "Keeps business logic decoupled from database and transport implementation details",
    "Makes domain-level testing faster with repository fakes and stubs",
    "Supports long-term infrastructure changes without rewriting use-case logic",
  ],
  cons: [
    "Adds abstraction layers that can be unnecessary for small CRUD services",
    "Poorly designed contracts can become generic pass-through wrappers",
    "Requires strict module boundaries to prevent direct ORM leakage",
  ],
};
