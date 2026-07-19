"use client";

import { AnimStage, Band, Tag } from "../_kit";

/** FSD's fixed layer order, imports pointing only downward. */
export function FeatureSlicedDesignAnim() {
  const layers = [
    { label: "app", tone: "amber" as const },
    { label: "pages", tone: "ink" as const },
    { label: "widgets", tone: "ink" as const },
    { label: "features", tone: "teal" as const },
    { label: "entities", tone: "ink" as const },
    { label: "shared", tone: "ink" as const },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 190"
      captionEn="FSD's fixed layer order — app, pages, widgets, features, entities, shared — where imports only ever point downward."
      captionUk="Фіксований порядок шарів FSD — app, pages, widgets, features, entities, shared — де імпорти завжди спрямовані лише вниз."
    >
      {layers.map((l, i) => (
        <Band key={l.label} x={58} y={10 + i * 29} w={184} h={24} label={l.label} tone={l.tone} />
      ))}
      <Tag x={28} y={100} tone="ink" anchor="middle">
        ↓ deps
      </Tag>
    </AnimStage>
  );
}
