import { Pattern } from "@/lib/types";

export const visitor: Pattern = {
  slug: "visitor",
  category: "behavioral",
  code: "B-10",
  name: "Visitor",
  oneLiner: "Add new operations over a set of node types without editing the node types themselves.",
  problem:
    "You have a fixed set of node types (rich-text document nodes, AST nodes, CMS block types) and you keep needing new operations over them: render to HTML, serialize to Markdown, count words, extract links. If each operation is a method you add to every node type, then every new operation means editing every node — and unrelated concerns pile up inside the node definitions.",
  solution:
    "Keep the operation logic outside the nodes, in a visitor object with one handler per node type. A traversal walks the tree and dispatches each node to the matching handler. Adding a new operation is a whole new visitor — you never touch the node types. In TypeScript this is typically a discriminated union plus an exhaustive `switch`, which the compiler checks for completeness.",
  whenToUse: [
    "Multiple operations (render, serialize, analyze) over a stable set of node/block types",
    "Rich-text or AST processing where the node types rarely change but operations grow",
    "Exporting the same content tree to several formats (HTML, Markdown, plain text)",
    "Static analysis / transformation passes over a document or expression tree",
  ],
  avoidWhen: [
    "The set of node types changes often — every visitor must then be updated for the new type",
    "There's only one operation — a simple recursive function is clearer than a visitor object",
  ],
  realWorldExamples: [
    {
      name: "Rich-text serializers (Slate, ProseMirror, Portable Text)",
      detail:
        "Each renderer/serializer is a visitor: a set of per-node-type handlers turning the same document tree into HTML, Markdown, or plain text without changing the document model.",
    },
    {
      name: "Babel / ESLint AST visitors",
      detail:
        "Babel plugins and ESLint rules are visitors over the JavaScript AST — `Identifier(node) {}`, `CallExpression(node) {}` — adding new analyses without modifying the AST node types.",
    },
    {
      name: "CMS block-to-format exporters",
      detail:
        "Structured content (e.g. Portable Text) is rendered by supplying a visitor of components/handlers per block type, so a new export target is a new visitor, not a change to the content schema.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/richtext/renderVisitor.ts",
      language: "ts",
      description:
        "Rendering a document tree via a visitor (one handler per node type). Adding a Markdown export later means a new visitor — the node types never change.",
      code: `// The fixed set of node types (a discriminated union).
type DocNode =
  | { type: "paragraph"; children: DocNode[] }
  | { type: "text"; value: string; bold?: boolean }
  | { type: "link"; href: string; children: DocNode[] }
  | { type: "heading"; level: 1 | 2 | 3; children: DocNode[] };

// A visitor: one handler per node type, returning some result R.
interface Visitor<R> {
  paragraph(node: Extract<DocNode, { type: "paragraph" }>, visit: (n: DocNode) => R): R;
  text(node: Extract<DocNode, { type: "text" }>): R;
  link(node: Extract<DocNode, { type: "link" }>, visit: (n: DocNode) => R): R;
  heading(node: Extract<DocNode, { type: "heading" }>, visit: (n: DocNode) => R): R;
}

export function walk<R>(node: DocNode, visitor: Visitor<R>): R {
  const visit = (n: DocNode): R => walk(n, visitor);
  switch (node.type) {
    case "paragraph": return visitor.paragraph(node, visit);
    case "text":      return visitor.text(node);
    case "link":      return visitor.link(node, visit);
    case "heading":   return visitor.heading(node, visit);
    // no default needed — the compiler enforces exhaustiveness
  }
}

// One visitor = one operation. This one renders to an HTML string:
export const htmlVisitor: Visitor<string> = {
  paragraph: (n, visit) => \`<p>\${n.children.map(visit).join("")}</p>\`,
  text: (n) => (n.bold ? \`<strong>\${n.value}</strong>\` : n.value),
  link: (n, visit) => \`<a href="\${n.href}">\${n.children.map(visit).join("")}</a>\`,
  heading: (n, visit) => \`<h\${n.level}>\${n.children.map(visit).join("")}</h\${n.level}>\`,
};

// Adding Markdown export = a new visitor, zero changes to DocNode:
// export const markdownVisitor: Visitor<string> = { ... };`,
    },
  ],
  pros: [
    "New operations are added as new visitors without touching the node types",
    "Each operation's logic is gathered in one place instead of scattered across node methods",
    "TypeScript's exhaustive switch guarantees every node type is handled",
  ],
  cons: [
    "Adding a new node type forces every visitor to be updated — the opposite trade-off",
    "More machinery than a single recursive function when you only have one operation",
  ],
};
