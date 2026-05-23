import { useEffect, useMemo, useState } from "react";

import { getGoalContributionsAnalytics } from "../services/analytics.service";
import type {
  AnalyticsPeriod,
  GoalContributionsAnalyticsResponse,
} from "../services/analytics.service";

export type GoalContributionChartItem = {
  id: string;
  label: string;
  amount: number;
  percent: number;
  color?: string | null;
  icon?: string | null;
  currency: string;
  contributionsCount: number;
};

type UseGoalContributionsAnalyticsParams = {
  period: AnalyticsPeriod;
};

export function useGoalContributionsAnalytics({
  period,
}: UseGoalContributionsAnalyticsParams) {
  const [data, setData] = useState<GoalContributionsAnalyticsResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGoalContributions() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getGoalContributionsAnalytics({
          period,
          order: "desc",
        });

        if (!isMounted) return;

        setData(response);
      } catch (requestError) {
        if (!isMounted) return;

        console.warn(
          "[useGoalContributionsAnalytics] load error:",
          requestError,
        );
        setError(
          requestError instanceof Error
            ? requestError
            : new Error("Error loading goal contributions"),
        );
        setData(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGoalContributions();

    return () => {
      isMounted = false;
    };
  }, [period]);

  const goals = useMemo<GoalContributionChartItem[]>(() => {
    if (!data?.items?.length) return [];

    return data.items.map((item) => ({
      id: item.goalId,
      label: item.name,
      amount: Number(item.total),
      percent: Math.min(Math.max(item.percentage, 0), 100),
      color: item.color,
      icon: item.icon,
      currency: item.currency,
      contributionsCount: item.contributionsCount,
    }));
  }, [data]);

  return {
    data,
    goals,
    isLoading,
    error,
  };
}
