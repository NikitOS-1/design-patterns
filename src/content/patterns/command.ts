import { Pattern } from "@/lib/types";

export const command: Pattern = {
  slug: "command",
  category: "behavioral",
  code: "B-03",
  name: "Command",
  oneLiner: "Turn an action into an object, so it can be queued, logged, undone, or triggered from anywhere.",
  problem:
    "Rich text editors, command palettes (Cmd+K), and any UI with undo/redo all need to treat 'do a thing' as more than a function call: the same action (bold this selection, delete this block) might be triggered from a toolbar button, a keyboard shortcut, and a command-palette search — and each one needs to be reversible. Wiring every trigger directly to editor internals means undo/redo, logging, and keyboard shortcuts all have to be reimplemented per action, per trigger.",
  solution:
    "Represent every action as an object with a consistent shape — typically `execute()` and `undo()` — instead of a bare function call. Toolbar buttons, shortcuts, and the command palette all just construct and dispatch the same command object. An undo stack is then trivial: it's just a list of executed commands, popped and `.undo()`-ed in reverse.",
  whenToUse: [
    "Undo/redo stacks in editors (rich text, canvas, form builders)",
    "Command palettes (Cmd+K) where the same action can be triggered by search, shortcut, or a menu item",
    "Macro-style 'replay a sequence of actions' features",
    "Decoupling 'what should happen' from 'what triggered it' when the same action has many entry points",
  ],
  avoidWhen: [
    "The action has no need for undo, replay, or multiple trigger points — a plain event handler is simpler",
    "You're tempted to use it for one-off, never-repeated actions — the ceremony isn't worth it",
  ],
  realWorldExamples: [
    {
      name: "Tiptap / ProseMirror's command system",
      detail:
        "Tiptap's editor actions (`toggleBold`, `setLink`, `deleteSelection`) are literally implemented as chainable command objects dispatched through `editor.chain().focus().toggleBold().run()`, each contributing to the editor's built-in undo history.",
    },
    {
      name: "Command palettes (Linear, VS Code, cmdk-based UIs)",
      detail:
        "Every palette entry wraps an action as an object with a label and an execute function, so the same command can be found by search, bound to a shortcut, or invoked from a button — all without duplicating the action logic.",
    },
    {
      name: "Redux's action objects",
      detail:
        "A dispatched Redux action is itself a Command: a plain object describing 'what should happen', decoupled from the reducer that knows how to execute (and, with tools like redux-undo, unwind) it.",
    },
    {
      name: "Canvas editors' undo (Excalidraw, tldraw)",
      detail:
        "Drawing tools model each edit (add shape, move, resize) as a command with an inverse, so undo/redo is a generic stack of commands rather than per-tool reversal code.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/editor/commands.ts",
      language: "ts",
      description:
        "Editor actions modeled as Command objects with execute/undo, so a toolbar button, a keyboard shortcut, and the undo stack can all share the same objects.",
      code: `export interface Command {
  label: string;
  execute(): void;
  undo(): void;
}

interface EditorApi {
  getSelectionText(): string;
  replaceSelection(text: string): void;
}

export function createBoldCommand(editor: EditorApi): Command {
  let previousText = "";

  return {
    label: "Bold",
    execute() {
      previousText = editor.getSelectionText();
      editor.replaceSelection(\`**\${previousText}**\`);
    },
    undo() {
      editor.replaceSelection(previousText);
    },
  };
}

export function createDeleteBlockCommand(editor: EditorApi): Command {
  let removedText = "";

  return {
    label: "Delete block",
    execute() {
      removedText = editor.getSelectionText();
      editor.replaceSelection("");
    },
    undo() {
      editor.replaceSelection(removedText);
    },
  };
}`,
    },
    {
      filename: "src/features/editor/useCommandStack.ts",
      language: "ts",
      description:
        "An undo/redo stack that only ever deals with Command objects — it never needs to know what any specific action actually does.",
      code: `import { useCallback, useRef } from "react";
import { Command } from "./commands";

export function useCommandStack() {
  const undoStack = useRef<Command[]>([]);
  const redoStack = useRef<Command[]>([]);

  const run = useCallback((command: Command) => {
    command.execute();
    undoStack.current.push(command);
    redoStack.current = []; // a new action invalidates the redo history
  }, []);

  const undo = useCallback(() => {
    const command = undoStack.current.pop();
    if (!command) return;
    command.undo();
    redoStack.current.push(command);
  }, []);

  const redo = useCallback(() => {
    const command = redoStack.current.pop();
    if (!command) return;
    command.execute();
    undoStack.current.push(command);
  }, []);

  return { run, undo, redo };
}

// Usage — a toolbar button, a keyboard shortcut, and the command
// palette all just call run() with the same command object:
// const { run, undo, redo } = useCommandStack();
// <button onClick={() => run(createBoldCommand(editor))}>Bold</button>
// useHotkey("mod+z", undo);`,
    },
  ],
  pros: [
    "Undo/redo becomes a generic stack instead of hand-written reversal logic per action",
    "The same action object can be triggered from a button, shortcut, or command palette with zero duplication",
    "Actions become easy to log, queue, or replay since they're just objects",
  ],
  cons: [
    "Every action needs an explicit `undo()`, which isn't always trivial to express (e.g. actions with side effects like network calls)",
    "Adds ceremony for simple, one-off actions that never need undo or multiple entry points",
  ],
};
