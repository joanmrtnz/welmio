import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TransactionOverviewGroupDto,
  TransactionOverviewItemDto,
  TransactionsOverviewResponseDto,
} from './dto/transactions-overview-response.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}


  async getUserTransactions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            currencies: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getUserTransactionsOverview(
    userId: string,
  ): Promise<TransactionsOverviewResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
            type: true,
          },
        },
        account: {
          select: {
            id: true,
            name: true,
            type: true,
            currencies: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const transaction of transactions) {
      const amount = Number(transaction.amount);

      if (transaction.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
    }

    const totalBalance = totalIncome - totalExpense;
    const expenseRatio =
      totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

    const progressMessage =
      totalIncome > 0
        ? `${expenseRatio}% of your income has been spent.`
        : 'No income registered yet.';

    const groupedByMonth = new Map<string, TransactionOverviewItemDto[]>();

    for (const transaction of transactions) {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('en-US', {
        month: 'long',
      });

      const item: TransactionOverviewItemDto = {
        id: transaction.id,
        description: transaction.description,
        notes: transaction.notes,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
        type: transaction.type,
        date: transaction.date.toISOString(),
        frequencyType: transaction.frequencyType,
        transactionNature: transaction.transactionNature,
        category: {
          id: transaction.category.id,
          name: transaction.category.name,
          icon: transaction.category.icon,
          color: transaction.category.color,
          type: transaction.category.type,
        },
        account: {
          id: transaction.account.id,
          name: transaction.account.name,
          type: transaction.account.type,
          currencies: transaction.account.currencies,
        },
      };

      if (!groupedByMonth.has(month)) {
        groupedByMonth.set(month, []);
      }

      groupedByMonth.get(month)!.push(item);
    }

    const groups: TransactionOverviewGroupDto[] = Array.from(
      groupedByMonth.entries(),
    ).map(([month, items]) => ({
      month,
      items,
    }));

    return {
      summary: {
        totalBalance: totalBalance.toFixed(2),
        totalIncome: totalIncome.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
        expenseRatio,
        progressMessage,
      },
      groups,
    };
  }
}