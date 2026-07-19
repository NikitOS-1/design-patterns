"use client";

import { AnimStage, Node, Wire, Packet, Tag } from "../_kit";

/** A request wrapped as an object the invoker can store and replay. */
export function CommandAnim() {
  const path = "M 74 74 L 292 74";
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The request is wrapped as a Command object the invoker can queue, log, or undo before the receiver runs it."
      captionUk="Запит загорнуто в обʼєкт-команду, який ініціатор може ставити в чергу, логувати чи скасовувати, перш ніж виконавець його виконає."
    >
      <Node x={10} y={54} w={64} h={40} label="Invoker" sub="execute()" />
      <Wire tone="teal" d="M 74 74 L 108 74" />
      <Node x={110} y={54} w={72} h={40} label="Command" sub="encapsulates" tone="amber" />
      <Wire tone="ink" d="M 182 74 L 216 74" />
      <Node x={218} y={54} w={72} h={40} label="Receiver" sub="action()" />

      <Packet path={path} tone="amber" dur={2.4} />
      <Tag x={150} y={44} tone="ink">
        request as object
      </Tag>
    </AnimStage>
  );
}
