"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Producers publish to a bus; consumers react independently. */
export function EventDrivenArchitectureAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Producers publish events to a bus; consumers react independently, decoupled from the source."
      captionUk="Продюсери публікують події в шину; консюмери реагують незалежно, відвʼязані від джерела."
    >
      <Node x={8} y={28} w={62} h={26} label="Producer" />
      <Node x={8} y={94} w={62} h={26} label="Producer" />
      <Wire tone="teal" d="M 70 41 C 100 50, 108 60, 118 68" />
      <Wire tone="teal" d="M 70 107 C 100 98, 108 88, 118 80" />

      <Node x={120} y={26} w={60} h={96} label="Event bus" sub="topics" tone="amber" />

      <Node x={232} y={16} w={60} h={26} label="Consumer" />
      <Node x={232} y={62} w={60} h={26} label="Consumer" />
      <Node x={232} y={108} w={60} h={26} label="Consumer" />
      <Wire tone="ink" d="M 180 58 C 205 40, 214 32, 232 29" />
      <Wire tone="ink" d="M 180 74 L 232 75" />
      <Wire tone="ink" d="M 180 90 C 205 108, 214 116, 232 121" />
      <Tag x={150} y={140} tone="ink">
        publish / subscribe
      </Tag>
    </AnimStage>
  );
}
