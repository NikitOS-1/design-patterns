import { Pattern } from "@/lib/types";

export const reactNestjsSeniorRoadmap: Pattern = {
  slug: "react-nestjs-senior-roadmap",
  category: "architecture-shared",
  code: "A-05",
  name: "React + NestJS Senior Roadmap",
  oneLiner:
    "Learn architecture in a sequence where each stage unlocks the next one, from code quality fundamentals to high-load system design.",
  problem:
    "Developers often study advanced backend and frontend topics out of order, which creates theory gaps and shallow implementation confidence. Without a staged roadmap, teams know many tools by name but cannot design reliable production systems end to end.",
  solution:
    "Use a progression from local code quality and architecture basics to distributed systems and high-load design. Build practical mini-projects per stage, keep architecture decisions explicit, and review trade-offs after each milestone. The sequence below aligns with what usually differentiates strong Middle and Senior engineers in React and NestJS environments.",
  whenToUse: [
    "Engineers planning a 6-12 month growth path from confident Middle to Senior level",
    "Teams creating internal mentorship tracks for React and NestJS developers",
    "Self-study plans that need clear milestone ordering and deliverables",
    "Interview preparation where architecture reasoning matters as much as implementation speed",
  ],
  avoidWhen: [
    "Expecting to complete all stages quickly without building production-like projects",
    "Treating roadmap topics as isolated checkboxes instead of connected system decisions",
    "Skipping fundamentals and starting directly from microservices and high-load tuning",
  ],
  realWorldExamples: [
    {
      name: "Product team mentorship ladders",
      detail:
        "Engineering managers use staged tracks covering architecture, reliability, and system design to standardize promotion expectations.",
    },
    {
      name: "Bootcamp-to-product transition plans",
      detail:
        "Developers move from framework basics to architecture and distributed systems through milestone projects with code reviews.",
    },
    {
      name: "Internal architecture guilds",
      detail:
        "Teams rotate study topics from module boundaries to event-driven integration and performance engineering with practical assignments.",
    },
    {
      name: "Interview prep pipelines",
      detail:
        "Candidates use roadmap sequencing to connect coding tasks, architecture decisions, and trade-off explanations in system design rounds.",
    },
  ],
  codeExamples: [
    {
      filename: "src/roadmap/reactNestjsGrowthPlan.ts",
      language: "ts",
      description:
        "A typed roadmap definition matching a practical progression from fundamentals to high-load architecture.",
      code: `export interface RoadmapStage {
  order: number;
  title: string;
  outcomes: string[];
}

export const reactNestjsGrowthPlan: RoadmapStage[] = [
  {
    order: 1,
    title: "SOLID and design patterns",
    outcomes: ["Readable module boundaries", "Reliable abstractions", "Predictable refactoring"],
  },
  {
    order: 2,
    title: "React architecture",
    outcomes: ["Feature ownership", "Scalable UI modules", "Server and client boundaries"],
  },
  {
    order: 3,
    title: "NestJS architecture",
    outcomes: ["Layered use cases", "Hexagonal boundaries", "Testable services"],
  },
  {
    order: 4,
    title: "REST and GraphQL",
    outcomes: ["Contract design", "Versioning strategy", "Frontend and backend alignment"],
  },
  {
    order: 5,
    title: "Authentication",
    outcomes: ["Session and token flows", "Authorization policies", "Security baseline"],
  },
  {
    order: 6,
    title: "Caching with Redis",
    outcomes: ["Latency reduction", "Cache invalidation strategy", "Read throughput scaling"],
  },
  {
    order: 7,
    title: "Message brokers",
    outcomes: ["Async workflows", "Retry and idempotency", "Backpressure handling"],
  },
  {
    order: 8,
    title: "Microservices",
    outcomes: ["Service boundaries", "Inter-service contracts", "Operational ownership"],
  },
  {
    order: 9,
    title: "System design",
    outcomes: ["Trade-off reasoning", "Capacity planning", "Fault tolerance"],
  },
  {
    order: 10,
    title: "High-load architecture",
    outcomes: ["Performance profiling", "Horizontal scaling", "Resilience under peak load"],
  },
];`,
    },
    {
      filename: "src/roadmap/createQuarterPlan.ts",
      language: "ts",
      description:
        "A helper that transforms roadmap stages into a quarter-based execution plan with explicit completion criteria.",
      code: `import { reactNestjsGrowthPlan } from "./reactNestjsGrowthPlan";

interface QuarterPlanItem {
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  stageTitle: string;
  completionCriteria: string;
}

export function createQuarterPlan(): QuarterPlanItem[] {
  return reactNestjsGrowthPlan.map((stage) => {
    const quarter: QuarterPlanItem["quarter"] =
      stage.order <= 3 ? "Q1" : stage.order <= 6 ? "Q2" : stage.order <= 8 ? "Q3" : "Q4";

    return {
      quarter,
      stageTitle: stage.title,
      completionCriteria: stage.outcomes.join(" | "),
    };
  });
}`,
    },
  ],
  pros: [
    "Creates a coherent learning path where each stage builds on previous architectural knowledge",
    "Improves practical depth by pairing topics with implementation outcomes",
    "Helps teams evaluate growth against concrete milestones instead of vague skill labels",
  ],
  cons: [
    "Requires sustained execution discipline over multiple quarters",
    "Topic timelines vary by project context and cannot be fully standardized",
    "Without real project practice, roadmap completion can become theoretical",
  ],
};
