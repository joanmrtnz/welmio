export type AnalyticsPeriod = "daily" | "weekly" | "monthly" | "yearly";

export type AnalyticsResponse = {
  period: AnalyticsPeriod;
  summary: {
    totalBalance: string;
    totalIncome: string;
    totalExpense: string;
    expenseRatio: number;
    progressMessage: string;
  };
  budget: {
    spentPercentage: number;
    spentAmount: number;
    limitAmount: number | null;
    message: string;
  };
  chart: {
    labels: string[];
    income: number[];
    expense: number[];
  };
  targets: Array<{
    id: string;
    name: string;
    progress: number;
    currentAmount: number;
    targetAmount: number;
  }>;
};