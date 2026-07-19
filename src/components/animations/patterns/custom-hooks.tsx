"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Stateful logic extracted into a hook that many components reuse. */
export function CustomHooksAnim() {
  const comps = [14, 60, 106];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Stateful logic is extracted into a hook that any component can call to reuse it."
      captionUk="Логіка зі станом винесена в хук, який будь-який компонент може викликати, щоб її повторно використати."
    >
      <Node x={12} y={54} w={82} h={42} label="useAuth()" sub="state + effects" tone="amber" />
      <Tag x={150} y={44} tone="teal">
        reuse
      </Tag>
      {comps.map((y, i) => (
        <g key={i}>
          <Wire tone="ink" d={`M 94 75 C 140 75, 160 ${y + 13}, 210 ${y + 13}`} />
          <Node x={212} y={y} w={78} h={26} label={`Component ${i + 1}`} />
        </g>
      ))}
    </AnimStage>
  );
}
