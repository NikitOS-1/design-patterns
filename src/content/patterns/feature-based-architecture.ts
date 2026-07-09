import { Pattern } from "@/lib/types";

export const featureBasedArchitecture: Pattern = {
  slug: "feature-based-architecture",
  category: "architecture-frontend",
  code: "A-07",
  name: "Feature-Based Architecture",
  oneLiner:
    "Group all code for a product feature — components, hooks, API calls, and types — into a single self-contained folder with a public entry point.",
  problem:
    "Organizing a codebase by technical role — components/, hooks/, services/, types/ — feels intuitive at first but creates invisible coupling as the application grows. A change to the billing flow requires edits across four top-level folders, making it hard to reason about scope or assign ownership. Searching for all code related to one product feature means grepping through the entire codebase. Shared folders accumulate code from unrelated domains, so removing a feature requires archaeology rather than deleting a folder. The technical split also does not map to how product teams think, plan, and review work.",
  solution:
    "Feature-Based Architecture co-locates everything that belongs to one product feature in a single directory. Each feature owns its React components, custom hooks, API functions, TypeScript types, constants, and tests. Features expose a public API through an index.ts barrel that controls what the rest of the application may consume. Code inside a feature folder is private by convention — other features import only from the public API, never from internal paths. A shared layer at the root level holds primitives that genuinely belong to no single feature: design-system components, HTTP client wrappers, formatting utilities, and global types. Compared to FSD, Feature-Based Architecture is lighter — it has no mandatory layer hierarchy, no fixed segment names, and no cross-layer import rules beyond the basic inward-only shared dependency. This makes it approachable for small to medium teams while still providing clear ownership and colocation benefits.",
  whenToUse: [
    "Small to medium teams where the simpler structure of feature folders is enough to maintain clear ownership",
    "Products with well-defined vertical domains that change independently and map naturally to separate feature directories",
    "Projects migrating away from a purely technical folder structure and needing an incremental path toward better boundaries",
    "Teams that want colocation and explicit public APIs without the ceremony of a formal layered architecture",
  ],
  avoidWhen: [
    "Large teams where unconstrained cross-feature imports accumulate without enforced layer rules, degrading into a flat mess",
    "Domains with complex inter-feature dependencies that require explicit layer ordering to prevent cycles",
    "Projects that have already grown past the point where informal conventions hold without tooling enforcement",
  ],
  realWorldExamples: [
    {
      name: "Authentication feature",
      detail:
        "A features/auth/ folder holds LoginForm, useLogin, authApi, AuthGuard, and token utilities. Other features import useCurrentUser from features/auth but never touch internal implementation files.",
    },
    {
      name: "Notifications feature",
      detail:
        "features/notifications/ owns the bell icon widget, the notification drawer, the useNotifications hook that polls the API, and the markAsRead mutation. The public index.ts exports only the two components and the hook.",
    },
    {
      name: "Workspace settings feature",
      detail:
        "features/workspace/ groups WorkspaceSettingsPage, WorkspaceMembersTable, useWorkspaceMembers, and workspaceApi. Integration tests live alongside the feature code rather than in a separate test tree.",
    },
    {
      name: "Design system + shared layer",
      detail:
        "shared/ui/ holds Button, Input, and Modal. shared/api/ holds the configured Axios instance. Features import from shared but never from one another's internal paths, keeping the shared layer lean and stable.",
    },
  ],
  codeExamples: [
    {
      filename: "src/features/notifications/index.ts",
      language: "ts",
      description:
        "The feature's public API. Only these exports are available to the rest of the application — nothing else in this folder is reachable from outside.",
      code: `export { NotificationBell } from "./ui/NotificationBell";
export { NotificationDrawer } from "./ui/NotificationDrawer";
export { useNotifications } from "./model/useNotifications";
export type { Notification, NotificationStatus } from "./model/types";`,
    },
    {
      filename: "src/features/notifications/model/useNotifications.ts",
      language: "ts",
      description:
        "A custom hook that owns the feature's data-fetching and mutation logic, keeping components thin and focused on rendering.",
      code: `import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markNotificationRead } from "../api/notificationsApi";
import type { Notification } from "./types";

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => void;
}

export function useNotifications(): UseNotificationsResult {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotifications,
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return { notifications, unreadCount, isLoading, markAsRead };
}`,
    },
    {
      filename: "src/shared/ui/Badge/index.ts",
      language: "ts",
      description:
        "A shared primitive with its own public API. Features import from shared/ui/Badge, never from deeper internal paths.",
      code: `export { Badge } from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge.types";`,
    },
  ],
  pros: [
    "Colocation makes feature scope obvious — adding or removing a feature means one folder, not many scattered files",
    "Public index.ts contracts keep inter-feature coupling explicit and prevent accidental internal access",
    "Approachable structure for teams transitioning from technical folder organization without requiring full FSD adoption",
  ],
  cons: [
    "Without enforced layer rules, cross-feature imports can accumulate informally and introduce hidden coupling",
    "Shared layer ownership is ambiguous — teams disagree on what belongs there versus inside a feature",
    "Scales less predictably than FSD when team size grows beyond the point where informal conventions hold",
  ],
};
