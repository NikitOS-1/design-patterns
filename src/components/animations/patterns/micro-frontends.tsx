"use client";

import { AnimStage, Node, Band, Wire } from "../_kit";

/** A shell host composes independently deployed remote apps. */
export function MicroFrontendsAnim() {
  const remotes = [
    { label: "Remote A", x: 18 },
    { label: "Remote B", x: 110 },
    { label: "Remote C", x: 202 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="A shell host composes independently built and deployed remote apps at runtime."
      captionUk="Оболонка-хост під час виконання складає незалежно зібрані й розгорнуті віддалені застосунки."
    >
      <Band x={20} y={12} w={260} h={28} label="Shell / Host" right="composes" tone="amber" />
      {remotes.map((r) => (
        <g key={r.label}>
          <Wire tone="ink" flow={false} d={`M ${r.x + 40} 40 L ${r.x + 40} 62`} />
          <Node x={r.x} y={64} w={80} h={62} label={r.label} sub="own deploy" tone="teal" />
        </g>
      ))}
    </AnimStage>
  );
}
