import { Pattern } from "@/lib/types";

export const memento: Pattern = {
  slug: "memento",
  category: "behavioral",
  code: "B-07",
  name: "Memento",
  oneLiner: "Capture an object's state as a snapshot you can restore later — without exposing its internals.",
  problem:
    "Undo, drafts, and 'restore previous version' all need to save and later restore a snapshot of state. Reaching into an object's internals to copy its fields (and back again) couples the saving code to the object's shape, and it's easy to miss a field or corrupt state on restore.",
  solution:
    "Have the object produce a self-contained snapshot (a memento) of its own state, and accept a snapshot to restore itself from one. The code that stores snapshots (the 'caretaker' — an undo stack, a drafts list) holds them opaquely without knowing their internal structure. Where Command records *actions* to reverse, Memento records *state* to restore — often simpler for editors with complex, hard-to-invert changes.",
  whenToUse: [
    "Undo/redo implemented as state snapshots rather than reversible commands",
    "Autosaving drafts you can restore (form recovery, editor drafts)",
    "'Restore to this version' history in editors and settings",
    "Checkpointing state before a risky operation so you can roll back",
  ],
  avoidWhen: [
    "State is huge and snapshotting it repeatedly is too memory-heavy — Command (diffs) may be leaner",
    "Only a tiny field changes and a targeted reversal is obviously cheaper than a full snapshot",
  ],
  realWorldExamples: [
    {
      name: "Snapshot-based undo (redux-undo, editor history)",
      detail:
        "Many undo systems store past/present/future snapshots of state and restore one wholesale on undo, rather than computing an inverse of each action.",
    },
    {
      name: "Autosaved form drafts",
      detail:
        "Editors periodically capture the form's full value as a draft snapshot so an accidental navigation or refresh can restore exactly where the user was.",
    },
    {
      name: "'Version history' restore",
      detail:
        "Document tools keep periodic snapshots and let users restore any of them — each snapshot is a memento the history UI holds without needing to understand its internals.",
    },
    {
      name: "Checkpoint before a risky operation",
      detail:
        "Before a bulk find-and-replace or a destructive transform, editors snapshot the document so a single undo restores the whole pre-operation state at once.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/editor/useSnapshotHistory.ts",
      language: "ts",
      description:
        "Undo/redo via state snapshots (mementos). The history stack holds opaque snapshots; restoring one replaces state wholesale.",
      code: `import { useState, useCallback } from "react";

// A memento is just an immutable snapshot of state at a point in time.
export function useSnapshotHistory<T>(initial: T) {
  const [present, setPresent] = useState<T>(initial);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  // Commit a new value, pushing the previous one onto the undo stack.
  const commit = useCallback(
    (next: T) => {
      setPast((p) => [...p, present]); // snapshot the old state
      setPresent(next);
      setFuture([]); // a new edit clears the redo history
    },
    [present]
  );

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1]!;
      setFuture((f) => [present, ...f]);
      setPresent(previous); // restore the memento wholesale
      return p.slice(0, -1);
    });
  }, [present]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0]!;
      setPast((p) => [...p, present]);
      setPresent(next);
      return f.slice(1);
    });
  }, [present]);

  return { present, commit, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

// Usage — the editor commits snapshots; undo/redo restore them:
// const { present: doc, commit, undo, redo } = useSnapshotHistory(initialDoc);
// commit({ ...doc, title: "New title" });`,
    },
    {
      filename: "src/features/editor/draftMemento.ts",
      language: "ts",
      description:
        "A memento pair: the editor produces an opaque snapshot of its state, and a caretaker (here, localStorage) stores and later restores it without knowing its internal shape.",
      code: `export interface DocState {
  title: string;
  body: string;
  updatedAt: number;
}

// The originator produces and restores its own snapshots (mementos).
export function snapshot(state: DocState): string {
  return JSON.stringify(state);
}

export function restore(memento: string): DocState {
  return JSON.parse(memento) as DocState;
}

// A caretaker stores mementos opaquely — it never inspects their shape.
const DRAFT_KEY = "editor:draft";

export function saveDraft(state: DocState): void {
  localStorage.setItem(DRAFT_KEY, snapshot(state));
}

export function loadDraft(): DocState | null {
  const memento = localStorage.getItem(DRAFT_KEY);
  return memento ? restore(memento) : null;
}

// On mount, offer to recover; on change (debounced), autosave:
// const recovered = loadDraft();
// saveDraft({ title, body, updatedAt: Date.now() });`,
    },
  ],
  pros: [
    "Restoring is trivial and reliable — you swap in a whole snapshot, nothing to invert",
    "The history/caretaker code stays decoupled from the state's internal shape",
    "Great fit when changes are complex or awkward to reverse individually",
  ],
  cons: [
    "Full snapshots can use a lot of memory for large state or long histories",
    "Naively snapshotting on every keystroke is wasteful — debounce or diff",
  ],
};
