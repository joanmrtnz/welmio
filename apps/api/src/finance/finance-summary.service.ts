import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FinanceSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserFinanceSummary(userId: string) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      select: {
        amount: true,
        type: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const transaction of transactions) {
      const amount = Number(transaction.amount);

      if (transaction.type === 'income') totalIncome += amount;
      else totalExpense += amount;
    }

    const totalBalance = totalIncome - totalExpense;
    const expenseRatio =
      totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

    const progressMessage =
      totalIncome > 0
        ? `${expenseRatio}% of your income has been spent.`
        : 'No income registered yet.';

    return {
      totalBalance: totalBalance.toFixed(2),
      totalIncome: totalIncome.toFixed(2),
      totalExpense: totalExpense.toFixed(2),
      expenseRatio,
      progressMessage,
    };
  }
}