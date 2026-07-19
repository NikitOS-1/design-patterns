"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Business logic lives between the transport layer and the data layer. */
export function ServiceLayerAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="A service layer concentrates business logic between the transport layer and the data layer."
      captionUk="Сервісний шар зосереджує бізнес-логіку між транспортним шаром і шаром даних."
    >
      <Node x={6} y={54} w={70} h={38} label="Controller" sub="HTTP" />
      <Wire tone="teal" d="M 76 73 L 108 73" />

      <Node x={110} y={48} w={82} h={50} label="Service" sub="business logic" tone="amber" />
      <Wire tone="teal" d="M 192 73 L 224 73" />

      <Node x={226} y={54} w={68} h={38} label="Repository" sub="data" />
      <Tag x={150} y={40} tone="ink">
        use case
      </Tag>
    </AnimStage>
  );
}
