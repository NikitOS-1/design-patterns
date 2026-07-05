import { Pattern } from "@/lib/types";

export const compoundComponents: Pattern = {
  slug: "compound-components",
  category: "react",
  code: "R-02",
  name: "Compound Components",
  oneLiner: "Let related components share implicit state so users compose them like HTML, not via a wall of props.",
  problem:
    "A flexible component like a Tabs, Accordion, or Select can end up with a giant, rigid props API: `<Tabs items={[{label, content, icon, disabled}]} activeColor=... />`. Every new bit of flexibility adds another prop, and consumers can't rearrange or customize the internals without you exposing yet more configuration.",
  solution:
    "Split the component into a parent plus a set of child components that implicitly share state through Context. The parent owns the state; the children read it via a shared hook. Consumers compose the pieces (`<Tabs><Tabs.List><Tabs.Tab/></Tabs.List><Tabs.Panel/></Tabs>`) like HTML, arranging and styling them freely, while the shared behavior stays coordinated behind the scenes.",
  whenToUse: [
    "Tabs, Accordion, Menu, Select, Disclosure — anything with a parent coordinating flexible children",
    "Design-system components that need layout flexibility without a huge props surface",
    "When consumers need to interleave custom markup between the managed parts",
    "APIs you want to feel like native HTML element groups (`<select>/<option>`)",
  ],
  avoidWhen: [
    "The component is simple and a couple of props express everything — compound is overkill",
    "You need to strictly constrain structure — a flexible compound API lets users misarrange pieces",
  ],
  realWorldExamples: [
    {
      name: "Radix UI / Headless UI / shadcn/ui",
      detail:
        "These libraries are built almost entirely on compound components — `<Dialog><Dialog.Trigger/><Dialog.Content/></Dialog>` — so styling and structure stay in the consumer's hands while behavior stays managed.",
    },
    {
      name: "Reach UI's Tabs / Accordion",
      detail:
        "The original popularizer of the pattern in React: parent components share active-index state via context so `<Tab>` and `<TabPanel>` coordinate without prop drilling.",
    },
    {
      name: "React Router's `<Routes>/<Route>`",
      detail:
        "The nested route components share routing context implicitly, letting you compose the routing tree declaratively as elements rather than a config blob.",
    },
    {
      name: "Recharts composable chart parts",
      detail:
        "`<LineChart><XAxis/><Tooltip/><Line/></LineChart>` composes a chart from child parts that share chart context, so you arrange axes, grids, and series declaratively instead of via one options blob.",
    },
  ],
  codeExamples: [
    {
      filename: "src/components/ui/Tabs.tsx",
      language: "tsx",
      description:
        "A compound Tabs component: the parent owns active-tab state via context; Tab and Panel read it implicitly, so consumers compose freely.",
      code: `"use client";

import { createContext, useContext, useState, useId } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.* must be used inside <Tabs>");
  return ctx;
}

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  const baseId = useId();
  return <TabsContext.Provider value={{ active, setActive, baseId }}>{children}</TabsContext.Provider>;
}

function List({ children }: { children: React.ReactNode }) {
  return <div role="tablist" className="flex gap-2 border-b border-ink-600">{children}</div>;
}

function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const { active, setActive } = useTabs();
  const selected = active === value;
  return (
    <button
      role="tab"
      aria-selected={selected}
      onClick={() => setActive(value)}
      className={selected ? "border-b-2 border-amber text-amber px-3 py-2" : "text-ink-300 px-3 py-2"}
    >
      {children}
    </button>
  );
}

function Panel({ value, children }: { value: string; children: React.ReactNode }) {
  const { active } = useTabs();
  return active === value ? <div role="tabpanel" className="py-4">{children}</div> : null;
}

// Attach children to the parent for the <Tabs.Tab /> syntax.
Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;

// Consumers compose the pieces like HTML — no giant props object:
// <Tabs defaultValue="overview">
//   <Tabs.List>
//     <Tabs.Tab value="overview">Overview</Tabs.Tab>
//     <Tabs.Tab value="activity">Activity</Tabs.Tab>
//   </Tabs.List>
//   <Tabs.Panel value="overview">…</Tabs.Panel>
//   <Tabs.Panel value="activity">…</Tabs.Panel>
// </Tabs>`,
    },
    {
      filename: "src/components/ui/Accordion.tsx",
      language: "tsx",
      description:
        "A second compound component — an Accordion. The parent tracks which item is open via context; Item reads it, so consumers compose sections like HTML instead of passing an items={[...]} config.",
      code: `"use client";

import { createContext, useContext, useState } from "react";

const AccordionCtx = createContext<{ openId: string | null; toggle: (id: string) => void } | null>(
  null
);

function useAccordion() {
  const ctx = useContext(AccordionCtx);
  if (!ctx) throw new Error("Accordion.* must be used inside <Accordion>");
  return ctx;
}

export function Accordion({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));
  return <AccordionCtx.Provider value={{ openId, toggle }}>{children}</AccordionCtx.Provider>;
}

function Item({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { openId, toggle } = useAccordion();
  const open = openId === id;
  return (
    <div className="border-b border-ink-600">
      <button onClick={() => toggle(id)} aria-expanded={open} className="w-full py-3 text-left">
        {title}
      </button>
      {open && <div className="pb-3 text-sm text-ink-300">{children}</div>}
    </div>
  );
}

Accordion.Item = Item;

// Consumers compose sections like HTML — no items={[...]} config object:
// <Accordion>
//   <Accordion.Item id="shipping" title="Shipping">…</Accordion.Item>
//   <Accordion.Item id="returns" title="Returns">…</Accordion.Item>
// </Accordion>`,
    },
  ],
  pros: [
    "A tiny props surface with maximum layout flexibility for the consumer",
    "Reads like native HTML element groups — intuitive and declarative",
    "Shared state stays coordinated without prop drilling",
  ],
  cons: [
    "Context misuse throws at runtime if a child is rendered outside its parent",
    "Slightly more machinery to build than a single configurable component",
    "Very flexible composition means consumers can arrange pieces in invalid ways",
  ],
};
