import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { TransactionsOverviewResponse } from "@repo/shared-types";

export function useTransactionsOverview() {
  const [data, setData] = useState<TransactionsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiFetch<TransactionsOverviewResponse>(
        "/transactions/overview"
      );

      setData(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load transactions";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    execute().catch(console.warn);
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}