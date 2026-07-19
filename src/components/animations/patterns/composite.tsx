"use client";

import { AnimStage, Node, Wire, Highlight } from "../_kit";

/** A uniform operation cascades through a tree of leaves and groups. */
export function CompositeAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Leaves and groups share one interface, so an operation cascades uniformly down the whole tree."
      captionUk="Листки і групи мають єдиний інтерфейс, тож операція однаково каскадом проходить усе дерево."
    >
      {/* edges */}
      <Wire tone="ink" arrow={false} d="M 150 34 L 78 60" />
      <Wire tone="ink" arrow={false} d="M 150 34 L 224 60" />
      <Wire tone="ink" arrow={false} d="M 78 84 L 44 110" />
      <Wire tone="ink" arrow={false} d="M 78 84 L 116 110" />

      {/* nodes */}
      <Node x={124} y={10} w={54} h={24} label="Group" tone="amber" />
      <Node x={50} y={60} w={56} h={24} label="Group" tone="teal" />
      <Node x={196} y={60} w={56} h={24} label="Item" />
      <Node x={18} y={110} w={52} h={24} label="Item" />
      <Node x={90} y={110} w={52} h={24} label="Item" />

      {/* cascade highlight top → bottom */}
      <Highlight x={124} y={10} w={54} h={24} delay={0} dur={4.2} />
      <Highlight x={50} y={60} w={56} h={24} delay={-1} dur={4.2} tone="teal" />
      <Highlight x={196} y={60} w={56} h={24} delay={-1} dur={4.2} tone="teal" />
      <Highlight x={18} y={110} w={52} h={24} delay={-2} dur={4.2} tone="teal" />
      <Highlight x={90} y={110} w={52} h={24} delay={-2} dur={4.2} tone="teal" />
    </AnimStage>
  );
}
