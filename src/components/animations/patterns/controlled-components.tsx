"use client";

import { AnimStage, Node, Wire, Packet, Tag } from "../_kit";

/** State drives the input's value; onChange feeds edits back to state. */
export function ControlledComponentsAnim() {
  const down = "M 132 48 C 104 66, 104 82, 126 96";
  const up = "M 174 96 C 196 82, 196 66, 168 48";
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="State drives the input's value; every keystroke fires onChange to update state — one source of truth."
      captionUk="Стан керує значенням поля; кожне натискання викликає onChange і оновлює стан — єдине джерело істини."
    >
      <Node x={116} y={16} w={70} h={30} label="state" tone="amber" />

      <Wire tone="teal" d={down} />
      <Packet path={down} tone="teal" dur={1.6} />
      <Tag x={78} y={74} tone="teal">
        value
      </Tag>

      <Wire tone="ink" d={up} />
      <Packet path={up} tone="amber" dur={1.6} delay={0.8} />
      <Tag x={224} y={74} tone="ink">
        onChange
      </Tag>

      <Node x={110} y={98} w={82} h={34} label="<input/>" />
    </AnimStage>
  );
}
