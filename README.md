# Design Patterns — Rebuilt for the Frontend

Classic **Gang-of-Four** design patterns plus the **modern React patterns** that make up
the real vocabulary of production code — every one redrawn as **React + Next.js (App
Router) + TypeScript**, styled with **Tailwind CSS**.

Instead of abstract `Animal`/`Shape` examples, each pattern shows the shape it actually
takes in a real frontend codebase — the kind you'll find inside Prisma, Stripe.js,
TanStack Query, Radix, next-auth, and your own app.

Pattern definitions are adapted from [refactoring.guru](https://refactoring.guru),
reframed specifically for frontend/React use cases.

## Stack

- **Next.js 14** (App Router, every pattern page statically generated)
- **TypeScript** in strict mode (`noUncheckedIndexedAccess` on)
- **Tailwind CSS** with a custom "technical blueprint" design system
- Zero UI component library — everything is hand-built and readable

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build; statically generates all pattern pages
npm run start    # serve the production build
```

## What's inside — 30 patterns across 4 categories

**Creational (5)** — Singleton · Factory Method · Abstract Factory · Builder · Prototype
**Structural (7)** — Adapter · Decorator · Facade · Proxy · Composite · Bridge · Flyweight
**Behavioral (10)** — Observer · Strategy · Command · State · Chain of Responsibility · Mediator · Memento · Iterator · Template Method · Visitor
**React Patterns (8)** — Custom Hooks · Compound Components · Provider (Context) · Render Props · Container/Presentational · Error Boundary · Server/Client Components · Controlled Components

Each pattern page covers: the problem → the pattern's answer → **when to reach for it /
when to skip it** (what it solves and doesn't) → where it actually shows up in real
libraries → production-grade code examples → pros & cons.

## Project structure

```
src/
  app/
    layout.tsx                  root layout: fonts, LocaleProvider, nav, footer
    page.tsx                    homepage — category-grouped grid (localized)
    patterns/
      layout.tsx                sidebar + content grid for all pattern pages
      [slug]/page.tsx           pattern detail: static params + metadata (server)
  components/
    Sidebar.tsx                 left nav, grouped by category, active-link highlighting
    SiteNav.tsx                 top nav with mobile drawer + language switcher
    LangSwitcher.tsx            EN / UA toggle
    CodeBlock.tsx               file-tab code block with copy-to-clipboard
    TitleBlock.tsx              blueprint "title block" header
    PatternCard.tsx             homepage card
    PatternDetail.tsx           pattern-page body (client; localizes content)
  content/patterns/             ← ONE FILE PER PATTERN — this is what you edit
    index.ts                    aggregates every pattern into a single list
    singleton.ts, custom-hooks.ts, ...
    translations/uk/            Ukrainian overlay per category (creational.ts, …)
  lib/
    types.ts                    the `Pattern` type + category order
    i18n/                       Locale config, UI dictionary, LocaleProvider, resolver
```

## Localization (EN / UK)

The UI and **all pattern content** are available in English and Ukrainian, toggled from
the nav. The choice persists in `localStorage` and falls back to the browser language.

- **UI strings** live in `src/lib/i18n/dictionary.ts` (one entry per locale).
- **Pattern content** stays English in `content/patterns/*.ts`; the Ukrainian text is a
  positional overlay in `content/patterns/translations/uk/`, merged at render time by
  `lib/i18n/localizePattern.ts`. Code samples, file names, and pattern names are
  locale-invariant.

## Adding a new pattern

Everything (sidebar, homepage grid, category grouping, detail page, prev/next
navigation) is derived from one array, so adding a pattern is a two-step change:

1. Duplicate any file in `src/content/patterns/` as a template and fill in the
   `Pattern` fields (see `src/lib/types.ts`).
2. Import it in `src/content/patterns/index.ts` and add it to the `patterns` array in
   the right category block.
3. Add the Ukrainian translation in `src/content/patterns/translations/uk/<category>.ts`,
   keyed by the same slug. **Array lengths must match the English base** (whenToUse,
   avoidWhen, realWorldExamples, codeExamples, pros, cons) — the resolver falls back to
   English per-index on a mismatch, so a wrong count silently leaks English.

The new pattern gets its own statically-generated page, a sidebar entry under its
category, a homepage card, and correct prev/next links.

## How this codebase applies its own patterns

The site is built with the same patterns it documents, as a working reference:

- **Single source of truth** — `content/patterns/index.ts` is the one list everything
  derives from; the sidebar, homepage, and routes never duplicate it (DRY).
- **Container / Presentational** — the pattern page's `page.tsx` (a Server Component)
  resolves static params + metadata and hands plain props to `PatternDetail`, which
  presents them; interactivity lives in small `"use client"` leaves.
- **Server / Client Components** — the tree is server-rendered by default; `"use client"`
  is pushed down to the components that need state (nav, sidebar, code block, locale).
- **Provider (Context)** — `LocaleProvider` supplies the current locale + dictionary to
  the whole tree via a guarded `useLocale()`/`useT()` hook — the Provider pattern the
  site documents, used for its own i18n.
- **Adapter** — `localizePattern` adapts an English `Pattern` into the requested locale,
  overlaying translated prose while keeping code and identifiers intact.
- **Composition over configuration** — small focused components (`TitleBlock`,
  `CodeBlock`, `PatternCard`) compose into pages instead of one mega-component.
- **Typed data model** — one `Pattern` interface drives content and rendering, so the
  compiler catches a malformed pattern before it ships.

### Conventions

- TypeScript strict; no `any`; discriminated unions over boolean flags.
- Components are single-purpose and small; data/logic separated from presentation.
- Bilingual content (EN/UK) with matched array lengths; Conventional Commits; no dead
  code or inline noise.
- Accessible + responsive by default: keyboard focus states, `prefers-reduced-motion`
  respected, mobile drawer nav, code blocks scroll instead of overflowing.

## Design system

A "technical blueprint" language — a faint schematic grid, corner-tick frames, and a
drafting-style **title block** on every pattern page (drawing number, category, example
count, stack) — a nod to patterns being blueprints for code. Tokens live in
`tailwind.config.ts` (`ink` = near-black scale, `amber` = the single accent, `teal` =
secondary marker) and `src/app/globals.css`. Fully responsive from mobile up.
