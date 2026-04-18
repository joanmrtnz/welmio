import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

type AnalyticsSummaryResponse = {
  period: AnalyticsPeriod;
  totals: {
    balance: number;
    income: number;
    expense: number;
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

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(
    userId: string,
    period: AnalyticsPeriod = 'weekly',
  ): Promise<AnalyticsSummaryResponse> {
    const { startDate, endDate, labels } = this.getRangeByPeriod(period);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const incomeTransactions = transactions.filter(
      (transaction) => transaction.type === 'income',
    );

    const expenseTransactions = transactions.filter(
      (transaction) => transaction.type === 'expense',
    );

    const income = incomeTransactions.reduce(
      (sum, transaction) => sum + this.toNumber(transaction.amount),
      0,
    );

    const expense = expenseTransactions.reduce(
      (sum, transaction) => sum + this.toNumber(transaction.amount),
      0,
    );

    const balance = income - expense;

    const chart = this.buildChart(period, labels, transactions);

    // todo: make this value programmatic
    const budgetLimit = 20000;
    const spentPercentage =
      budgetLimit > 0
        ? Math.min(Math.round((expense / budgetLimit) * 100), 100)
        : 0;

    return {
      period,
      totals: {
        balance: this.roundTo2(balance),
        income: this.roundTo2(income),
        expense: this.roundTo2(expense),
      },
      budget: {
        spentPercentage,
        spentAmount: this.roundTo2(expense),
        limitAmount: budgetLimit,
        message: `${spentPercentage}% Of Your Expenses, Looks Good.`,
      },
      chart,
      targets: [],
    };
  }

  private getRangeByPeriod(period: AnalyticsPeriod): {
    startDate: Date;
    endDate: Date;
    labels: string[];
  } {
    const now = new Date();

    switch (period) {
      case 'daily':
        return this.getDailyRange(now);
      case 'weekly':
        return this.getWeeklyRange(now);
      case 'monthly':
        return this.getMonthlyRange(now);
      case 'yearly':
        return this.getYearlyRange(now);
      default:
        return this.getWeeklyRange(now);
    }
  }

  private getDailyRange(now: Date): {
    startDate: Date;
    endDate: Date;
    labels: string[];
  } {
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    const labels = [
      '00',
      '04',
      '08',
      '12',
      '16',
      '20',
    ];

    return { startDate, endDate, labels };
  }

  private getWeeklyRange(now: Date): {
    startDate: Date;
    endDate: Date;
    labels: string[];
  } {
    const current = new Date(now);
    const day = current.getDay(); // 0 sunday, 1 monday...
    const mondayOffset = day === 0 ? -6 : 1 - day;

    const startDate = new Date(current);
    startDate.setDate(current.getDate() + mondayOffset);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return { startDate, endDate, labels };
  }

  private getMonthlyRange(now: Date): {
    startDate: Date;
    endDate: Date;
    labels: string[];
  } {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const labels = ['W1', 'W2', 'W3', 'W4', 'W5'];

    return { startDate, endDate, labels };
  }

  private getYearlyRange(now: Date): {
    startDate: Date;
    endDate: Date;
    labels: string[];
  } {
    const startDate = new Date(now.getFullYear(), 0, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now.getFullYear(), 11, 31);
    endDate.setHours(23, 59, 59, 999);

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return { startDate, endDate, labels };
  }

  private buildChart(
    period: AnalyticsPeriod,
    labels: string[],
    transactions: Array<{
      type: string;
      amount: unknown;
      date: Date;
    }>,
  ): {
    labels: string[];
    income: number[];
    expense: number[];
  } {
    const incomeMap = new Map<string, number>();
    const expenseMap = new Map<string, number>();

    for (const label of labels) {
      incomeMap.set(label, 0);
      expenseMap.set(label, 0);
    }

    for (const transaction of transactions) {
      const bucket = this.getBucketLabel(period, transaction.date, labels);

      if (!bucket) continue;

      const amount = this.toNumber(transaction.amount);

      if (transaction.type === 'income') {
        incomeMap.set(bucket, (incomeMap.get(bucket) ?? 0) + amount);
      } else if (transaction.type === 'expense') {
        expenseMap.set(bucket, (expenseMap.get(bucket) ?? 0) + amount);
      }
    }

    return {
      labels,
      income: labels.map((label) => this.roundTo2(incomeMap.get(label) ?? 0)),
      expense: labels.map((label) => this.roundTo2(expenseMap.get(label) ?? 0)),
    };
  }

  private getBucketLabel(
    period: AnalyticsPeriod,
    date: Date,
    labels: string[],
  ): string | null {
    const transactionDate = new Date(date);

    if (period === 'daily') {
      const hour = transactionDate.getHours();

      if (hour < 4) return '00';
      if (hour < 8) return '04';
      if (hour < 12) return '08';
      if (hour < 16) return '12';
      if (hour < 20) return '16';
      return '20';
    }

    if (period === 'weekly') {
      const day = transactionDate.getDay();
      const weekMap: Record<number, string> = {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat',
        0: 'Sun',
      };

      return weekMap[day] ?? null;
    }

    if (period === 'monthly') {
      const dayOfMonth = transactionDate.getDate();

      if (dayOfMonth <= 7) return 'W1';
      if (dayOfMonth <= 14) return 'W2';
      if (dayOfMonth <= 21) return 'W3';
      if (dayOfMonth <= 28) return 'W4';
      return 'W5';
    }

    if (period === 'yearly') {
      const month = transactionDate.getMonth();
      return labels[month] ?? null;
    }

    return null;
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') return value;

    if (
      typeof value === 'object' &&
      value !== null &&
      'toNumber' in value &&
      typeof (value as { toNumber: () => number }).toNumber === 'function'
    ) {
      return (value as { toNumber: () => number }).toNumber();
    }

    return Number(value ?? 0);
  }

  private roundTo2(value: number): number {
    return Math.round(value * 100) / 100;
  }
}