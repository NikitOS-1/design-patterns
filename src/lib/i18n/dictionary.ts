import { PatternCategory } from "@/lib/types";
import { Locale } from "./config";

// All UI-chrome strings, per locale. Pattern *content* (problem/solution/…)
// lives alongside the patterns themselves; see content/patterns/translations.
export interface Dictionary {
  nav: {
    categories: Record<PatternCategory, string>;
    github: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: (count: number) => string;
    titleLine1: string;
    titleLine2: string;
    titleAccent: string;
    paragraph: string;
  };
  category: {
    label: Record<PatternCategory, string>;
    blurb: Record<PatternCategory, string>;
    counter: (index: number, total: number) => string;
  };
  card: {
    view: string;
  };
  codeBlock: {
    copy: string;
    copied: string;
  };
  sidebar: {
    index: string;
  };
  titleBlock: {
    drawingNo: string;
    category: string;
    examples: string;
    stack: string;
    files: (count: number) => string;
  };
  patternPage: {
    problem: string;
    solution: string;
    whenToUse: string;
    avoidWhen: string;
    realWorld: string;
    inCode: string;
    prosTitle: string;
    consTitle: string;
    previous: string;
    next: string;
  };
  footer: {
    edition: string;
    stack: string;
  };
}

const en: Dictionary = {
  nav: {
    categories: {
      creational: "Creational",
      structural: "Structural",
      behavioral: "Behavioral",
      react: "React",
    },
    github: "GitHub ↗",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: (count) => `${count} patterns, redrawn for the frontend`,
    titleLine1: "Design patterns,",
    titleLine2: "as they actually appear",
    titleAccent: "in production",
    paragraph:
      "The 23 Gang-of-Four patterns plus the modern React patterns that make up the real vocabulary of production code — rebuilt as React, Next.js, and TypeScript. Not another Animal/Shape UML diagram: the same shapes you'll find inside Prisma, Stripe.js, TanStack Query, Radix, and your own codebase.",
  },
  category: {
    label: {
      creational: "Creational",
      structural: "Structural",
      behavioral: "Behavioral",
      react: "React Patterns",
    },
    blurb: {
      creational:
        "How objects and components get built, so creation logic doesn't leak everywhere.",
      structural: "How components, modules, and data shapes are composed together.",
      behavioral: "How responsibilities and communication flow between parts of the app.",
      react:
        "Patterns that aren't in the Gang of Four book but are the real vocabulary of production React today.",
    },
    counter: (index, total) => `${String(index).padStart(2, "0")} / ${total}`,
  },
  card: {
    view: "View →",
  },
  codeBlock: {
    copy: "Copy",
    copied: "Copied ✓",
  },
  sidebar: {
    index: "Patterns index",
  },
  titleBlock: {
    drawingNo: "Dwg No.",
    category: "Category",
    examples: "Examples",
    stack: "Stack",
    files: (count) => `${count} file${count > 1 ? "s" : ""}`,
  },
  patternPage: {
    problem: "The problem",
    solution: "The pattern's answer",
    whenToUse: "Reach for it when",
    avoidWhen: "Skip it when",
    realWorld: "Where it actually shows up",
    inCode: "In code",
    prosTitle: "Trade-offs — pros",
    consTitle: "Trade-offs — cons",
    previous: "← Previous",
    next: "Next →",
  },
  footer: {
    edition: "Design Patterns / Frontend Edition",
    stack: "React · Next.js · TypeScript · Tailwind",
  },
};

// Ukrainian plural for "файл" (file): 1 → файл, 2–4 → файли, else → файлів
// (with the 11–14 teens exception).
function ukFiles(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} файл`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} файли`;
  return `${count} файлів`;
}

const uk: Dictionary = {
  nav: {
    categories: {
      creational: "Породжувальні",
      structural: "Структурні",
      behavioral: "Поведінкові",
      react: "React",
    },
    github: "GitHub ↗",
    openMenu: "Відкрити меню",
    closeMenu: "Закрити меню",
  },
  hero: {
    eyebrow: (count) => `${count} патернів, переосмислених для фронтенду`,
    titleLine1: "Патерни проєктування —",
    titleLine2: "такими, якими вони є",
    titleAccent: "у продакшені",
    paragraph:
      "23 патерни «Банди чотирьох» плюс сучасні патерни React, які складають справжню мову продакшн-коду — переписані на React, Next.js і TypeScript. Не чергова UML-діаграма з Animal/Shape, а ті самі конструкції, які ви знайдете всередині Prisma, Stripe.js, TanStack Query, Radix і власної кодової бази.",
  },
  category: {
    label: {
      creational: "Породжувальні",
      structural: "Структурні",
      behavioral: "Поведінкові",
      react: "React-патерни",
    },
    blurb: {
      creational:
        "Як створюються об'єкти та компоненти, щоб логіка створення не розповзалася по всьому коду.",
      structural: "Як компоненти, модулі та структури даних поєднуються між собою.",
      behavioral: "Як відповідальність і комунікація розподіляються між частинами застосунку.",
      react:
        "Патерни, яких немає в книзі «Банди чотирьох», але які сьогодні є справжньою мовою продакшн-React.",
    },
    counter: (index, total) => `${String(index).padStart(2, "0")} / ${total}`,
  },
  card: {
    view: "Дивитися →",
  },
  codeBlock: {
    copy: "Копіювати",
    copied: "Скопійовано ✓",
  },
  sidebar: {
    index: "Покажчик патернів",
  },
  titleBlock: {
    drawingNo: "Кресл. №",
    category: "Категорія",
    examples: "Приклади",
    stack: "Стек",
    files: ukFiles,
  },
  patternPage: {
    problem: "Проблема",
    solution: "Відповідь патерну",
    whenToUse: "Коли варто застосувати",
    avoidWhen: "Коли не варто",
    realWorld: "Де це реально трапляється",
    inCode: "У коді",
    prosTitle: "Компроміси — плюси",
    consTitle: "Компроміси — мінуси",
    previous: "← Попередній",
    next: "Наступний →",
  },
  footer: {
    edition: "Патерни проєктування / Frontend-видання",
    stack: "React · Next.js · TypeScript · Tailwind",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { en, uk };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
