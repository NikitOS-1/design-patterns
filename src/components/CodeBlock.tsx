"use client";

import { useState } from "react";
import { CodeExample } from "@/lib/types";

export function CodeBlock({ example }: { example: CodeExample }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="overflow-hidden border border-ink-600 bg-ink-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-600 bg-ink-700 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs text-ink-200">
          <span className="h-2 w-2 rounded-full bg-teal/70" aria-hidden />
          {example.filename}
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-[11px] uppercase tracking-widest text-ink-300 transition-colors hover:text-amber"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      {example.description && (
        <p className="border-b border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ink-300">
          {example.description}
        </p>
      )}
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed">
        <code className="font-mono text-ink-100">{example.code}</code>
      </pre>
    </div>
  );
}
