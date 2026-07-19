"use client";

import { AnimStage, Node, Highlight, Tag } from "../_kit";

/** A cursor walks the collection one element at a time. */
export function IteratorAnim() {
  const items = [16, 74, 132, 190, 248];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The iterator advances a cursor through the collection one element at a time, hiding how it's stored."
      captionUk="Ітератор просуває курсор по колекції по одному елементу, приховуючи, як вона влаштована."
    >
      <Tag x={20} y={40} tone="teal" anchor="start">
        next() →
      </Tag>
      {items.map((x, i) => (
        <g key={i}>
          <Node x={x} y={56} w={44} h={36} label={`${i}`} />
          <Highlight x={x} y={56} w={44} h={36} delay={-i} dur={5} />
        </g>
      ))}
      <Tag x={150} y={116} tone="ink">
        collection
      </Tag>
    </AnimStage>
  );
}
