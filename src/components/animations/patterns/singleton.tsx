"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Many clients, one shared instance: every call resolves to the same object. */
export function SingletonAnim() {
  const clients = [22, 58, 94];
  const instX = 196;
  const instY = 52;
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Every client calls getInstance() — all references resolve to the one shared instance."
      captionUk="Кожен клієнт викликає getInstance() — усі посилання ведуть до одного спільного екземпляра."
    >
      {clients.map((y, i) => (
        <Node key={i} x={16} y={y} w={62} h={26} label={`Client ${i + 1}`} />
      ))}

      <Tag x={150} y={40} tone="teal">
        getInstance()
      </Tag>
      {clients.map((y, i) => (
        <Wire
          key={i}
          tone="teal"
          d={`M 78 ${y + 13} C 130 ${y + 13}, 150 ${instY + 20}, ${instX} ${instY + 20}`}
        />
      ))}

      <Node x={instX} y={instY} w={78} h={40} label="Instance" sub="one · cached" tone="amber" />
    </AnimStage>
  );
}
