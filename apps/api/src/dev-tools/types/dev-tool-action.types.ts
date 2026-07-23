export const DEV_TOOL_ACTION_IDS = [
  'import-realistic-transactions',
  'delete-random-transactions',
  'update-sample-categories',
  'rotate-category-name',
  'create-savings-goal',
  'refresh-analytics',
] as const;

export type DevToolActionId = (typeof DEV_TOOL_ACTION_IDS)[number];

export type DevToolActionResult = {
  actionId: DevToolActionId;
  success: boolean;
  message: string;
  summary?: Record<string, number | string | boolean>;
};
