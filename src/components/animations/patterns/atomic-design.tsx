"use client";

import { AnimStage, Node, Wire } from "../_kit";

/** Small atoms compose upward into whole pages. */
export function AtomicDesignAnim() {
  const steps = [
    { label: "atoms", x: 6, y: 60, w: 46, h: 30, tone: "teal" as const },
    { label: "molecules", x: 60, y: 56, w: 54, h: 38, tone: "ink" as const },
    { label: "organisms", x: 122, y: 50, w: 58, h: 50, tone: "ink" as const },
    { label: "templates", x: 188, y: 54, w: 54, h: 42, tone: "ink" as const },
    { label: "pages", x: 250, y: 58, w: 44, h: 34, tone: "amber" as const },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Small atoms combine into molecules, then organisms, templates, and finally whole pages."
      captionUk="Маленькі атоми складаються в молекули, потім в організми, шаблони й нарешті цілі сторінки."
    >
      {steps.map((s, i) => {
        const prev = steps[i - 1];
        return (
          <g key={s.label}>
            {prev && (
              <Wire tone="ink" flow={false} d={`M ${prev.x + prev.w} 75 L ${s.x} 75`} />
            )}
            <Node x={s.x} y={s.y} w={s.w} h={s.h} label={s.label} tone={s.tone} />
          </g>
        );
      })}
    </AnimStage>
  );
}
