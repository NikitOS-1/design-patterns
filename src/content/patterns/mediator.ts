import { Pattern } from "@/lib/types";

export const mediator: Pattern = {
  slug: "mediator",
  category: "behavioral",
  code: "B-06",
  name: "Mediator",
  oneLiner: "Route communication between many components through one hub, instead of wiring them directly to each other.",
  problem:
    "In a complex form or dashboard, controls affect each other: selecting a country filters the state dropdown, which resets the city, which recalculates shipping. If each control talks directly to every other control, you get a tangle of N×N dependencies where changing one field means touching many, and nothing can be reused in isolation.",
  solution:
    "Introduce a mediator — a central coordinator (a reducer, a store, a form controller) that every component reports to and receives updates from. Components no longer know about each other; they only know the mediator. All the 'when X changes, do Y and Z' logic lives in one place. React's `useReducer`, form libraries, and context-based stores are mediators.",
  whenToUse: [
    "Complex forms where fields have interdependencies (cascading selects, cross-field validation)",
    "Dashboards where filters, charts, and tables must stay in sync",
    "Coordinating sibling components that would otherwise need to know about each other",
    "Centralizing 'what happens when' logic that's currently scattered across components",
  ],
  avoidWhen: [
    "Components are genuinely independent — a mediator adds a needless middleman",
    "A parent passing props to two children already coordinates them simply enough",
    "The mediator would grow into a god-object that knows too much — split it up",
  ],
  realWorldExamples: [
    {
      name: "React Hook Form's form controller",
      detail:
        "The form instance mediates between fields: fields register with it, and cross-field logic (dependent validation, resets) is coordinated centrally rather than field-to-field.",
    },
    {
      name: "useReducer for interdependent state",
      detail:
        "A reducer is a mediator: components dispatch intent, and the reducer centrally decides how one change ripples into others, keeping components ignorant of each other.",
    },
    {
      name: "Redux / Zustand stores",
      detail:
        "A store mediates communication between unrelated components — they read from and write to the store, never directly to each other.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/shipping/shippingReducer.ts",
      language: "ts",
      description:
        "A reducer as mediator: the 'country changes → reset state → reset city' cascade lives in one place, and the field components never talk to each other.",
      code: `interface ShippingState {
  country: string;
  region: string;
  city: string;
}

type Action =
  | { type: "SET_COUNTRY"; country: string }
  | { type: "SET_REGION"; region: string }
  | { type: "SET_CITY"; city: string };

// The mediator: all cross-field consequences are centralized here.
export function shippingReducer(state: ShippingState, action: Action): ShippingState {
  switch (action.type) {
    case "SET_COUNTRY":
      // Changing country cascades: region and city become invalid.
      return { country: action.country, region: "", city: "" };
    case "SET_REGION":
      return { ...state, region: action.region, city: "" };
    case "SET_CITY":
      return { ...state, city: action.city };
    default:
      return state;
  }
}

// Each field only dispatches intent — it knows nothing about the others:
// const [state, dispatch] = useReducer(shippingReducer, initial);
// <CountrySelect value={state.country} onChange={(c) => dispatch({ type: "SET_COUNTRY", country: c })} />
// <RegionSelect  value={state.region}  onChange={(r) => dispatch({ type: "SET_REGION", region: r })} />`,
    },
  ],
  pros: [
    "Turns N×N component dependencies into N components each knowing only the mediator",
    "Cross-cutting coordination logic lives in one testable place",
    "Components become reusable because they no longer reference their siblings",
  ],
  cons: [
    "The mediator can bloat into a god-object that becomes its own maintenance problem",
    "Adds indirection when components are simple and could just share props",
  ],
};
