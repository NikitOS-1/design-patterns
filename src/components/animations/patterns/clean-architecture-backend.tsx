"use client";

import { AnimStage, Tag } from "../_kit";
import { CleanRings } from "./_clean-rings";

/** Concentric layers with dependencies pointing inward (backend). */
export function CleanArchitectureBackendAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 176"
      captionEn="Frameworks and drivers on the outside, interface adapters, use cases, and pure domain entities at the core."
      captionUk="Фреймворки й драйвери зовні, інтерфейсні адаптери, сценарії використання та чисті доменні сутності в центрі."
    >
      <CleanRings
        outer="Frameworks"
        adapters="Interface adapters"
        useCases="Use cases"
        core="Entities"
      />
      <Tag x={150} y={168} tone="ink">
        dependencies point inward →
      </Tag>
    </AnimStage>
  );
}
