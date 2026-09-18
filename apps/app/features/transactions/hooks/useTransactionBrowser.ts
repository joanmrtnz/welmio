import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { apiFetch } from "@/lib/api/client";
import type { BrowseTransactionsResponse } from "@repo/shared-types";
import { groupByLocalMonth, presetRange, rangeQuery } from "../utils/dateRange";
import type { TotalFilter } from "../utils/transactions";

export function useTransactionBrowser() {
  const [filters, setFilters] = useState({
    range: presetRange("lastMonth"),
    type: "all" as TotalFilter,
    categoryIds: [] as string[],
    search: "",
    page: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState<BrowseTransactionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const requestId = useRef(0);

  const updateFilters = useCallback(
    (patch: Partial<Omit<typeof filters, "page">>) => {
      // A single state change prevents requests for the old page with new filters.
      setFilters((previous) => ({ ...previous, ...patch, page: 1 }));
    },
    [],
  );

  useEffect(() => {
    if (searchInput.trim() === filters.search) return;
    const timer = setTimeout(
      () => updateFilters({ search: searchInput.trim() }),
      300,
    );
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, updateFilters]);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      page: String(filters.page),
      pageSize: "25",
    });
    const bounds = rangeQuery(filters.range);
    if (bounds.startDate) params.set("startDate", bounds.startDate);
    if (bounds.endDate) params.set("endDate", bounds.endDate);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.categoryIds.length)
      params.set("categoryIds", filters.categoryIds.join(","));
    if (filters.search.trim()) params.set("search", filters.search.trim());
    return params.toString();
  }, [filters]);

  const loadTransactions = useCallback(async () => {
    const id = ++requestId.current;
    setIsLoading(true);
    setError(false);
    try {
      const response = await apiFetch<BrowseTransactionsResponse>(
        `/transactions/browse?${query}`,
      );
      if (id === requestId.current)
        setData({ ...response, groups: groupByLocalMonth(response.groups) });
    } catch {
      if (id === requestId.current) setError(true);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      void loadTransactions();
      return () => {
        requestId.current += 1;
      };
    }, [loadTransactions]),
  );

  useEffect(
    () => () => {
      requestId.current += 1;
    },
    [],
  );

  return {
    searchInput,
    setSearchInput,
    clearSearch: () => {
      setSearchInput("");
      updateFilters({ search: "" });
    },
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    loadTransactions,
    setPage: (page: number) =>
      setFilters((previous) => ({ ...previous, page })),
  };
}
