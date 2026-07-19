"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** A distributed transaction as local steps with compensations. */
export function SagaPatternAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="A distributed transaction runs as local steps; if one fails, compensating actions roll the earlier ones back."
      captionUk="Розподілена транзакція виконується як локальні кроки; якщо один падає, компенсуючі дії відкочують попередні."
    >
      <Node x={14} y={40} w={76} h={34} label="Step 1" tone="teal" />
      <Wire tone="teal" d="M 90 57 L 112 57" />
      <Node x={112} y={40} w={76} h={34} label="Step 2" tone="teal" />
      <Wire tone="teal" d="M 188 57 L 210 57" />
      <Node x={210} y={40} w={76} h={34} label="Step 3" tone="amber" />

      {/* compensation path on failure */}
      <Wire tone="ink" d="M 248 74 C 248 108, 52 108, 52 74" />
      <Tag x={150} y={104} tone="ink">
        compensate on failure ←
      </Tag>
    </AnimStage>
  );
}
