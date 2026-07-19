"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** The repository hides persistence, handing the domain plain objects. */
export function RepositoryPatternAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The repository hides how data is stored, handing the domain plain objects instead of raw queries."
      captionUk="Репозиторій приховує, як зберігаються дані, віддаючи домену звичайні обʼєкти замість сирих запитів."
    >
      <Node x={8} y={56} w={64} h={34} label="Service" sub="domain" />
      <Tag x={92} y={64} tone="teal">
        find/save
      </Tag>
      <Wire tone="teal" d="M 72 73 L 108 73" />

      <Node x={110} y={50} w={82} h={44} label="Repository" sub="interface" tone="amber" />

      <Tag x={210} y={64} tone="ink">
        SQL / ORM
      </Tag>
      <Wire tone="ink" d="M 192 73 L 226 73" />
      <Node x={228} y={56} w={62} h={34} label="Database" sub="rows" />
    </AnimStage>
  );
}
