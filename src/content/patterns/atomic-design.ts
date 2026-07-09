import { Pattern } from "@/lib/types";

export const atomicDesign: Pattern = {
  slug: "atomic-design",
  category: "architecture-frontend",
  code: "A-09",
  name: "Atomic Design",
  oneLiner:
    "Build UI from the smallest visual primitives upward — atoms to molecules to organisms to templates to pages — to create a consistent, composable design system.",
  problem:
    "Design systems grow inconsistently when UI components are built on demand without a structural hierarchy. Teams create similar buttons, inputs, and cards in multiple places with subtle differences in spacing, color, and behavior. New components are large and monolithic from the start, mixing layout, domain data, and interaction in one file. Reuse is accidental rather than intentional. When the design team changes a primary button style, engineers must hunt across dozens of components to find every affected usage. The underlying problem is that there is no shared language between designers and engineers for the granularity of UI building blocks.",
  solution:
    "Atomic Design, introduced by Brad Frost, provides a five-level hierarchy that maps chemistry metaphors to UI components. Atoms are the smallest indivisible UI elements: Button, Input, Label, Icon, Badge. They carry visual style and accessibility attributes but have no domain knowledge. Molecules combine atoms into simple functional units: SearchField (Label + Input + Button), FormField (Label + Input + ErrorMessage). Organisms compose molecules and atoms into a distinct section of the UI: NavigationBar, ProductCard, CheckoutFormSection. Templates define page layout structure with placeholders for content, establishing the spatial arrangement without real data. Pages fill templates with real data and are the level where domain concerns appear. Atomic Design is a design-system methodology, not a product architecture. It governs how UI primitives are organized and reused, and pairs well with FSD or Feature-Based Architecture, where atoms through organisms live in the shared or design-system layer and templates and pages live in the pages layer.",
  whenToUse: [
    "Products with a substantial design system that many teams and features consume, where visual consistency and reuse require explicit structural rules",
    "Repositories that maintain both a component library and product features, needing a clear boundary between generic UI and domain-specific UI",
    "Teams that work closely with designers using component-based design tools like Figma where the atomic hierarchy aligns the shared vocabulary",
    "Organizations building a shared component library consumed across multiple products or applications",
  ],
  avoidWhen: [
    "Using Atomic Design as the primary product architecture — it describes UI hierarchy, not domain boundaries or module ownership",
    "Small applications without a genuine design system need — applying five levels to a project with ten screens adds complexity without benefit",
    "Teams that confuse the atom/molecule/organism classification as a strict enforcement layer rather than a communication and organization tool",
  ],
  realWorldExamples: [
    {
      name: "Design system in a monorepo",
      detail:
        "packages/design-system/ organizes atoms like Button and Badge, molecules like FormField and Tooltip, and organisms like DataTable and Modal. Product applications import from this package without owning the primitives.",
    },
    {
      name: "Storybook-driven component library",
      detail:
        "Each atom and molecule has a dedicated Storybook story. Designers review components in Storybook before they appear in product pages. The hierarchy makes it easy to locate the right level of abstraction for a given visual need.",
    },
    {
      name: "FSD shared layer as atomic library",
      detail:
        "In an FSD project, shared/ui/ follows atomic conventions. atoms/ holds Button, Icon, and Spinner. molecules/ holds SearchField and MenuDropdown. organisms/ holds PageHeader. Features and widgets import from shared/ui without reimplementing primitives.",
    },
    {
      name: "Template-driven page consistency",
      detail:
        "A DashboardTemplate defines a two-column layout with sidebar and content area slots. Every dashboard page uses the template to ensure consistent spacing and breakpoints without repeating layout code.",
    },
  ],
  codeExamples: [
    {
      filename: "src/shared/ui/atoms/Button/Button.tsx",
      language: "tsx",
      description:
        "An atom: a single-purpose visual primitive with no domain knowledge. It accepts only presentation-level props and delegates interaction to the caller.",
      code: `import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[styles.button, styles[variant], styles[size], className]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden /> : children}
    </button>
  );
}`,
    },
    {
      filename: "src/shared/ui/molecules/SearchField/SearchField.tsx",
      language: "tsx",
      description:
        "A molecule: combines the Input atom and Button atom into a functional search unit. It introduces a single interaction contract but still carries no domain knowledge.",
      code: `import { FormEvent, useRef } from "react";
import { Button } from "@/shared/ui/atoms/Button/Button";
import { Input } from "@/shared/ui/atoms/Input/Input";

export interface SearchFieldProps {
  placeholder?: string;
  defaultValue?: string;
  isLoading?: boolean;
  onSearch: (query: string) => void;
}

export function SearchField({
  placeholder = "Search…",
  defaultValue = "",
  isLoading = false,
  onSearch,
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inputRef.current) {
      onSearch(inputRef.current.value.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-label={placeholder}
      />
      <Button type="submit" variant="primary" isLoading={isLoading}>
        Search
      </Button>
    </form>
  );
}`,
    },
  ],
  pros: [
    "Creates a shared vocabulary between designers and engineers that maps directly to design tool components",
    "Promotes visual consistency by reusing atoms and molecules across all product surfaces rather than reimplementing similar UI",
    "Makes the design system independently testable, documentable, and publishable as a standalone Storybook or package",
  ],
  cons: [
    "The atom/molecule/organism classification can become subjective and lead to debates about where a component belongs",
    "Does not address domain boundaries, state management, or data-fetching — teams need a complementary architecture for those concerns",
    "Premature atomic decomposition in simple apps creates fragmentation without the reuse benefits that justify the structure",
  ],
};
