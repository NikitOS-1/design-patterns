"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** The originator saves and restores state snapshots via a caretaker. */
export function MementoAnim() {
  const snaps = [30, 58, 86];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The originator saves snapshots of its state into a caretaker and can restore any of them later."
      captionUk="Originator зберігає знімки свого стану в caretaker і може відновити будь-який із них пізніше."
    >
      <Node x={12} y={52} w={80} h={44} label="Originator" sub="state" tone="amber" />

      <Tag x={148} y={44} tone="teal">
        save()
      </Tag>
      <Wire tone="teal" d="M 92 66 C 140 50, 170 44, 198 44" />
      <Tag x={148} y={108} tone="ink">
        restore()
      </Tag>
      <Wire tone="ink" d="M 198 100 C 170 106, 140 96, 92 84" />

      {snaps.map((y, i) => (
        <Node key={i} x={200} y={y} w={88} h={22} label={`snapshot ${i + 1}`} />
      ))}
      <Tag x={244} y={126} tone="ink">
        caretaker
      </Tag>
    </AnimStage>
  );
}
