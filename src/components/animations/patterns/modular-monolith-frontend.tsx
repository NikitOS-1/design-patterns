"use client";

import { AnimStage, Node, Band, Wire, Tag } from "../_kit";

/** One deployable app split into bounded modules over a shared kernel. */
export function ModularMonolithFrontendAnim() {
  const mods = [
    { label: "Orders", x: 24 },
    { label: "Billing", x: 114 },
    { label: "Users", x: 204 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 160"
      captionEn="One deployable app, split into modules with clear boundaries over a shared kernel."
      captionUk="Один застосунок для деплою, поділений на модулі з чіткими межами над спільним ядром."
    >
      <rect x={10} y={12} width={280} height={136} rx={4} fill="#0B0E14" stroke="#F5A623" strokeWidth={1.5} />
      <Tag x={20} y={27} tone="amber" anchor="start">
        App
      </Tag>

      {mods.map((m) => (
        <g key={m.label}>
          <Node x={m.x} y={34} w={72} h={48} label={m.label} sub="module" />
          <Wire tone="ink" flow={false} d={`M ${m.x + 36} 82 L ${m.x + 36} 100`} />
        </g>
      ))}
      <Band x={24} y={100} w={252} h={30} label="Shared kernel" right="ui · utils" tone="teal" />
    </AnimStage>
  );
}
