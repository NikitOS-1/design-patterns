"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** The adapter translates the client's expected interface into the adaptee's. */
export function AdapterAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The adapter converts the interface the client expects into the one the adaptee actually offers."
      captionUk="Адаптер перетворює інтерфейс, який очікує клієнт, на той, що насправді надає адаптований обʼєкт."
    >
      <Node x={10} y={56} w={58} h={34} label="Client" sub="Target" />
      <Tag x={88} y={64} tone="teal">
        request()
      </Tag>
      <Wire tone="teal" d="M 68 73 L 106 73" />

      <Node x={108} y={52} w={68} h={42} label="Adapter" sub="converts" tone="amber" />

      <Tag x={196} y={64} tone="ink">
        adaptee API
      </Tag>
      <Wire tone="teal" d="M 176 73 L 214 73" />
      <Node x={216} y={56} w={74} h={34} label="Adaptee" sub="legacy" />
    </AnimStage>
  );
}
