import { Pattern } from "@/lib/types";

export const flyweight: Pattern = {
  slug: "flyweight",
  category: "structural",
  code: "S-07",
  name: "Flyweight",
  oneLiner: "Share one immutable instance across many uses instead of allocating a duplicate every time.",
  problem:
    "When you render thousands of items — a huge table, a map with thousands of markers, a virtualized list — giving each one its own copy of data that's actually identical (the same icon config, the same country object, the same formatter) wastes memory and creates GC pressure. The 'intrinsic' state that's shared gets needlessly duplicated per row.",
  solution:
    "Separate the shared, immutable part (intrinsic state) from the per-item part (extrinsic state), and keep a single cached instance of each unique shared value that everyone references. Instead of 10,000 identical formatter or icon objects, you have one, referenced 10,000 times. In frontend this is memoization and shared-instance caches more than a formal class hierarchy.",
  whenToUse: [
    "Rendering very large lists/tables/maps where many items share identical sub-objects",
    "Reusing one memoized formatter/parser instance instead of constructing per render",
    "Interning repeated values (e.g. one shared object per country/currency across all rows)",
    "Icon or style registries where the same descriptor is referenced by many elements",
  ],
  avoidWhen: [
    "You have a handful of items — the caching machinery costs more than it saves",
    "The 'shared' state actually needs to be mutated per item — flyweights must be immutable",
  ],
  realWorldExamples: [
    {
      name: "Memoized Intl formatters",
      detail:
        "`new Intl.NumberFormat(...)` is expensive; production code caches one formatter per locale/options and reuses it across every row instead of constructing thousands of identical ones.",
    },
    {
      name: "Shared marker/icon instances in map libraries",
      detail:
        "Mapping libraries reuse a single icon object across all markers of the same type rather than allocating an identical icon per marker, cutting memory on maps with thousands of points.",
    },
    {
      name: "Interned lookup objects in big tables",
      detail:
        "A table of 50k rows referencing one shared `Country`/`Currency` object per unique value (rather than a copy per row) keeps memory flat as row count grows.",
    },
    {
      name: "Emoji / icon sprite atlases",
      detail:
        "Icon systems reference one shared sprite/atlas entry per glyph across thousands of renders rather than embedding a copy per element, keeping large icon-heavy lists light.",
    },
  ],
  codeExamples: [
    {
      filename: "src/lib/format/formatterCache.ts",
      language: "ts",
      description:
        "A flyweight cache for Intl formatters: one shared instance per unique config, reused across every row instead of reconstructed each render.",
      code: `// Constructing Intl formatters is costly. Share one per unique key.
const numberFormatters = new Map<string, Intl.NumberFormat>();

export function getNumberFormatter(
  locale: string,
  options: Intl.NumberFormatOptions = {}
): Intl.NumberFormat {
  const key = \`\${locale}:\${JSON.stringify(options)}\`;

  let formatter = numberFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    numberFormatters.set(key, formatter); // one shared flyweight
  }
  return formatter;
}

// In a 10,000-row table, every USD cell shares ONE formatter instance:
// const usd = getNumberFormatter("en-US", { style: "currency", currency: "USD" });
// rows.map((r) => usd.format(r.amount));`,
    },
    {
      filename: "src/lib/icons/iconRegistry.ts",
      language: "ts",
      description:
        "A flyweight registry of immutable icon descriptors: every cell referencing the same icon shares one frozen object instead of allocating a copy per row.",
      code: `export interface IconDescriptor {
  readonly path: string;
  readonly viewBox: string;
  readonly color: string;
}

// One frozen, shared instance per unique key — the flyweights.
const registry = new Map<string, IconDescriptor>();

const ICON_PATHS: Record<string, string> = {
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
};

export function getIcon(name: string, color = "currentColor"): IconDescriptor {
  const key = \`\${name}:\${color}\`;

  let icon = registry.get(key);
  if (!icon) {
    icon = Object.freeze({ path: ICON_PATHS[name]!, viewBox: "0 0 24 24", color });
    registry.set(key, icon); // one shared flyweight, reused everywhere
  }
  return icon;
}

// In a 10,000-row table, every "check" cell shares ONE descriptor object:
// rows.map((r) => renderIcon(getIcon(r.statusIcon)));`,
    },
  ],
  pros: [
    "Cuts memory and allocation pressure dramatically on large collections",
    "Fewer objects to garbage-collect means smoother scrolling/rendering",
    "The cache is invisible to callers — they just get a value back",
  ],
  cons: [
    "Only safe when the shared state is truly immutable",
    "Adds a cache to manage; pointless (and slower) for small data sets",
  ],
};
