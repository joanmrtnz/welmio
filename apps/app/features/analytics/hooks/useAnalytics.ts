import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api/client";
import { AnalyticsPeriod, AnalyticsResponse } from "@repo/shared-types";

export function useAnalytics() {
  const [selected, setSelected] = useState<AnalyticsPeriod>("monthly");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);

        const response = await apiFetch<AnalyticsResponse>(
          `/analytics/summary?period=${selected}`,
        );

        setData(response);
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [selected]);

  return {
    selected,
    setSelected,
    data,
    loading,
  };
}