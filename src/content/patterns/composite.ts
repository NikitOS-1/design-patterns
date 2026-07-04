import { Pattern } from "@/lib/types";

export const composite: Pattern = {
  slug: "composite",
  category: "structural",
  code: "S-05",
  name: "Composite",
  oneLiner: "Treat a single item and a group of items through the same interface, so trees are handled uniformly.",
  problem:
    "Anything tree-shaped — a nested comment thread, a file explorer, a nested-menu, a page built from nested layout blocks — has two kinds of nodes: leaves (a single comment) and containers (a comment with replies). If your rendering code has to constantly ask 'is this a leaf or a branch?', the logic gets tangled and recursion becomes fragile.",
  solution:
    "Give leaves and containers the same interface / render path, and let containers hold children of that same type. Rendering becomes a clean recursion: a node renders itself, then renders its children the same way — with no special-casing. React's component model is built for exactly this, since a component can render other components as `children` indefinitely.",
  whenToUse: [
    "Nested comment threads, reply trees, or discussion boards",
    "File/folder explorers and tree views",
    "Recursive menus, nested navigation, or org charts",
    "Page/layout builders where a section can contain sections",
  ],
  avoidWhen: [
    "The data is flat, not hierarchical — a plain list is simpler",
    "Leaves and containers need genuinely different interfaces — forcing them together hides real differences",
  ],
  realWorldExamples: [
    {
      name: "Nested comment threads (Reddit, HN clones)",
      detail:
        "A `<Comment />` renders its own body and then maps over its replies, rendering each reply as another `<Comment />` — the same component handles both a single comment and a whole subtree.",
    },
    {
      name: "File explorers / tree views",
      detail:
        "A tree node renders a label; if it's a folder it recursively renders its children as more tree nodes, so the whole tree is one uniform recursive component.",
    },
    {
      name: "CMS / page-builder block trees",
      detail:
        "A layout section can contain other sections; a single recursive renderer walks the block tree without special-casing container vs. leaf blocks.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/comments/CommentNode.tsx",
      language: "tsx",
      description:
        "One recursive component renders both a single comment and an arbitrarily deep reply tree — the Composite pattern is native to React's children model.",
      code: `export interface CommentNodeData {
  id: string;
  author: string;
  body: string;
  replies: CommentNodeData[]; // same type — this is what makes it composite
}

export function CommentNode({ comment, depth = 0 }: { comment: CommentNodeData; depth?: number }) {
  return (
    <div style={{ marginLeft: depth * 20 }} className="border-l border-ink-600 pl-4 py-2">
      <div className="text-sm font-semibold text-ink-100">{comment.author}</div>
      <p className="text-sm text-ink-300">{comment.body}</p>

      {/* A leaf has replies: [] and simply renders nothing extra.
          A container recurses — identical code path for both. */}
      {comment.replies.map((reply) => (
        <CommentNode key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

// Usage — one call renders the entire tree, however deep:
// <CommentNode comment={thread} />`,
    },
  ],
  pros: [
    "Client code treats single items and groups uniformly — no leaf-vs-branch branching",
    "New tree depth requires zero new code; recursion handles any nesting",
    "Maps directly onto React's component/children model",
  ],
  cons: [
    "Very deep trees can hit performance or recursion limits without virtualization",
    "Over-generalizing can make it hard to enforce type-specific rules (e.g. 'folders can't be leaves')",
  ],
};
