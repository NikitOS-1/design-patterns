import { CATEGORY_LABEL, Pattern } from "@/lib/types";

export function TitleBlock({ pattern }: { pattern: Pattern }) {
  return (
    <div className="blueprint-frame border border-ink-500 bg-ink-800/60">
      <div className="grid grid-cols-2 divide-x divide-ink-600 sm:grid-cols-4">
        <Cell label="Dwg No." value={pattern.code} accent />
        <Cell label="Category" value={CATEGORY_LABEL[pattern.category]} />
        <Cell label="Examples" value={`${pattern.codeExamples.length} file${pattern.codeExamples.length > 1 ? "s" : ""}`} />
        <Cell label="Stack" value="React / Next.js / TS" />
      </div>
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border-t border-ink-600 px-4 py-3 first:border-t-0 sm:border-t-0">
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink-400">{label}</div>
      <div className={`mt-1 font-mono text-sm ${accent ? "text-amber" : "text-ink-100"}`}>{value}</div>
    </div>
  );
}
