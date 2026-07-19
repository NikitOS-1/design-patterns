"use client";

import { AnimStage, Node, Band, Wire } from "../_kit";

/** Independent services, each owning its own database. */
export function MicroservicesArchitectureAnim() {
  const services = [
    { label: "Service A", x: 14 },
    { label: "Service B", x: 110 },
    { label: "Service C", x: 206 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 160"
      captionEn="Independent services, each owning its own database, communicating over the network behind a gateway."
      captionUk="Незалежні сервіси, кожен зі своєю базою даних, що спілкуються мережею за шлюзом."
    >
      <Band x={44} y={10} w={212} h={26} label="API Gateway" tone="amber" />
      {services.map((s) => (
        <g key={s.label}>
          <Wire tone="ink" flow={false} d={`M ${s.x + 40} 36 L ${s.x + 40} 56`} />
          <Node x={s.x} y={58} w={80} h={30} label={s.label} tone="teal" />
          <Wire tone="ink" flow={false} d={`M ${s.x + 40} 88 L ${s.x + 40} 102`} />
          <Node x={s.x} y={104} w={80} h={26} label="DB" sub="private" />
        </g>
      ))}
    </AnimStage>
  );
}
