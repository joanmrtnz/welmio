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
