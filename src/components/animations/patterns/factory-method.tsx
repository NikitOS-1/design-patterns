"use client";

import { AnimStage, Node, Wire, Highlight, Tag } from "../_kit";

/** Client asks a factory; the factory picks which concrete product to build. */
export function FactoryMethodAnim() {
  const products = [
    { label: "ButtonA", y: 18 },
    { label: "ButtonB", y: 60 },
    { label: "ButtonC", y: 102 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The client calls create(); the factory decides which concrete product to return."
      captionUk="Клієнт викликає create(); фабрика вирішує, який конкретний продукт повернути."
    >
      <Node x={12} y={58} w={58} h={30} label="Client" />
      <Wire tone="teal" d="M 70 73 L 108 73" />

      <Node x={110} y={54} w={70} h={38} label="Factory" sub="create()" tone="amber" />

      {products.map((p, i) => (
        <g key={p.label}>
          <Wire
            tone="ink"
            d={`M 180 73 C 206 73, 214 ${p.y + 13}, 232 ${p.y + 13}`}
          />
          <Node x={234} y={p.y} w={58} h={26} label={p.label} />
          <Highlight x={234} y={p.y} w={58} h={26} delay={-i * 1.4} dur={4.2} />
        </g>
      ))}

      <Tag x={207} y={12} tone="ink">
        one of…
      </Tag>
    </AnimStage>
  );
}
