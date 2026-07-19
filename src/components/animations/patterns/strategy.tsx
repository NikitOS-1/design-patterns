"use client";

import { AnimStage, Node, Wire, Highlight, Tag } from "../_kit";

/** The context delegates to a swappable strategy; the active one cycles. */
export function StrategyAnim() {
  const strategies = [
    { label: "StrategyA", y: 12 },
    { label: "StrategyB", y: 58 },
    { label: "StrategyC", y: 104 },
  ];
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The context keeps one interface; the concrete algorithm plugged into it can change at runtime."
      captionUk="Контекст зберігає єдиний інтерфейс; конкретний алгоритм у ньому можна змінювати під час виконання."
    >
      <Node x={16} y={54} w={76} h={40} label="Context" sub="execute()" tone="amber" />
      <Tag x={130} y={44} tone="teal">
        strategy
      </Tag>

      {strategies.map((s, i) => (
        <g key={s.label}>
          <Wire
            tone="ink"
            d={`M 92 74 C 120 74, 138 ${s.y + 13}, 168 ${s.y + 13}`}
          />
          <Node x={170} y={s.y} w={80} h={26} label={s.label} tone="ink" />
          <Highlight x={170} y={s.y} w={80} h={26} delay={-i * 1.6} dur={4.8} />
        </g>
      ))}
    </AnimStage>
  );
}
