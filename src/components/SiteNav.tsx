"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_ORDER } from "@/lib/types";
import { useT } from "@/lib/i18n/LocaleProvider";
import { LangSwitcher } from "@/components/LangSwitcher";

const GITHUB_URL = "https://github.com/NikitOS-1/design-patterns";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const t = useT();

  const navLinks = CATEGORY_ORDER.map((cat) => ({
    href: `/#${cat}`,
    label: t.nav.categories[cat],
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-ink-600 bg-ink-900/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center border border-amber/50 font-mono text-xs font-bold text-amber transition-colors group-hover:bg-amber/10">
            DP
          </span>
          <span className="whitespace-nowrap font-display text-sm font-semibold tracking-wide text-ink-100 sm:text-base">
            DESIGN PATTERNS
            <span className="ml-1.5 hidden text-ink-400 sm:inline">/ React · NestJS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-3 xl:gap-6 2xl:gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-ink-300 transition-colors hover:text-amber"
            >
              {link.label}
            </Link>
          ))}
          <LangSwitcher />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink-500 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-100 transition-colors hover:border-amber hover:text-amber"
          >
            {t.nav.github}
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LangSwitcher />
          <button
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 border border-ink-500"
          >
            <span
              className={`block h-px w-4 bg-ink-100 transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-4 bg-ink-100 transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-600 bg-ink-900 px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 font-mono text-sm uppercase tracking-widest text-ink-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-ink-500 px-4 py-2.5 text-center font-mono text-sm uppercase tracking-widest text-amber"
              >
                {t.nav.github}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
