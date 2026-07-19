"use client";

import { AnimStage, Node, Wire, Highlight, Tag } from "../_kit";

/** Choose a factory, get a whole matching family of products. */
export function AbstractFactoryAnim() {
  // Two families; each factory yields a matching Button + Input.
  const families = [
    { name: "LightUI", y: 14, delay: 0 },
    { name: "DarkUI", y: 82, delay: -3 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Pick one factory and every part it builds belongs to the same matching family."
      captionUk="Обираєте одну фабрику — і всі її частини належать до однієї узгодженої родини."
    >
      {families.map((f) => (
        <g key={f.name}>
          <Node x={14} y={f.y + 8} w={64} h={34} label={f.name} tone="amber" />
          <Highlight x={14} y={f.y + 8} w={64} h={34} delay={f.delay} dur={6} />

          <Wire tone="teal" d={`M 78 ${f.y + 25} L 108 ${f.y + 12}`} />
          <Wire tone="teal" d={`M 78 ${f.y + 25} L 108 ${f.y + 40}`} />

          <Node x={110} y={f.y} w={60} h={24} label="Button" />
          <Node x={110} y={f.y + 28} w={60} h={24} label="Input" />
        </g>
      ))}

      <Tag x={222} y={74} tone="ink" anchor="middle">
        one family
      </Tag>
      <Tag x={222} y={86} tone="ink" anchor="middle">
        at a time
      </Tag>
    </AnimStage>
  );
}
