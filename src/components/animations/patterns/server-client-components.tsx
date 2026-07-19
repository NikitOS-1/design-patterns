"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** Server components render on the server; islands opt into the client. */
export function ServerClientComponentsAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="Server Components render on the server and stream HTML; interactive parts opt into the client with 'use client'."
      captionUk="Серверні компоненти рендеряться на сервері й стрімлять HTML; інтерактивні частини переходять на клієнт через 'use client'."
    >
      <rect x={10} y={20} width={156} height={110} rx={4} fill="#131720" stroke="#3A4155" strokeWidth={1.5} />
      <Tag x={20} y={35} tone="ink" anchor="start">
        Server
      </Tag>
      <Node x={26} y={44} w={124} h={24} label="RSC" sub="renders HTML" />
      <Node x={26} y={92} w={124} h={24} label="RSC" />

      <Tag x={178} y={62} tone="teal">
        HTML
      </Tag>
      <Wire tone="teal" d="M 166 75 L 196 75" />
      <Node x={198} y={52} w={94} h={44} label="'use client'" sub="hydrates" tone="teal" />
    </AnimStage>
  );
}
