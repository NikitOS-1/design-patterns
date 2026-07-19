"use client";

import { AnimStage, Node, Wire, Packet } from "../_kit";

/** Colleagues communicate only through a central mediator. */
export function MediatorAnim() {
  const colleagues = [
    { x: 12, y: 12 },
    { x: 224, y: 12 },
    { x: 12, y: 108 },
    { x: 224, y: 108 },
  ];
  const mid = { cx: 150, cy: 75 };
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Components talk only to the mediator, not to each other — one hub instead of a tangle of direct links."
      captionUk="Компоненти спілкуються лише з медіатором, а не між собою — один вузол замість плутанини прямих звʼязків."
    >
      {colleagues.map((c, i) => {
        const cx = c.x + 32;
        const cy = c.y + 14;
        const d = `M ${cx} ${cy} L ${mid.cx} ${mid.cy}`;
        return (
          <g key={i}>
            <Wire tone="ink" arrow={false} d={d} />
            <Packet path={i % 2 === 0 ? d : `M ${mid.cx} ${mid.cy} L ${cx} ${cy}`} tone="teal" dur={2} delay={i * 0.4} r={3} />
            <Node x={c.x} y={c.y} w={64} h={28} label={`C${i + 1}`} />
          </g>
        );
      })}
      <Node x={116} y={55} w={68} h={40} label="Mediator" sub="hub" tone="amber" />
    </AnimStage>
  );
}
