import { Pattern } from "@/lib/types";

export const observer: Pattern = {
  slug: "observer",
  category: "behavioral",
  code: "B-01",
  name: "Observer",
  oneLiner: "Let many parts of the UI react to an event, without the event source knowing who's listening.",
  problem:
    "Some events need to reach parts of the app that have no direct relationship to each other: a toast notification system needs to react to events fired from deep inside unrelated feature slices; a live AI-suggestion panel needs to update the moment a new suggestion arrives over a WebSocket, regardless of which component happens to be mounted. Prop-drilling a callback through five layers, or forcing every event source to import every listener, tightly couples parts of the app that should stay independent.",
  solution:
    "Introduce a subject that components can subscribe to and publish to, without either side knowing about the other's existence. In React this is usually a small event emitter plus a hook built on `useSyncExternalStore` (so subscriptions integrate correctly with concurrent rendering), or a WebSocket connection whose incoming messages are broadcast to any hook that's subscribed. Publishers just emit; subscribers just subscribe; neither imports the other.",
  whenToUse: [
    "A global toast/notification system triggered from arbitrary, unrelated components",
    "Real-time updates over a WebSocket/SSE connection (live suggestions, chat messages, presence) that any mounted component can react to",
    "Cross-tab state synchronization via the `storage` event or `BroadcastChannel`",
    "A lightweight pub/sub event bus for decoupling features that shouldn't import each other directly",
  ],
  avoidWhen: [
    "The 'subscribers' are really just a parent and its direct children — plain props/callbacks are simpler and more traceable",
    "There's only ever one listener — a direct function call is clearer than an event bus",
    "The state is genuinely global UI state (like a modal's open/closed status) — a context or store is a better fit than ad-hoc events",
  ],
  realWorldExamples: [
    {
      name: "Toast libraries (react-hot-toast, sonner)",
      detail:
        "`toast.success('Saved')` can be called from anywhere in the tree; a single `<Toaster />` mounted once subscribes to the same event stream and renders whatever gets published, with no direct import relationship between caller and renderer.",
    },
    {
      name: "Zustand's `subscribe()` API",
      detail:
        "Zustand stores expose a subscribe method so code outside React components — e.g. an analytics integration — can react to state changes without being a rendering subscriber itself.",
    },
    {
      name: "Live AI suggestions over WebSocket in interview-copilot tools",
      detail:
        "A single socket connection receives suggestion events from the server; a `useSuggestions()` hook subscribes to just the events relevant to the currently open candidate, decoupling the transport layer from any specific UI component.",
    },
    {
      name: "Cross-tab sync via BroadcastChannel",
      detail:
        "A `BroadcastChannel('auth')` lets one tab publish a logout event that every other open tab observes and reacts to, with no tab holding a reference to the others.",
    },
  ],
  codeExamples: [
    {
      filename: "src/lib/eventBus.ts",
      language: "ts",
      description:
        "A minimal typed event bus (the Subject) that any part of the app can publish to or subscribe from, with zero import relationship between the two sides.",
      code: `type Listener<T> = (payload: T) => void;

class EventBus<Events extends Record<string, unknown>> {
  private listeners: { [K in keyof Events]?: Set<Listener<Events[K]>> } = {};

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    (this.listeners[event] ??= new Set()).add(listener);
    return () => this.listeners[event]?.delete(listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners[event]?.forEach((listener) => listener(payload));
  }
}

export interface AppEvents {
  "toast:show": { message: string; variant: "success" | "error" };
  "suggestion:new": { candidateId: string; text: string };
}

// One shared instance — the Subject every part of the app talks to.
export const eventBus = new EventBus<AppEvents>();`,
    },
    {
      filename: "src/hooks/useEventBusSubscription.ts",
      language: "ts",
      description:
        "A React-safe subscription hook built on useSyncExternalStore, so any component can observe bus events without prop drilling.",
      code: `import { useSyncExternalStore, useRef } from "react";
import { eventBus, AppEvents } from "@/lib/eventBus";

export function useLatestEvent<K extends keyof AppEvents>(event: K) {
  const latest = useRef<AppEvents[K] | null>(null);

  return useSyncExternalStore(
    (onStoreChange) =>
      eventBus.on(event, (payload) => {
        latest.current = payload;
        onStoreChange();
      }),
    () => latest.current
  );
}

// Anywhere in the tree — no import relationship to whoever emits it:
// eventBus.emit("toast:show", { message: "Saved!", variant: "success" });
//
// And in <Toaster />, mounted once near the app root:
// const toast = useLatestEvent("toast:show");`,
    },
  ],
  pros: [
    "Publishers and subscribers stay fully decoupled — neither needs to import the other",
    "New subscribers can be added without touching the code that emits events",
    "A natural fit for cross-cutting concerns like notifications and real-time updates",
  ],
  cons: [
    "Harder to trace than direct function calls — 'who's listening to this event?' isn't visible from the emit site",
    "Easy to overuse for things that would be simpler as direct props or a shared store",
    "Needs careful cleanup (unsubscribing) to avoid memory leaks and stale closures",
  ],
};
