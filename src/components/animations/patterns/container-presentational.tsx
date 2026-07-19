"use client";

import { AnimStage, Node, Wire, Packet, Tag } from "../_kit";

/** Container owns data and logic; presentational just renders props. */
export function ContainerPresentationalAnim() {
  const d = "M 96 74 L 198 74";
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The container handles data and logic, then passes plain props to a presentational component that just renders."
      captionUk="Контейнер відповідає за дані й логіку, а тоді передає звичайні пропси презентаційному компоненту, що лише рендерить."
    >
      <Node x={12} y={50} w={82} h={48} label="Container" sub="logic + data" tone="amber" />
      <Tag x={148} y={64} tone="teal">
        props
      </Tag>
      <Wire tone="teal" d={d} />
      <Packet path={d} tone="teal" dur={1.9} />
      <Node x={200} y={50} w={90} h={48} label="View" sub="UI only" />
    </AnimStage>
  );
}
