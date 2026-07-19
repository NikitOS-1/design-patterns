"use client";

/** Shared concentric-ring diagram for Clean Architecture (FE + BE). */
export function CleanRings({
  outer,
  adapters,
  useCases,
  core,
}: {
  outer: string;
  adapters: string;
  useCases: string;
  core: string;
}) {
  const cx = 150;
  const cy = 82;
  const label = (y: number, text: string, fill: string) => (
    <text x={cx} y={y} textAnchor="middle" className="font-mono" fontSize={8.5} fill={fill}>
      {text}
    </text>
  );
  return (
    <g>
      <circle cx={cx} cy={cy} r={74} fill="#0B0E14" stroke="#3A4155" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={56} fill="#131720" stroke="#3A4155" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={38} fill="#0B0E14" stroke="#5EEAD4" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={20} fill="#131720" stroke="#F5A623" strokeWidth={1.5} />

      {label(cy - 66, outer, "#8B93A7")}
      {label(cy - 48, adapters, "#8B93A7")}
      {label(cy - 30, useCases, "#5EEAD4")}
      {label(cy + 3, core, "#FFD08A")}
    </g>
  );
}
