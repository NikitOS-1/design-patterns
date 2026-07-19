"use client";

import { AnimStage, Band, Wire } from "../_kit";

/** A Next.js app split into layered concerns. */
export function FrontendArchitectureReactNextjsAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 176"
      captionEn="A Next.js app in layers — routes compose features, which build on shared entities and UI primitives."
      captionUk="Застосунок Next.js у шарах — маршрути складають фічі, що спираються на спільні сутності та UI-примітиви."
    >
      <Band x={44} y={12} w={212} h={30} label="app / routes" right="pages" />
      <Wire tone="ink" flow={false} d="M 150 42 L 150 54" />
      <Band x={44} y={54} w={212} h={30} label="features" right="use cases" tone="amber" />
      <Wire tone="ink" flow={false} d="M 150 84 L 150 96" />
      <Band x={44} y={96} w={212} h={30} label="entities · shared" right="model" />
      <Wire tone="ink" flow={false} d="M 150 126 L 150 138" />
      <Band x={44} y={138} w={212} h={30} label="ui · lib" right="primitives" tone="teal" />
    </AnimStage>
  );
}
