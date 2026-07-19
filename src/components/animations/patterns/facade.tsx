"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** One simple entry point orchestrates several messy subsystems. */
export function FacadeAnim() {
  const subs = [
    { label: "Auth", y: 14 },
    { label: "Payment", y: 60 },
    { label: "Inventory", y: 106 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The facade exposes one simple call and coordinates the tangled subsystems behind it."
      captionUk="Фасад надає один простий виклик і координує заплутані підсистеми за ним."
    >
      <Node x={10} y={56} w={56} h={34} label="Client" sub="one call" />
      <Wire tone="teal" d="M 66 73 L 100 73" />
      <Node x={102} y={52} w={68} h={42} label="Facade" sub="order()" tone="amber" />

      {subs.map((s, i) => (
        <g key={s.label}>
          <Wire tone="ink" d={`M 170 73 C 194 73, 200 ${s.y + 13}, 218 ${s.y + 13}`} />
          <Node x={220} y={s.y} w={72} h={26} label={s.label} />
        </g>
      ))}
      <Tag x={205} y={140} tone="ink">
        subsystems
      </Tag>
    </AnimStage>
  );
}
