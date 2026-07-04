import Link from "next/link";
import { Pattern } from "@/lib/types";

export function PatternCard({ pattern }: { pattern: Pattern }) {
  return (
    <Link
      href={`/patterns/${pattern.slug}`}
      className="group relative flex flex-col justify-between border border-ink-600 bg-ink-800/40 p-5 transition-all hover:border-amber/60 hover:bg-ink-800 hover:shadow-amber-glow"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-amber/80">{pattern.code}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 opacity-0 transition-opacity group-hover:opacity-100">
            View →
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-ink-50">{pattern.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">{pattern.oneLiner}</p>
      </div>
    </Link>
  );
}
