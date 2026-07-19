"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Abstraction and implementation vary independently, linked by a bridge. */
export function BridgeAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Abstraction and implementation vary on separate axes, joined by a bridge — each side extends without touching the other."
      captionUk="Абстракція та реалізація змінюються за різними осями, зʼєднані містком — кожна сторона розширюється, не чіпаючи іншу."
    >
      {/* abstraction hierarchy (left) */}
      <Node x={14} y={16} w={86} h={30} label="Abstraction" tone="amber" />
      <Wire tone="ink" arrow={false} d="M 57 46 L 57 92" />
      <Node x={14} y={94} w={86} h={26} label="Refined" />

      {/* implementation hierarchy (right) */}
      <Node x={200} y={16} w={90} h={30} label="Implementor" tone="teal" />
      <Wire tone="ink" arrow={false} d="M 245 46 L 245 92" />
      <Node x={200} y={94} w={90} h={26} label="Concrete" />

      {/* the bridge */}
      <Tag x={150} y={24} tone="ink">
        bridge
      </Tag>
      <Wire tone="teal" d="M 100 31 L 200 31" />
    </AnimStage>
  );
}
