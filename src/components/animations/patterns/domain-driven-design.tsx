"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** The domain split into bounded contexts linked by a context map. */
export function DomainDrivenDesignAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The domain is split into bounded contexts, each with its own model and language, linked by a context map."
      captionUk="Домен поділено на обмежені контексти, кожен зі своєю моделлю та мовою, повʼязані картою контекстів."
    >
      <rect x={14} y={20} width={120} height={104} rx={4} fill="#0B0E14" stroke="#F5A623" strokeWidth={1.5} />
      <Tag x={74} y={35} tone="amber">
        Sales
      </Tag>
      <Node x={30} y={48} w={88} h={28} label="Order" sub="aggregate" />
      <Tag x={74} y={104} tone="ink">
        ubiquitous language
      </Tag>

      <rect x={166} y={20} width={120} height={104} rx={4} fill="#0B0E14" stroke="#5EEAD4" strokeWidth={1.5} />
      <Tag x={226} y={35} tone="teal">
        Shipping
      </Tag>
      <Node x={182} y={48} w={88} h={28} label="Shipment" sub="aggregate" tone="teal" />
      <Tag x={226} y={104} tone="ink">
        own model
      </Tag>

      <Wire tone="ink" d="M 134 62 L 166 62" />
      <Tag x={150} y={56} tone="ink">
        map
      </Tag>
    </AnimStage>
  );
}
