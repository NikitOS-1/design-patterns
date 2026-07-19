"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** A single entry point fans client requests out to backend services. */
export function BffApiGatewayAnim() {
  const services = [16, 62, 108];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="A gateway (or per-client BFF) is the single entry point that fans requests out to backend services."
      captionUk="Шлюз (або BFF під кожного клієнта) — єдина точка входу, що розподіляє запити між сервісами."
    >
      <Node x={8} y={30} w={58} h={26} label="Web" />
      <Node x={8} y={94} w={58} h={26} label="Mobile" />
      <Wire tone="teal" d="M 66 43 C 88 52, 92 60, 100 66" />
      <Wire tone="teal" d="M 66 107 C 88 98, 92 90, 100 84" />

      <Node x={100} y={52} w={92} h={44} label="BFF / Gateway" tone="amber" />

      {services.map((y, i) => {
        const d = `M 192 74 C 214 74, 220 ${y + 13}, 232 ${y + 13}`;
        return (
          <g key={i}>
            <Wire tone="ink" d={d} />
            <Node x={234} y={y} w={62} h={26} label="Service" />
          </g>
        );
      })}
      <Tag x={146} y={112} tone="ink">
        one entry point
      </Tag>
    </AnimStage>
  );
}
