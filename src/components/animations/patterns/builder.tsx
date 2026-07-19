"use client";

import { AnimStage, Node, Wire, Highlight, Tag } from "../_kit";

/** Assemble a complex object step by step, then build(). */
export function BuilderAnim() {
  const steps = [
    { label: ".base()", x: 10 },
    { label: ".add()", x: 78 },
    { label: ".opts()", x: 146 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Chained steps configure the object one part at a time, then build() returns it."
      captionUk="Ланцюжок кроків налаштовує обʼєкт частина за частиною, а build() повертає результат."
    >
      {steps.map((s, i) => (
        <g key={s.label}>
          <Node x={s.x} y={54} w={60} h={30} label={s.label} tone="teal" />
          <Highlight x={s.x} y={54} w={60} h={30} delay={-i * 1.1} dur={4.4} />
          {i < steps.length - 1 && <Wire tone="ink" d={`M ${s.x + 60} 69 L ${s.x + 68} 69`} />}
        </g>
      ))}

      <Wire tone="amber" d="M 206 69 L 226 69" />
      <Node x={228} y={50} w={62} h={38} label="Product" sub="build()" tone="amber" />

      <Tag x={40} y={44} tone="ink" anchor="start">
        step 1
      </Tag>
      <Tag x={176} y={44} tone="ink" anchor="middle">
        step n
      </Tag>
    </AnimStage>
  );
}
