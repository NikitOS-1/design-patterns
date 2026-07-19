"use client";

import { AnimStage, Band, Wire } from "../_kit";

/** A Node.js backend in request-processing layers. */
export function BackendArchitectureNodejsAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 176"
      captionEn="A Node.js backend in layers — controllers handle HTTP, services hold logic, repositories reach the database."
      captionUk="Backend на Node.js у шарах — контролери обробляють HTTP, сервіси містять логіку, репозиторії звертаються до бази."
    >
      <Band x={44} y={12} w={212} h={30} label="Controllers" right="HTTP" />
      <Wire tone="ink" flow={false} d="M 150 42 L 150 54" />
      <Band x={44} y={54} w={212} h={30} label="Services" right="logic" tone="amber" />
      <Wire tone="ink" flow={false} d="M 150 84 L 150 96" />
      <Band x={44} y={96} w={212} h={30} label="Repositories" right="data access" />
      <Wire tone="ink" flow={false} d="M 150 126 L 150 138" />
      <Band x={44} y={138} w={212} h={30} label="Database" right="rows" />
    </AnimStage>
  );
}
