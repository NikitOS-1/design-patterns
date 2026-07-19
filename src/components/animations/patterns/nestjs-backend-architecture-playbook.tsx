"use client";

import { AnimStage, Band, Wire, Tag } from "../_kit";

/** A NestJS module wiring controller → providers → data via DI. */
export function NestjsBackendArchitecturePlaybookAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 176"
      captionEn="A NestJS module wires a controller to providers via dependency injection, down to the data layer."
      captionUk="Модуль NestJS зʼєднує контролер із провайдерами через впровадження залежностей, аж до шару даних."
    >
      <rect x={10} y={10} width={280} height={158} rx={4} fill="#0B0E14" stroke="#F5A623" strokeWidth={1.5} />
      <Tag x={22} y={26} tone="amber" anchor="start">
        @Module
      </Tag>

      <Band x={30} y={34} w={240} h={26} label="Controller" right="@Get / @Post" />
      <Wire tone="ink" flow={false} d="M 150 60 L 150 74" />
      <Band x={30} y={74} w={240} h={26} label="Service" right="@Injectable" tone="teal" />
      <Wire tone="ink" flow={false} d="M 150 100 L 150 114" />
      <Band x={30} y={114} w={240} h={26} label="Repository" right="data" />
      <Wire tone="ink" flow={false} d="M 150 140 L 150 152" />
      <Band x={30} y={152} w={240} h={22} label="Database" />
    </AnimStage>
  );
}
