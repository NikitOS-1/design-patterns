"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Writes and reads take separate paths. */
export function CqrsAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 160"
      captionEn="Writes and reads take separate paths — commands change the write model, queries hit an optimized read model."
      captionUk="Запис і читання йдуть різними шляхами — команди змінюють модель запису, запити звертаються до оптимізованої моделі читання."
    >
      <Node x={116} y={8} w={68} h={26} label="Client" />

      {/* command (write) side */}
      <Wire tone="teal" d="M 130 34 C 90 46, 70 46, 66 52" />
      <Node x={18} y={52} w={96} h={28} label="Command" tone="amber" />
      <Wire tone="ink" flow={false} d="M 66 80 L 66 96" />
      <Node x={18} y={96} w={96} h={28} label="Write model" />

      {/* query (read) side */}
      <Wire tone="teal" d="M 170 34 C 210 46, 230 46, 234 52" />
      <Node x={186} y={52} w={96} h={28} label="Query" tone="teal" />
      <Wire tone="ink" flow={false} d="M 234 80 L 234 96" />
      <Node x={186} y={96} w={96} h={28} label="Read model" />

      {/* projection */}
      <Wire tone="ink" d="M 114 110 L 186 110" />
      <Tag x={150} y={104} tone="ink">
        events
      </Tag>
    </AnimStage>
  );
}
