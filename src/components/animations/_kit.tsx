"use client";

import { CSSProperties, ReactNode } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Shared primitives for the per-pattern "how it works" diagrams.
 *
 * Everything is a single inline <svg> in blueprint colours (see
 * tailwind.config.ts). Motion is pure CSS from globals.css (`pa-*`
 * classes), so it is code-split-friendly, SSR-safe, and automatically
 * disabled under prefers-reduced-motion.
 */

export type Tone = "ink" | "amber" | "teal";

const STROKE: Record<Tone, string> = {
  ink: "#3A4155", // ink-500
  amber: "#F5A623",
  teal: "#5EEAD4",
};
const LABEL: Record<Tone, string> = {
  ink: "#C4C9D4", // ink-200
  amber: "#FFD08A", // amber-soft
  teal: "#5EEAD4",
};

const SURFACE = "#131720"; // ink-800
const MUTED = "#5B6478"; // ink-400
const WIRE_BASE = "#232838"; // ink-600

/** The framed, captioned container. Caption is localized EN/UK. */
export function AnimStage({
  viewBox = "0 0 300 150",
  captionEn,
  captionUk,
  children,
}: {
  viewBox?: string;
  captionEn: string;
  captionUk: string;
  children: ReactNode;
}) {
  const { locale } = useLocale();
  return (
    <figure className="pa-stage blueprint-frame not-prose overflow-hidden border border-ink-500 bg-ink-800/40">
      <div className="pa-grid relative px-3 py-5">
        <svg
          viewBox={viewBox}
          role="img"
          aria-hidden
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto block h-auto w-full max-w-lg"
        >
          <Markers />
          {children}
        </svg>
      </div>
      <figcaption className="border-t border-ink-600 px-4 py-2.5 font-mono text-[11px] leading-snug text-ink-400">
        {locale === "uk" ? captionUk : captionEn}
      </figcaption>
    </figure>
  );
}

/** Arrowhead markers, one per tone. Included once inside every AnimStage. */
function Markers() {
  return (
    <defs>
      {(Object.keys(STROKE) as Tone[]).map((t) => (
        <marker
          key={t}
          id={`pa-arrow-${t}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={STROKE[t]} />
        </marker>
      ))}
    </defs>
  );
}

/** A labelled box. Optional second line via `sub`. */
export function Node({
  x,
  y,
  w = 64,
  h = 30,
  label,
  sub,
  tone = "ink",
  className,
  style,
  rx = 3,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
  rx?: number;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g className={className} style={style}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={SURFACE}
        stroke={STROKE[tone]}
        strokeWidth={1.5}
      />
      <text
        x={cx}
        y={sub ? cy - 1 : cy + 3.5}
        textAnchor="middle"
        className="font-mono"
        fontSize={10.5}
        fill={LABEL[tone]}
      >
        {label}
      </text>
      {sub && (
        <text
          x={cx}
          y={cy + 9}
          textAnchor="middle"
          className="font-mono"
          fontSize={7.5}
          fill={MUTED}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/** A connector. `d` is any SVG path; the coloured stroke has flowing dashes. */
export function Wire({
  d,
  tone = "teal",
  flow = true,
  reverse = false,
  arrow = true,
  base = true,
  width = 1.5,
  className,
}: {
  d: string;
  tone?: Tone;
  flow?: boolean;
  reverse?: boolean;
  arrow?: boolean;
  base?: boolean;
  width?: number;
  className?: string;
}) {
  return (
    <g className={className}>
      {base && <path d={d} fill="none" stroke={WIRE_BASE} strokeWidth={width} />}
      <path
        d={d}
        fill="none"
        stroke={STROKE[tone]}
        strokeWidth={width}
        strokeLinecap="round"
        opacity={0.95}
        markerEnd={arrow ? `url(#pa-arrow-${tone})` : undefined}
        className={flow ? (reverse ? "pa-flow pa-flow-rev" : "pa-flow") : undefined}
      />
    </g>
  );
}

/** A token that rides along `path` (an SVG path string) on a loop. */
export function Packet({
  path,
  tone = "amber",
  r = 3.5,
  dur = 1.8,
  delay = 0,
}: {
  path: string;
  tone?: Tone;
  r?: number;
  dur?: number;
  delay?: number;
}) {
  return (
    <circle
      r={r}
      fill={STROKE[tone]}
      className="pa-travel"
      style={{
        offsetPath: `path('${path}')`,
        animationDuration: `${dur}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/** An amber highlight ring that flashes over a node (for cycling/sequencing). */
export function Highlight({
  x,
  y,
  w = 64,
  h = 30,
  rx = 3,
  delay = 0,
  dur = 4,
  tone = "amber",
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  rx?: number;
  delay?: number;
  dur?: number;
  tone?: Tone;
}) {
  return (
    <rect
      x={x - 2}
      y={y - 2}
      width={w + 4}
      height={h + 4}
      rx={rx + 1}
      fill="none"
      stroke={STROKE[tone]}
      strokeWidth={2}
      className="pa-flash"
      style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
    />
  );
}

/** A full-width labelled band — used by the static architecture schematics. */
export function Band({
  x,
  y,
  w,
  h = 26,
  label,
  right,
  tone = "ink",
  className,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  right?: string;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
}) {
  const stroke = tone === "ink" ? "#3A4155" : tone === "amber" ? "#F5A623" : "#5EEAD4";
  const fill = tone === "amber" ? "#FFD08A" : tone === "teal" ? "#5EEAD4" : "#C4C9D4";
  return (
    <g className={className} style={style}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill="#131720"
        stroke={stroke}
        strokeWidth={1.5}
      />
      <text
        x={x + 10}
        y={y + h / 2 + 3.5}
        className="font-mono"
        fontSize={10.5}
        fill={fill}
      >
        {label}
      </text>
      {right && (
        <text
          x={x + w - 10}
          y={y + h / 2 + 3}
          textAnchor="end"
          className="font-mono"
          fontSize={7.5}
          fill="#5B6478"
        >
          {right}
        </text>
      )}
    </g>
  );
}

/** A small free-floating caption/label inside the SVG. */
export function Tag({
  x,
  y,
  children,
  tone = "ink",
  anchor = "middle",
  size = 8.5,
}: {
  x: number;
  y: number;
  children: ReactNode;
  tone?: Tone;
  anchor?: "start" | "middle" | "end";
  size?: number;
}) {
  const fill = tone === "ink" ? MUTED : STROKE[tone];
  return (
    <text x={x} y={y} textAnchor={anchor} className="font-mono" fontSize={size} fill={fill}>
      {children}
    </text>
  );
}
