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

  if (safeMax <= 4) {
    return ["4", "3", "2", "1"];
  }

  const rawStep = safeMax / 4;
  const step = getNiceStep(rawStep);

  return [step * 4, step * 3, step * 2, step].map(formatCompactNumber);
}

function getNiceStep(value: number): number {
  if (value <= 1) return 1;
  if (value <= 2) return 2;
  if (value <= 5) return 5;
  if (value <= 10) return 10;
  if (value <= 25) return 25;
  if (value <= 50) return 50;
  if (value <= 100) return 100;
  if (value <= 250) return 250;
  if (value <= 500) return 500;
  if (value <= 1000) return 1000;

  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;

  if (normalized <= 1) return 1 * magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;

  return 10 * magnitude;
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