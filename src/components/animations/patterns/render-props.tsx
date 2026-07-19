"use client";

import { AnimStage, Node, Wire, Packet, Tag } from "../_kit";

/** The component hands data to a render function you pass in. */
export function RenderPropsAnim() {
  const d = "M 100 74 L 198 74";
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The component owns the data and hands it to a render function you pass in, which returns the UI."
      captionUk="Компонент володіє даними й передає їх у функцію-рендер, яку ви передаєте, а вона повертає UI."
    >
      <Node x={12} y={52} w={86} h={44} label="DataProvider" sub="fetches" tone="amber" />
      <Tag x={150} y={64} tone="teal">
        render(data)
      </Tag>
      <Wire tone="teal" d={d} />
      <Packet path={d} tone="teal" dur={1.8} />
      <Node x={200} y={52} w={88} h={44} label="render()" sub="returns UI" />
    </AnimStage>
  );
}
