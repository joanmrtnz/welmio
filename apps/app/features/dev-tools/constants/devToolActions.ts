import type { IconName } from "@repo/shared-types";

export const DEV_TOOL_ACTIONS = [
  {
    id: "import-realistic-transactions",
    label: "Import 50 transactions",
    description: "Adds realistic income and expense transactions.",
    icon: "plus",
    iconSize: 22,
    destructive: false,
  },
  {
    id: "delete-random-transactions",
    label: "Delete 10 random transactions",
    description: "Removes random transactions from this account.",
    icon: "bin",
    iconSize: 19,
    destructive: true,
  },
  {
    id: "update-sample-categories",
    label: "Update categories",
    description: "Applies sample names, icons, and colors.",
    icon: "edit",
    iconSize: 15,
    destructive: false,
  },
  {
    id: "create-savings-goal",
    label: "Create savings goal",
    description: "Adds a realistic savings goal.",
    icon: "plus",
    iconSize: 22,
    destructive: false,
  },
  {
    id: "refresh-analytics",
    label: "Refresh analytics",
    description: "Reloads analytics data.",
    icon: "income",
    iconSize: 22,
    destructive: false,
  },
] as const satisfies readonly {
  id: string;
  label: string;
  description: string;
  icon: IconName;
  iconSize: number;
  destructive: boolean;
}[];

export type DevToolAction = (typeof DEV_TOOL_ACTIONS)[number];
export type DevToolActionId = DevToolAction["id"];
