"use client";

import { AnimStage, Node, Wire, Packet, Tag } from "../_kit";

/** Subject changes → notifications fan out to every subscribed observer. */
export function ObserverAnim() {
  const observers = [
    { y: 14, delay: 0 },
    { y: 60, delay: 0.2 },
    { y: 106, delay: 0.4 },
  ];
  const subX = 90;
  const subYc = 73;
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="When the subject's state changes, it notifies every subscriber at once."
      captionUk="Коли стан субʼєкта змінюється, він одразу сповіщає всіх підписників."
    >
      <Node x={20} y={54} w={70} h={38} label="Subject" sub="notify()" tone="amber" />
      <Tag x={150} y={12} tone="teal">
        update
      </Tag>

      {observers.map((o, i) => {
        const path = `M ${subX} ${subYc} C 140 ${subYc}, 160 ${o.y + 13}, 214 ${o.y + 13}`;
        return (
          <g key={i}>
            <Wire tone="ink" d={path} arrow />
            <Packet path={path} tone="teal" dur={1.6} delay={o.delay} />
            <Node x={216} y={o.y} w={74} h={26} label={`Observer ${i + 1}`} />
          </g>
        );
      })}
    </AnimStage>
  );
}
