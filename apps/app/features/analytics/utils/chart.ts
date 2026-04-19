import { formatCompactNumber } from "./format";

export function getChartMaxValue(
  income: number[],
  expense: number[],
): number {
  const maxIncome = income.length ? Math.max(...income) : 0;
  const maxExpense = expense.length ? Math.max(...expense) : 0;
  return Math.max(maxIncome, maxExpense, 1);
}

export function getChartYAxisLabels(maxValue: number): string[] {
  const safeMax = Math.max(maxValue, 1);
  const step = safeMax / 4;

  return [4, 3, 2, 1].map((multiplier) =>
    formatCompactNumber(step * multiplier),
  );
}

type ChartBarItem = {
  label: string;
  income: number;
  expense: number;
};

export function normalizeChartBars(
  labels: string[],
  income: number[],
  expense: number[],
  maxHeight = 90,
): ChartBarItem[] {
  const maxValue = getChartMaxValue(income, expense);

  return labels.map((label, index) => ({
    label,
    income: Math.round((income[index] / maxValue) * maxHeight),
    expense: Math.round((expense[index] / maxValue) * maxHeight),
  }));
}