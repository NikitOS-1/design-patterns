"use client";

import { animationRegistry } from "./registry";

/** Renders the registered diagram for a slug, or nothing if none exists. */
export function PatternAnimation({ slug }: { slug: string }) {
  const Anim = animationRegistry[slug];
  if (!Anim) return null;
  return <Anim />;
}
