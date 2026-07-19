"use client";

import { AnimStage, Node, Wire, Tag } from "../_kit";

/** withX(Component) returns a new component with extra behaviour. */
export function HigherOrderComponentsAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="A higher-order component takes a component and returns a new one with extra behaviour wrapped around it."
      captionUk="Компонент вищого порядку приймає компонент і повертає новий, огорнутий додатковою поведінкою."
    >
      <Node x={10} y={54} w={70} h={40} label="Component" />
      <Wire tone="teal" d="M 80 74 L 112 74" />
      <Node x={114} y={48} w={78} h={52} label="withAuth()" sub="wraps" tone="amber" />
      <Wire tone="teal" d="M 192 74 L 224 74" />
      <Node x={226} y={54} w={68} h={40} label="Enhanced" tone="teal" />
    </AnimStage>
  );
}
