"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Many contexts share a few intrinsic-state flyweights. */
export function FlyweightAnim() {
  const contexts = [
    { x: 12, y: 14 },
    { x: 62, y: 14 },
    { x: 12, y: 58 },
    { x: 62, y: 58 },
    { x: 12, y: 102 },
    { x: 62, y: 102 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Thousands of objects reference a handful of shared flyweights instead of each duplicating the same intrinsic state."
      captionUk="Тисячі обʼєктів посилаються на кілька спільних флайвейтів, замість того щоб кожен дублював той самий внутрішній стан."
    >
      {contexts.map((c, i) => {
        const cx = c.x + 20;
        const cy = c.y + 11;
        const target = i % 2 === 0 ? { x: 210, y: 47 } : { x: 210, y: 107 };
        return (
          <g key={i}>
            <Wire
              tone="ink"
              arrow={false}
              d={`M ${c.x + 40} ${cy} C 150 ${cy}, 170 ${target.y}, ${target.x} ${target.y}`}
            />
            <Node x={c.x} y={c.y} w={40} h={22} label="ctx" />
          </g>
        );
      })}

      <Node x={210} y={30} w={80} h={34} label="Sprite A" sub="shared" tone="amber" />
      <Node x={210} y={90} w={80} h={34} label="Sprite B" sub="shared" tone="teal" />
      <Tag x={40} y={144} tone="ink">
        many contexts
      </Tag>
    </AnimStage>
  );
}
