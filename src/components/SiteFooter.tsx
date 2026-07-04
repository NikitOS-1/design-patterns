"use client";

import { useT } from "@/lib/i18n/LocaleProvider";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-ink-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 font-mono text-xs uppercase tracking-widest text-ink-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>{t.footer.edition}</span>
        <span>{t.footer.stack}</span>
      </div>
    </footer>
  );
}
