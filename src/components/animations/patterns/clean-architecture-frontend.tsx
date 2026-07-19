"use client";

import { AnimStage, Tag } from "../_kit";
import { CleanRings } from "./_clean-rings";

/** Concentric layers with dependencies pointing inward (frontend). */
export function CleanArchitectureFrontendAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 176"
      captionEn="Concentric layers with dependencies pointing inward — UI and frameworks outside, domain entities at the core."
      captionUk="Концентричні шари із залежностями, спрямованими всередину — UI і фреймворки зовні, доменні сутності в центрі."
    >
      <CleanRings outer="UI / Framework" adapters="Adapters" useCases="Use cases" core="Entities" />
      <Tag x={150} y={168} tone="ink">
        dependencies point inward →
      </Tag>
    </AnimStage>
  );
}
