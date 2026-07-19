"use client";

import { AnimStage, Node, Wire, Highlight, Tag } from "../_kit";

/** Behaviour changes as the object switches its current state. */
export function StateAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The object changes behaviour by switching its current state; each state handles the same events its own way."
      captionUk="Обʼєкт змінює поведінку, перемикаючи поточний стан; кожен стан по-своєму обробляє одні й ті самі події."
    >
      <Node x={12} y={50} w={64} h={32} label="Idle" />
      <Node x={118} y={50} w={64} h={32} label="Active" tone="amber" />
      <Node x={224} y={50} w={64} h={32} label="Error" />

      <Wire tone="teal" d="M 76 66 L 118 66" />
      <Wire tone="teal" d="M 182 66 L 224 66" />
      <Wire tone="ink" d="M 256 82 C 256 118, 44 118, 44 82" />

      <Highlight x={12} y={50} w={64} h={32} delay={0} dur={4.2} />
      <Highlight x={118} y={50} w={64} h={32} delay={-1.4} dur={4.2} />
      <Highlight x={224} y={50} w={64} h={32} delay={-2.8} dur={4.2} />

      <Tag x={150} y={132} tone="ink">
        transition on event
      </Tag>
    </AnimStage>
  );
}
