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
    howItWorks: string;
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
      "architecture-frontend": "FE Arch",
      "architecture-backend": "BE Arch",
      "architecture-shared": "Shared",
    },
    github: "GitHub ↗",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: (count) => `${count} patterns & architectures for React and NestJS`,
    titleLine1: "Design patterns,",
    titleLine2: "as they actually appear",
    titleAccent: "in production",
    paragraph:
      "The 23 Gang-of-Four patterns, modern React patterns, and named frontend/backend architectures — rebuilt as React, Next.js, NestJS, and TypeScript. Not another Animal/Shape UML diagram: the same shapes you'll find inside Prisma, Stripe.js, TanStack Query, Radix, and your own codebase.",
  },
  category: {
    label: {
      creational: "Creational",
      structural: "Structural",
      behavioral: "Behavioral",
      react: "React Patterns",
      "architecture-frontend": "Frontend Architectures",
      "architecture-backend": "Backend Architectures",
      "architecture-shared": "Shared Architectures",
    },
    blurb: {
      creational:
        "How objects and components get built, so creation logic doesn't leak everywhere.",
      structural: "How components, modules, and data shapes are composed together.",
      behavioral: "How responsibilities and communication flow between parts of the app.",
      react:
        "Patterns that aren't in the Gang of Four book but are the real vocabulary of production React today.",
      "architecture-frontend":
        "Architectures you reach for most often in React and Next.js — FSD, feature-based, Atomic Design, modular monolith, and micro frontends.",
      "architecture-backend":
        "Architectures common in NestJS and Node.js backends — layered, Clean/Hexagonal, CQRS, events, BFF, sagas, and microservices.",
      "architecture-shared":
        "Cross-cutting approaches used on both sides of the stack — DDD language, bounded contexts, and shared modeling vocabulary.",
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
    howItWorks: "How it works",
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
    edition: "Design Patterns / React · NestJS",
    stack: "React · Next.js · NestJS · TypeScript · Tailwind",
  },
};

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
      "architecture-frontend": "FE Arch",
      "architecture-backend": "BE Arch",
      "architecture-shared": "Спільні",
    },
    github: "GitHub ↗",
    openMenu: "Відкрити меню",
    closeMenu: "Закрити меню",
  },
  hero: {
    eyebrow: (count) => `${count} патернів і архітектур для React та NestJS`,
    titleLine1: "Патерни проєктування —",
    titleLine2: "такими, якими вони є",
    titleAccent: "у продакшені",
    paragraph:
      "23 патерни «Банди чотирьох», сучасні патерни React і іменовані frontend/backend архітектури — переписані на React, Next.js, NestJS і TypeScript. Не чергова UML-діаграма з Animal/Shape, а ті самі конструкції, які ви знайдете всередині Prisma, Stripe.js, TanStack Query, Radix і власної кодової бази.",
  },
  category: {
    label: {
      creational: "Породжувальні",
      structural: "Структурні",
      behavioral: "Поведінкові",
      react: "React-патерни",
      "architecture-frontend": "Frontend-архітектури",
      "architecture-backend": "Backend-архітектури",
      "architecture-shared": "Спільні архітектури",
    },
    blurb: {
      creational:
        "Як створюються об'єкти та компоненти, щоб логіка створення не розповзалася по всьому коду.",
      structural: "Як компоненти, модулі та структури даних поєднуються між собою.",
      behavioral: "Як відповідальність і комунікація розподіляються між частинами застосунку.",
      react:
        "Патерни, яких немає в книзі «Банди чотирьох», але які сьогодні є справжньою мовою продакшн-React.",
      "architecture-frontend":
        "Архітектури, які найчастіше застосовують у React і Next.js — FSD, feature-based, Atomic Design, modular monolith і micro frontends.",
      "architecture-backend":
        "Архітектури, типові для NestJS і Node.js — layered, Clean/Hexagonal, CQRS, events, BFF, sagas і microservices.",
      "architecture-shared":
        "Наскрізні підходи для обох сторін стеку — мова DDD, bounded contexts і спільний словник моделювання.",
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
    howItWorks: "Як це працює",
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
    edition: "Патерни проєктування / React · NestJS",
    stack: "React · Next.js · NestJS · TypeScript · Tailwind",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { en, uk };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
