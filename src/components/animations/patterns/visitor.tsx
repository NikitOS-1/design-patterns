"use client";

import { AnimStage, Node, Wire, Packet, Tag } from "../_kit";

/** A visitor carries a new operation to each element type. */
export function VisitorAnim() {
  const elements = [
    { label: "ElementA", y: 14 },
    { label: "ElementB", y: 60 },
    { label: "ElementC", y: 106 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="A visitor brings a new operation to each element type, leaving the elements themselves unchanged."
      captionUk="Відвідувач приносить нову операцію до кожного типу елемента, не змінюючи самі елементи."
    >
      <Node x={12} y={54} w={70} h={42} label="Visitor" sub="visit()" tone="amber" />
      <Tag x={150} y={40} tone="teal">
        visit each
      </Tag>

      {elements.map((el, i) => {
        const d = `M 82 75 C 130 75, 150 ${el.y + 13}, 206 ${el.y + 13}`;
        return (
          <g key={el.label}>
            <Wire tone="ink" d={d} />
            <Packet path={d} tone="teal" dur={1.8} delay={i * 0.5} />
            <Node x={208} y={el.y} w={80} h={26} label={el.label} />
          </g>
        );
      })}
    </AnimStage>
  );
}
