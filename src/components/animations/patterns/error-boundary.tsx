"use client";

import { AnimStage, Node, Packet, Tag } from "../_kit";

/** A boundary catches a child's error and renders a fallback. */
export function ErrorBoundaryAnim() {
  const d = "M 130 66 L 96 92";
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="If a child throws, the boundary catches the error and renders a fallback instead of crashing the tree."
      captionUk="Якщо дочірній компонент кидає помилку, межа перехоплює її й показує запасний UI, не ламаючи все дерево."
    >
      <rect x={30} y={16} width={240} height={118} rx={4} fill="#131720" stroke="#F5A623" strokeWidth={1.5} />
      <Tag x={40} y={31} tone="amber" anchor="start">
        ErrorBoundary
      </Tag>

      <Node x={100} y={40} w={100} h={28} label="Child" sub="throws ⚡" />
      <Packet path={d} tone="amber" dur={1.6} r={3} />

      <g className="pa-spawn">
        <Node x={92} y={86} w={116} h={30} label="Fallback UI" tone="teal" />
      </g>
      <Tag x={224} y={104} tone="ink">
        caught
      </Tag>
    </AnimStage>
  );
}
