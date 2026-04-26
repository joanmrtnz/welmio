import { TransactionOverviewGroup, TransactionsOverviewResponse } from "@repo/shared-types";

export type TotalFilter = "all" | "income" | "expense";

export function getFilteredTransactionGroups(
  data: TransactionsOverviewResponse | null,
  totalsFilter: TotalFilter,
): TransactionOverviewGroup[] {
  if (!data) return [];

  if (totalsFilter === "all") {
    return data.groups;
  }

  return data.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.type === totalsFilter),
    }))
    .filter((group) => group.items.length > 0);
}