"use client";

import { useMemo, useState } from "react";
import { CodeExample } from "@/lib/types";
import { useT } from "@/lib/i18n/LocaleProvider";

type BaseTokenKind = "whitespace" | "identifier" | "string" | "number" | "comment" | "symbol";
type HighlightTokenKind = "plain" | "keyword" | "string" | "number" | "comment" | "type" | "function" | "variable";

interface BaseToken {
  kind: BaseTokenKind;
  value: string;
}

interface HighlightToken {
  kind: HighlightTokenKind;
  value: string;
}

const keywordTokens = new Set([
  "import",
  "export",
  "from",
  "return",
  "const",
  "let",
  "var",
  "function",
  "class",
  "interface",
  "type",
  "extends",
  "implements",
  "new",
  "if",
  "else",
  "switch",
  "case",
  "default",
  "for",
  "while",
  "do",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "await",
  "async",
  "in",
  "of",
  "as",
  "typeof",
  "instanceof",
  "true",
  "false",
  "null",
  "undefined",
]);

const declarationKeywordTokens = new Set(["const", "let", "var", "function"]);
const typeContextTokens = new Set([
  "interface",
  "type",
  "class",
  "extends",
  "implements",
  "new",
  "as",
  ":",
  "<",
  "|",
  "&",
  ",",
  "(",
]);

const tokenClassByKind: Record<HighlightTokenKind, string> = {
  plain: "text-ink-100",
  keyword: "text-amber",
  string: "text-teal",
  number: "text-amber-soft",
  comment: "text-ink-400",
  type: "text-amber-soft",
  function: "text-blueprint-light",
  variable: "text-ink-50",
};

function isIdentifierStart(character: string): boolean {
  return /[A-Za-z_$]/.test(character);
}

function isIdentifierPart(character: string): boolean {
  return /[A-Za-z0-9_$]/.test(character);
}

function isDigit(character: string): boolean {
  return /[0-9]/.test(character);
}

function getPreviousNonWhitespaceToken(tokens: BaseToken[], startIndex: number): BaseToken | null {
  for (let index = startIndex - 1; index >= 0; index -= 1) {
    const currentToken = tokens[index];
    if (currentToken && currentToken.kind !== "whitespace") {
      return currentToken;
    }
  }
  return null;
}

function getNextNonWhitespaceToken(tokens: BaseToken[], startIndex: number): BaseToken | null {
  for (let index = startIndex + 1; index < tokens.length; index += 1) {
    const currentToken = tokens[index];
    if (currentToken && currentToken.kind !== "whitespace") {
      return currentToken;
    }
  }
  return null;
}

function tokenizeCode(code: string): BaseToken[] {
  const tokens: BaseToken[] = [];
  let index = 0;

  while (index < code.length) {
    const character = code.charAt(index);
    const nextCharacter = code.charAt(index + 1);

    if (/\s/.test(character)) {
      const start = index;
      while (index < code.length && /\s/.test(code.charAt(index))) {
        index += 1;
      }
      tokens.push({ kind: "whitespace", value: code.slice(start, index) });
      continue;
    }

    if (character === "/" && nextCharacter === "/") {
      const start = index;
      index += 2;
      while (index < code.length && code.charAt(index) !== "\n") {
        index += 1;
      }
      tokens.push({ kind: "comment", value: code.slice(start, index) });
      continue;
    }

    if (character === "/" && nextCharacter === "*") {
      const start = index;
      index += 2;
      while (index < code.length && !(code.charAt(index) === "*" && code.charAt(index + 1) === "/")) {
        index += 1;
      }
      index = Math.min(index + 2, code.length);
      tokens.push({ kind: "comment", value: code.slice(start, index) });
      continue;
    }

    if (character === "\"" || character === "'" || character === "`") {
      const quote = character;
      const start = index;
      index += 1;
      while (index < code.length) {
        if (code.charAt(index) === "\\") {
          index += 2;
          continue;
        }
        if (code.charAt(index) === quote) {
          index += 1;
          break;
        }
        index += 1;
      }
      tokens.push({ kind: "string", value: code.slice(start, index) });
      continue;
    }

    if (isDigit(character)) {
      const start = index;
      index += 1;
      while (index < code.length && /[0-9._]/.test(code.charAt(index))) {
        index += 1;
      }
      tokens.push({ kind: "number", value: code.slice(start, index) });
      continue;
    }

    if (isIdentifierStart(character)) {
      const start = index;
      index += 1;
      while (index < code.length && isIdentifierPart(code.charAt(index))) {
        index += 1;
      }
      tokens.push({ kind: "identifier", value: code.slice(start, index) });
      continue;
    }

    tokens.push({ kind: "symbol", value: character });
    index += 1;
  }

  return tokens;
}

function highlightCode(code: string): HighlightToken[] {
  const baseTokens = tokenizeCode(code);

  return baseTokens.map((token, index): HighlightToken => {
    if (token.kind === "whitespace") {
      return { kind: "plain", value: token.value };
    }

    if (token.kind === "string") {
      return { kind: "string", value: token.value };
    }

    if (token.kind === "number") {
      return { kind: "number", value: token.value };
    }

    if (token.kind === "comment") {
      return { kind: "comment", value: token.value };
    }

    if (token.kind !== "identifier") {
      return { kind: "plain", value: token.value };
    }

    if (keywordTokens.has(token.value)) {
      return { kind: "keyword", value: token.value };
    }

    const previousToken = getPreviousNonWhitespaceToken(baseTokens, index);
    const nextToken = getNextNonWhitespaceToken(baseTokens, index);

    if (previousToken && declarationKeywordTokens.has(previousToken.value)) {
      if (previousToken.value === "function") {
        return { kind: "function", value: token.value };
      }
      return { kind: "variable", value: token.value };
    }

    if (nextToken?.value === "(") {
      return { kind: "function", value: token.value };
    }

    const tokenFirstCharacter = token.value.charAt(0);

    if (
      tokenFirstCharacter === tokenFirstCharacter.toUpperCase() &&
      typeContextTokens.has(previousToken?.value ?? "")
    ) {
      return { kind: "type", value: token.value };
    }

    if (previousToken?.value === ":") {
      return { kind: "type", value: token.value };
    }

    return { kind: "plain", value: token.value };
  });
}

export function CodeBlock({ example }: { example: CodeExample }) {
  const [copied, setCopied] = useState(false);
  const highlightedTokens = useMemo(() => highlightCode(example.code), [example.code]);
  const t = useT();

  async function handleCopy() {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="overflow-hidden border border-ink-600 bg-ink-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-600 bg-ink-700 px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs text-ink-200">
          <span className="h-2 w-2 rounded-full bg-teal/70" aria-hidden />
          {example.filename}
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-[11px] uppercase tracking-widest text-ink-300 transition-colors hover:text-amber"
        >
          {copied ? t.codeBlock.copied : t.codeBlock.copy}
        </button>
      </div>
      {example.description && (
        <p className="border-b border-ink-600 bg-ink-800 px-4 py-2.5 text-sm text-ink-300">
          {example.description}
        </p>
      )}
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed">
        <code className="font-mono">
          {highlightedTokens.map((token, tokenIndex) => (
            <span key={`${tokenIndex}-${token.value.length}`} className={tokenClassByKind[token.kind]}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
