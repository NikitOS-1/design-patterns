"use client";

import { AnimStage, Band, Wire } from "../_kit";

/** Classic horizontal layers, each depending only on the one below. */
export function LayeredArchitectureAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 176"
      captionEn="Each layer talks only to the one directly below it: presentation → business → persistence → data."
      captionUk="Кожен шар звертається лише до сусіднього нижнього: презентація → бізнес-логіка → доступ до даних → база."
    >
      <Band x={44} y={12} w={212} h={30} label="Presentation" right="UI" />
      <Wire tone="ink" flow={false} d="M 150 42 L 150 54" />
      <Band x={44} y={54} w={212} h={30} label="Business logic" right="rules" tone="amber" />
      <Wire tone="ink" flow={false} d="M 150 84 L 150 96" />
      <Band x={44} y={96} w={212} h={30} label="Persistence" right="repos" />
      <Wire tone="ink" flow={false} d="M 150 126 L 150 138" />
      <Band x={44} y={138} w={212} h={30} label="Database" right="rows" />
    </AnimStage>
  );
}
