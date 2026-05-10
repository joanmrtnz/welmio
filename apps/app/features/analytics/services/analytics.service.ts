import { apiFetch } from "@/app/lib/api/client";

export type AnalyticsPeriod = "daily" | "weekly" | "monthly" | "yearly";
export type AnalyticsTransactionType = "income" | "expense";
export type AnalyticsSortOrder = "asc" | "desc";

export type TransactionsByCategoryItem = {
  categoryId: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: AnalyticsTransactionType;
  total: string;
  percentage: number;
  transactionsCount: number;
};

export type TransactionsByCategoryResponse = {
  period: AnalyticsPeriod;
  type: AnalyticsTransactionType;
  total: string;
  items: TransactionsByCategoryItem[];
};

export type GetTransactionsByCategoryParams = {
  period?: AnalyticsPeriod;
  type?: AnalyticsTransactionType;
  order?: AnalyticsSortOrder;
};

export async function getTransactionsByCategories({
  period = "monthly",
  type = "expense",
  order = "desc",
}: GetTransactionsByCategoryParams = {}) {
  const params = new URLSearchParams({
    period,
    type,
    order,
  });

  return apiFetch<TransactionsByCategoryResponse>(
    `/transactions/analytics/categories?${params.toString()}`,
  );
}

export type GoalContributionAnalyticsItem = {
  goalId: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: string;
  status: string;
  currency: string;
  total: string;
  percentage: number;
  contributionsCount: number;
};

export type GoalContributionsAnalyticsResponse = {
  period: AnalyticsPeriod;
  total: string;
  items: GoalContributionAnalyticsItem[];
};

export type GetGoalContributionsAnalyticsParams = {
  period?: AnalyticsPeriod;
  order?: AnalyticsSortOrder;
};

export async function getGoalContributionsAnalytics({
  period = "monthly",
  order = "desc",
}: GetGoalContributionsAnalyticsParams = {}) {
  const params = new URLSearchParams({
    period,
    order,
  });

  return apiFetch<GoalContributionsAnalyticsResponse>(
    `/goals/analytics/contributions?${params.toString()}`,
  );
}
