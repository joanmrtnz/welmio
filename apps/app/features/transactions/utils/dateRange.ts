import type { DateRange, TransactionOverviewGroup } from "@repo/shared-types";

export type DatePreset = "thisMonth" | "lastMonth" | "thisYear" | "allTime";

export function monthRange(year: number, month: number): DateRange {
  return {
    startDate: new Date(year, month, 1),
    endDate: new Date(year, month + 1, 0),
  };
}

export function presetRange(preset: DatePreset, now = new Date()): DateRange {
  if (preset === "allTime") return { startDate: null, endDate: null };
  if (preset === "thisYear")
    return {
      startDate: new Date(now.getFullYear(), 0, 1),
      endDate: new Date(now.getFullYear(), 11, 31),
    };
  return monthRange(
    now.getFullYear(),
    now.getMonth() - (preset === "lastMonth" ? 1 : 0),
  );
}

export function dateInputValue(date: Date | null): string {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1000 || year > 9999) return null;
  const date = new Date(year, month - 1, day);
  return dateInputValue(date) === value ? date : null;
}

/** Local calendar boundaries serialized as instants; end is exclusive, including DST days. */
export function rangeQuery(range: DateRange): {
  startDate?: string;
  endDate?: string;
} {
  const result: { startDate?: string; endDate?: string } = {};
  if (range.startDate) {
    const start = new Date(range.startDate);
    start.setHours(0, 0, 0, 0);
    result.startDate = start.toISOString();
  }
  if (range.endDate || range.startDate) {
    const end = new Date((range.endDate ?? range.startDate)!);
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    result.endDate = end.toISOString();
  }
  return result;
}

export function formatPeriod(
  range: DateRange,
  locale: string,
  allTime: string,
): string {
  if (!range.startDate && !range.endDate) return allTime;
  const format = (date: Date) =>
    date.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  if (range.startDate && range.endDate)
    return `${format(range.startDate)} – ${format(range.endDate)}`;
  return format((range.startDate ?? range.endDate)!);
}

/** Align headings with the local dates shown in rows and used by the date picker. */
export function groupByLocalMonth(
  groups: TransactionOverviewGroup[],
): TransactionOverviewGroup[] {
  const months = new Map<string, TransactionOverviewGroup["items"]>();
  for (const group of groups) {
    for (const item of group.items) {
      const month = dateInputValue(new Date(item.date)).slice(0, 7);
      const items = months.get(month) ?? [];
      items.push(item);
      months.set(month, items);
    }
  }
  return Array.from(months, ([month, items]) => ({ month, items }));
}
