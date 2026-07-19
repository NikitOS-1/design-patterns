"use client";

import { AnimStage, Node, Wire, Packet, Highlight, Tag } from "../_kit";

/** A request travels down a chain until a handler handles it. */
export function ChainOfResponsibilityAnim() {
  const path = "M 14 66 L 250 66";
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The request passes from handler to handler down the chain until one decides to handle it."
      captionUk="Запит передається від обробника до обробника ланцюжком, доки якийсь не вирішить його обробити."
    >
      <Node x={14} y={50} w={76} h={34} label="Handler 1" sub="pass" />
      <Wire tone="ink" d="M 90 67 L 112 67" />
      <Node x={112} y={50} w={76} h={34} label="Handler 2" sub="handles" tone="amber" />
      <Wire tone="ink" d="M 188 67 L 210 67" />
      <Node x={210} y={50} w={76} h={34} label="Handler 3" sub="pass" />

      <Highlight x={112} y={50} w={76} h={34} delay={0} dur={3.2} />
      <Packet path={path} tone="teal" dur={2.6} />
      <Tag x={150} y={40} tone="ink">
        request →
      </Tag>
    </AnimStage>
  );
}
