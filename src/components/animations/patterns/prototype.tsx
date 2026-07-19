"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Clone an existing configured object instead of building from scratch. */
export function PrototypeAnim() {
  const clones = [
    { y: 12, delay: 0 },
    { y: 58, delay: -1.2 },
    { y: 104, delay: -2.4 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="clone() copies a ready-made prototype — new objects start fully configured."
      captionUk="clone() копіює готовий прототип — нові обʼєкти одразу повністю налаштовані."
    >
      <Node x={16} y={56} w={78} h={38} label="Prototype" sub="configured" tone="amber" />
      <Tag x={140} y={30} tone="teal">
        clone()
      </Tag>

      {clones.map((c, i) => (
        <g key={i}>
          <Wire tone="teal" d={`M 94 75 C 130 75, 150 ${c.y + 13}, 196 ${c.y + 13}`} />
          <g className="pa-spawn" style={{ animationDelay: `${c.delay}s` }}>
            <Node x={198} y={c.y} w={72} h={26} label="Copy" tone="ink" />
          </g>
        </g>
      ))}
    </AnimStage>
  );
}
