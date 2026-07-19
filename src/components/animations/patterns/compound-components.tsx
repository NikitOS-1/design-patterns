"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Parent and children share state implicitly through context. */
export function CompoundComponentsAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Parent and children share state implicitly through context — <Select> and its <Option>s stay in sync."
      captionUk="Батьківський і дочірні компоненти неявно поділяють стан через контекст — <Select> та його <Option> лишаються синхронними."
    >
      <rect x={44} y={16} width={212} height={118} rx={4} fill="#131720" stroke="#F5A623" strokeWidth={1.5} />
      <Tag x={54} y={31} tone="amber" anchor="start">
        {"<Select>"}
      </Tag>

      <Node x={92} y={40} w={150} h={24} label="<Option> A" tone="teal" />
      <Node x={92} y={70} w={150} h={24} label="<Option> B" />
      <Node x={92} y={100} w={150} h={24} label="<Option> C" />

      <Wire tone="teal" arrow={false} d="M 70 52 L 70 112" />
      <Tag x={70} y={130} tone="ink">
        context
      </Tag>
    </AnimStage>
  );
}
