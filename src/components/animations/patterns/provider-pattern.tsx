"use client";

import { AnimStage, Node, Wire, Packet, Tag } from "../_kit";

/** A provider holds a value at the top; consumers below read it. */
export function ProviderPatternAnim() {
  const consumers = [16, 118, 220];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="A provider holds the value once at the top; consumers anywhere below read it without prop drilling."
      captionUk="Провайдер тримає значення один раз нагорі; споживачі будь-де нижче читають його без прокидання пропсів."
    >
      <Node x={108} y={10} w={84} h={30} label="Provider" sub="value" tone="amber" />
      {consumers.map((x, i) => {
        const d = `M 150 40 C 150 70, ${x + 32} 70, ${x + 32} 100`;
        return (
          <g key={i}>
            <Wire tone="ink" d={d} />
            <Packet path={d} tone="teal" dur={2} delay={i * 0.3} r={3} />
            <Node x={x} y={102} w={64} h={26} label="useCtx()" />
          </g>
        );
      })}
      <Tag x={244} y={60} tone="ink">
        no drilling
      </Tag>
    </AnimStage>
  );
}
