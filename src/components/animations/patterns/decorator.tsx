"use client";

import { AnimStage, Highlight, Tag } from "../_kit";

/** Each decorator wraps the core, adding behaviour without changing it. */
export function DecoratorAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Each decorator wraps the component, layering on behaviour without changing what's inside."
      captionUk="Кожен декоратор огортає компонент, додаючи поведінку шарами, не змінюючи те, що всередині."
    >
      {/* Concentric wrappers around the core */}
      <rect x={62} y={26} width={176} height={98} rx={4} fill="#131720" stroke="#3A4155" strokeWidth={1.5} />
      <rect x={88} y={44} width={124} height={62} rx={4} fill="#0B0E14" stroke="#5EEAD4" strokeWidth={1.5} />
      <rect x={118} y={60} width={64} height={30} rx={3} fill="#131720" stroke="#F5A623" strokeWidth={1.5} />

      <Tag x={72} y={39} tone="ink" anchor="start">
        Logging
      </Tag>
      <Tag x={98} y={57} tone="teal" anchor="start">
        Auth
      </Tag>
      <text x={150} y={79} textAnchor="middle" className="font-mono" fontSize={10.5} fill="#FFD08A">
        Core
      </text>

      {/* Sweep the layers to show the wrapping order */}
      <Highlight x={118} y={60} w={64} h={30} delay={0} dur={4.2} />
      <Highlight x={88} y={44} w={124} h={62} delay={-1.4} dur={4.2} tone="teal" />
      <Highlight x={62} y={26} w={176} h={98} delay={-2.8} dur={4.2} />
    </AnimStage>
  );
}
