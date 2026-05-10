import { useEffect, useMemo, useState } from "react";

import { getTransactionsByCategories } from "../services/analytics.service";
import type {
  AnalyticsPeriod,
  TransactionsByCategoryResponse,
} from "../services/analytics.service";

export type ExpenseCategoryChartItem = {
  id: string;
  label: string;
  amount: number;
  percent: number;
  color?: string | null;
  icon?: string | null;
  transactionsCount: number;
};

type UseExpensesByCategoryAnalyticsParams = {
  period: AnalyticsPeriod;
};

export function useExpensesByCategoryAnalytics({
  period,
}: UseExpensesByCategoryAnalyticsParams) {
  const [data, setData] = useState<TransactionsByCategoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadExpensesByCategory() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getTransactionsByCategories({
          period,
          type: "expense",
          order: "desc",
        });

        if (!isMounted) return;

        setData(response);
      } catch (requestError) {
        if (!isMounted) return;

        console.warn(
          "[useExpensesByCategoryAnalytics] load error:",
          requestError,
        );
        setError(
          requestError instanceof Error
            ? requestError
            : new Error("Error loading expenses by category"),
        );
        setData(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadExpensesByCategory();

    return () => {
      isMounted = false;
    };
  }, [period]);

  const categories = useMemo<ExpenseCategoryChartItem[]>(() => {
    if (!data?.items?.length) return [];

    return data.items.map((item) => ({
      id: item.categoryId,
      label: item.name,
      amount: Number(item.total),
      percent: Math.min(Math.max(item.percentage, 0), 100),
      color: item.color,
      icon: item.icon,
      transactionsCount: item.transactionsCount,
    }));
  }, [data]);

  return {
    data,
    categories,
    isLoading,
    error,
  };
}
