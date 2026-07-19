"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** A domain core with ports; adapters plug in from outside. */
export function HexagonalArchitectureAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 160"
      captionEn="A domain core wrapped in ports; adapters plug in on the outside — driving on one side, driven on the other."
      captionUk="Доменне ядро, оточене портами; адаптери підключаються ззовні — драйвери з одного боку, керовані з іншого."
    >
      {/* hexagon core */}
      <polygon
        points="110,38 190,38 218,80 190,122 110,122 82,80"
        fill="#131720"
        stroke="#F5A623"
        strokeWidth={1.5}
      />
      <text x={150} y={78} textAnchor="middle" className="font-mono" fontSize={11} fill="#FFD08A">
        Domain
      </text>
      <text x={150} y={92} textAnchor="middle" className="font-mono" fontSize={7.5} fill="#5B6478">
        ports
      </text>

      {/* driving adapters (left) */}
      <Tag x={34} y={30} tone="teal">
        driving
      </Tag>
      <Node x={6} y={40} w={54} h={24} label="HTTP" />
      <Node x={6} y={96} w={54} h={24} label="CLI" />
      <Wire tone="teal" d="M 60 52 L 84 66" />
      <Wire tone="teal" d="M 60 108 L 84 94" />

      {/* driven adapters (right) */}
      <Tag x={266} y={30} tone="ink">
        driven
      </Tag>
      <Node x={240} y={40} w={54} h={24} label="DB" />
      <Node x={240} y={96} w={54} h={24} label="Queue" />
      <Wire tone="ink" d="M 216 66 L 240 52" />
      <Wire tone="ink" d="M 216 94 L 240 108" />
    </AnimStage>
  );
}
