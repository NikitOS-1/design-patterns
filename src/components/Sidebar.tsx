"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { patterns } from "@/content/patterns";
import { CATEGORY_LABEL, CATEGORY_ORDER, PatternCategory } from "@/lib/types";

// Derive the grouped structure once from the single source of truth.
const GROUPED: { category: PatternCategory; items: typeof patterns }[] = CATEGORY_ORDER.map(
  (category) => ({
    category,
    items: patterns.filter((p) => p.category === category),
  })
);

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle — shown only below the lg breakpoint */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-ink-600 px-3 py-2 font-mono text-xs uppercase tracking-widest text-ink-200 lg:hidden"
        aria-expanded={open}
      >
        <span className="text-amber">☰</span> Patterns index
      </button>

      <nav
        aria-label="Patterns"
        className={`${
          open ? "block" : "hidden"
        } mt-3 lg:mt-0 lg:block lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto`}
      >
        <div className="flex flex-col gap-6 border border-ink-600 bg-ink-800/40 p-4 lg:border-0 lg:bg-transparent lg:p-0">
          {GROUPED.map(({ category, items }) => (
            <div key={category}>
              <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-teal">
                <span className="h-px w-4 bg-teal/50" />
                {CATEGORY_LABEL[category]}
                <span className="text-ink-500">({items.length})</span>
              </div>
              <ul className="flex flex-col">
                {items.map((pattern) => {
                  const href = `/patterns/${pattern.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={pattern.slug}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`flex items-baseline gap-2 border-l-2 py-1.5 pl-3 text-sm transition-colors ${
                          active
                            ? "border-amber text-amber"
                            : "border-transparent text-ink-300 hover:border-ink-400 hover:text-ink-100"
                        }`}
                      >
                        <span className="font-mono text-[10px] text-ink-500">{pattern.code}</span>
                        {pattern.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
