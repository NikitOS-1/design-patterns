"use client";

import { AnimStage, Node, Band, Wire, Highlight } from "../_kit";

/** Base fixes the skeleton; subclasses fill only the marked steps. */
export function TemplateMethodAnim() {
  return (
    <AnimStage
      viewBox="0 0 300 150"
      captionEn="The base class fixes the algorithm's skeleton; subclasses override only the marked steps."
      captionUk="Базовий клас фіксує кістяк алгоритму; підкласи перевизначають лише позначені кроки."
    >
      <Node x={10} y={52} w={78} h={46} label="Template" sub="run()" tone="amber" />

      <Wire tone="ink" d="M 88 60 C 110 32, 120 32, 138 32" />
      <Wire tone="ink" d="M 88 75 L 138 75" />
      <Wire tone="ink" d="M 88 90 C 110 118, 120 118, 138 118" />

      <Band x={140} y={20} w={150} h={24} label="step 1" right="fixed" />
      <Band x={140} y={63} w={150} h={24} label="step 2" right="override" tone="teal" />
      <Band x={140} y={106} w={150} h={24} label="step 3" right="fixed" />

      <Highlight x={140} y={63} w={150} h={24} delay={0} dur={3.4} tone="teal" />
    </AnimStage>
  );
}
