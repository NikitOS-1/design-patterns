import { Pattern } from "@/lib/types";

export const bffApiGateway: Pattern = {
  slug: "bff-api-gateway",
  category: "architecture-backend",
  code: "A-18",
  name: "BFF + API Gateway",
  oneLiner:
    "Place an API Gateway in front of your service mesh for cross-cutting concerns, and deploy Backend-for-Frontend services to serve client-specific API contracts.",
  problem:
    "As a product grows to serve multiple clients — a web application, a mobile app, a third-party integration API — the downstream services start accumulating client-specific logic. Services add fields to responses that only the mobile app needs, create specialized endpoints for web dashboard aggregations, and build authentication flows tailored to specific client capabilities. Alternatively, clients make many parallel requests to assemble a single screen, driving up mobile data usage and request waterfalls. Cross-cutting concerns such as rate limiting, authentication verification, request logging, and SSL termination are re-implemented in every service. The result is that service APIs become unstable because client requirements change more frequently than domain logic, and every client change risks breaking other clients sharing the same endpoint.",
  solution:
    "Separate two distinct responsibilities that are often conflated. An API Gateway sits at the infrastructure edge and handles concerns that are uniform across all traffic: SSL termination, authentication token verification, rate limiting, request routing, and request correlation ID injection. The Gateway does not contain business logic — it is a transparent reverse proxy with policy enforcement. A Backend-for-Frontend is a backend service purpose-built for one specific client: the web BFF aggregates and shapes data from multiple downstream services into the exact response shape the web React application needs; the mobile BFF does the same for the mobile app, potentially with different field selection, pagination strategies, and authentication flows. Each BFF owns its API contract independently. Changes to the mobile experience do not require touching the web BFF, and neither BFF touches the underlying domain services. In Next.js projects, Server Actions and Route Handlers commonly act as a BFF layer, compositing data from internal APIs before delivering it to the browser.",
  whenToUse: [
    "Products serving multiple distinct clients — web, mobile, and third-party — that need different response shapes and API contracts from the same underlying services",
    "Microservice ecosystems where clients should not orchestrate multi-service fetches directly and need an aggregation layer",
    "Teams where cross-cutting concerns like authentication and rate limiting must be enforced consistently at the edge without duplicating code in every service",
    "Next.js applications where server components and route handlers act as a natural BFF that composites upstream API data for the browser client",
  ],
  avoidWhen: [
    "Simple monolithic APIs with a single client where introducing a gateway and BFF layer adds deployment and maintenance overhead without benefit",
    "Early-stage products where client requirements are unstable and building separate BFFs per client creates churn before boundaries are understood",
    "Teams without the operational capacity to maintain and monitor the additional services that the gateway and BFF pattern introduce",
  ],
  realWorldExamples: [
    {
      name: "Next.js as a web BFF",
      detail:
        "Next.js Route Handlers and Server Components act as the web BFF: server-side code aggregates data from internal microservices, applies user-specific transformations, and returns precisely shaped props to React Server Components without exposing raw service APIs to the browser.",
    },
    {
      name: "AWS API Gateway with Lambda integrations",
      detail:
        "API Gateway handles authentication via Cognito authorizers, rate limiting, and request routing; separate Lambda functions implement BFF logic for the web console and the mobile API, each querying the same downstream DynamoDB tables but shaping results differently.",
    },
    {
      name: "NestJS API Gateway with downstream microservice clients",
      detail:
        "A dedicated NestJS application acts as the gateway and BFF simultaneously: it validates JWTs, applies rate limiting via @nestjs/throttler, and composes responses from downstream order, user, and inventory microservices using NestJS ClientProxy calls.",
    },
    {
      name: "GraphQL BFF for flexible client queries",
      detail:
        "A GraphQL server acts as a BFF: it exposes a single typed schema to clients, resolves fields from multiple REST microservices, and lets web and mobile clients query exactly the fields they need without the server changing.",
    },
  ],
  codeExamples: [
    {
      filename: "src/gateway/middleware/auth.middleware.ts",
      language: "ts",
      description:
        "API Gateway authentication middleware: verifies JWTs and attaches the decoded identity to the request. This runs once at the edge for all downstream routes.",
      code: `import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";

interface AuthenticatedRequest extends Request {
  authenticatedUserId?: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid authorization header");
    }

    const token = authorizationHeader.slice(7);

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    req.authenticatedUserId = payload.sub;
    next();
  }
}`,
    },
    {
      filename: "src/bff/web/dashboard/dashboard.controller.ts",
      language: "ts",
      description:
        "Web BFF controller: aggregates data from multiple downstream microservices and returns a composite response shaped specifically for the web dashboard. No business logic — pure composition and projection.",
      code: `import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { OrdersClient } from "../../clients/orders.client";
import { NotificationsClient } from "../../clients/notifications.client";
import { UserProfileClient } from "../../clients/user-profile.client";

interface AuthenticatedRequest extends Request {
  authenticatedUserId: string;
}

interface DashboardResponse {
  user: {
    userId: string;
    displayName: string;
    avatarUrl: string | null;
  };
  recentOrders: {
    orderId: string;
    totalAmount: number;
    status: string;
    placedAt: string;
  }[];
  unreadNotificationCount: number;
}

@Controller("bff/web/dashboard")
export class DashboardController {
  constructor(
    private readonly ordersClient: OrdersClient,
    private readonly notificationsClient: NotificationsClient,
    private readonly userProfileClient: UserProfileClient,
  ) {}

  @Get()
  async getDashboard(
    @Req() req: AuthenticatedRequest,
  ): Promise<DashboardResponse> {
    const userId = req.authenticatedUserId;

    const [userProfile, recentOrders, unreadCount] = await Promise.all([
      this.userProfileClient.getProfile(userId),
      this.ordersClient.getRecentOrders(userId, { limit: 5 }),
      this.notificationsClient.getUnreadCount(userId),
    ]);

    return {
      user: {
        userId: userProfile.userId,
        displayName: userProfile.displayName,
        avatarUrl: userProfile.avatarUrl,
      },
      recentOrders: recentOrders.map((order) => ({
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        status: order.status,
        placedAt: order.placedAt.toISOString(),
      })),
      unreadNotificationCount: unreadCount,
    };
  }
}`,
    },
  ],
  pros: [
    "Cross-cutting concerns are enforced once at the gateway rather than duplicated in every service",
    "Each BFF can evolve its API contract independently to match the needs of its specific client without impacting other clients",
    "Eliminates frontend request waterfalls by moving multi-service aggregation to the server side",
  ],
  cons: [
    "Adds deployment and operational complexity: the gateway and each BFF are separate services requiring their own infrastructure",
    "BFFs can accumulate business logic over time, becoming mini-monoliths that couple client requirements with domain rules",
    "Maintaining multiple BFFs for different clients means duplicating some composition and transformation logic across each",
  ],
};
