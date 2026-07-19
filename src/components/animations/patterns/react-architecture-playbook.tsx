"use client";

import { AnimStage, Node, Band, Wire } from "../_kit";

/** The core concerns of a React app, each with a clear home. */
export function ReactArchitecturePlaybookAnim() {
  const pillars = [
    { label: "Routing", x: 12 },
    { label: "Data", x: 84 },
    { label: "State", x: 156 },
    { label: "UI", x: 228 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 160"
      captionEn="The core concerns of a React app — routing, data, state, and UI — each with a clear, separate home."
      captionUk="Ключові аспекти React-застосунку — маршрутизація, дані, стан і UI — кожен зі своїм окремим місцем."
    >
      <Band x={40} y={10} w={220} h={26} label="App shell" tone="amber" />
      {pillars.map((p) => (
        <g key={p.label}>
          <Wire tone="ink" flow={false} d={`M ${p.x + 30} 36 L ${p.x + 30} 58`} />
          <Node x={p.x} y={60} w={60} h={70} label={p.label} tone="teal" />
        </g>
      ))}
    </AnimStage>
  );
}
