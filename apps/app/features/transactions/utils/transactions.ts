import {
  TransactionOverviewGroup,
  TransactionsOverviewResponse,
} from "@repo/shared-types";

export type TotalFilter = "all" | "income" | "expense";

export function getFilteredTransactionGroups(
  data: TransactionsOverviewResponse | null,
  totalsFilter: TotalFilter,
  selectedCategoryIds: string[] = [],
): TransactionOverviewGroup[] {
  if (!data) return [];

  return data.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const matchesTotalFilter =
          totalsFilter === "all" || item.type === totalsFilter;

        const matchesCategoryFilter =
          selectedCategoryIds.length === 0 ||
          selectedCategoryIds.includes(item.category.id);

        return matchesTotalFilter && matchesCategoryFilter;
      }),
    }))
    .filter((group) => group.items.length > 0);
}