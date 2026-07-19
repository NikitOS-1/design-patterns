"use client";

import { AnimStage, Node, Tag } from "../_kit";

/** Code grouped by feature; each folder owns ui, api, and model. */
export function FeatureBasedArchitectureAnim() {
  const features = [
    { name: "auth", x: 14 },
    { name: "cart", x: 108 },
    { name: "profile", x: 202 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Code is grouped by feature — each folder owns its own ui, api, and model, end to end."
      captionUk="Код згруповано за фічами — кожна тека володіє власними ui, api та model від початку до кінця."
    >
      {features.map((f) => (
        <g key={f.name}>
          <rect x={f.x} y={14} width={84} height={120} rx={4} fill="#0B0E14" stroke="#3A4155" strokeWidth={1.5} />
          <Tag x={f.x + 42} y={30} tone="amber">
            {f.name}/
          </Tag>
          <Node x={f.x + 8} y={38} w={68} h={22} label="ui" tone="teal" />
          <Node x={f.x + 8} y={68} w={68} h={22} label="api" />
          <Node x={f.x + 8} y={98} w={68} h={22} label="model" />
        </g>
      ))}
    </AnimStage>
  );
}
