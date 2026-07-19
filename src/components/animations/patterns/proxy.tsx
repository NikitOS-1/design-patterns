"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** The proxy stands in for the real object, adding a check before forwarding. */
export function ProxyAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The proxy shares the real object's interface, adding caching, access checks or lazy loading in front of it."
      captionUk="Проксі має той самий інтерфейс, що й реальний обʼєкт, додаючи кеш, перевірку доступу чи ліниве завантаження перед ним."
    >
      <Node x={10} y={56} w={54} h={34} label="Client" />
      <Wire tone="teal" d="M 64 73 L 100 73" />

      <Node x={102} y={52} w={66} h={42} label="Proxy" sub="cache · auth" tone="amber" />
      <Tag x={135} y={44} tone="teal">
        ✓ check
      </Tag>

      <Wire tone="ink" d="M 168 73 L 214 73" />
      <Node x={216} y={56} w={74} h={34} label="RealObject" sub="expensive" />
      <Tag x={135} y={112} tone="ink">
        same interface
      </Tag>
    </AnimStage>
  );
}
