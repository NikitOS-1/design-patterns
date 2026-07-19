"use client";

import { AnimStage, Node, Wire, Packet, Tag } from "../_kit";

/** The container builds dependencies and injects them into the consumer. */
export function DependencyInjectionAnim() {
  const path = "M 82 75 L 118 67";
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The container constructs dependencies and injects them, so the consumer never news up its own."
      captionUk="Контейнер створює залежності й інжектить їх, тож споживач ніколи не створює їх сам."
    >
      <Node x={10} y={54} w={72} h={44} label="Container" sub="provides" tone="amber" />

      <Tag x={150} y={44} tone="teal">
        inject
      </Tag>
      <Wire tone="teal" d="M 82 75 C 110 66, 150 66, 182 66" />
      <Packet path="M 82 75 C 110 66, 150 66, 182 66" tone="amber" dur={1.8} />
      <Node x={118} y={54} w={62} h={26} label="Logger" tone="teal" />

      <Node x={212} y={50} w={78} h={44} label="Service" sub="needs Logger" />
    </AnimStage>
  );
}
