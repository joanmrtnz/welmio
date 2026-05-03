import type {
  TransactionOverviewGroup,
  TransactionsOverviewResponse,
} from "@repo/shared-types";

export type TotalFilter = "all" | "income" | "expense";

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export function getFilteredTransactionGroups(
  data: TransactionsOverviewResponse | null,
  totalsFilter: TotalFilter,
  selectedCategoryIds: string[] = [],
  selectedDateRange?: DateRange,
): TransactionOverviewGroup[] {
  if (!data) return [];

  const normalizedStartDate = selectedDateRange?.startDate
    ? startOfDay(selectedDateRange.startDate)
    : null;

  const normalizedEndDate = selectedDateRange?.endDate
    ? endOfDay(selectedDateRange.endDate)
    : selectedDateRange?.startDate
      ? endOfDay(selectedDateRange.startDate)
      : null;

  return data.groups
    .map((group) => {
      const filteredItems = group.items.filter((transaction) => {
        const matchesType =
          totalsFilter === "all" || transaction.type === totalsFilter;

        const matchesCategory =
          selectedCategoryIds.length === 0 ||
          selectedCategoryIds.includes(transaction.category.id);

        const matchesDate = isDateInsideRange(
          transaction.date,
          normalizedStartDate,
          normalizedEndDate,
        );

        return matchesType && matchesCategory && matchesDate;
      });

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);
}

function isDateInsideRange(
  dateValue: string,
  startDate: Date | null,
  endDate: Date | null,
) {
  if (!startDate && !endDate) return true;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  if (startDate && date < startDate) {
    return false;
  }

  if (endDate && date > endDate) {
    return false;
  }

  return true;
}

function startOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
}

function endOfDay(date: Date) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(23, 59, 59, 999);
  return normalizedDate;
}