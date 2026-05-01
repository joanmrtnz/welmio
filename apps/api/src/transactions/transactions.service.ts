import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  TransactionOverviewGroupDto,
  TransactionOverviewItemDto,
  TransactionsOverviewResponseDto,
} from './dto/transactions-overview-response.dto';
import { PrismaService } from 'prisma/prisma.service';
import { FinanceSummaryService } from 'src/finance/finance-summary.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Prisma } from '@prisma/client';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly financeSummaryService: FinanceSummaryService,
  ) {}


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

    const [summary, transactions] = await Promise.all([
      this.financeSummaryService.getUserFinanceSummary(userId),
      this.prisma.transaction.findMany({
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
      }),
    ]);

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
      summary,
      groups,
    };
  }

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    const amount = new Prisma.Decimal(createTransactionDto.amount);

    const category = await this.prisma.category.findFirst({
      where: {
        id: createTransactionDto.categoryId,
        userId,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    if (category.type !== createTransactionDto.type) {
      throw new BadRequestException(
        'Transaction type must match category type.',
      );
    }

    const account = await this.prisma.account.findFirst({
      where: {
        id: createTransactionDto.accountId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    return this.prisma.transaction.create({
      data: {
        userId,
        accountId: account.id,
        categoryId: category.id,
        amount,
        currency: createTransactionDto.currency.trim().toUpperCase(),
        type: createTransactionDto.type,
        description: createTransactionDto.description.trim(),
        notes: createTransactionDto.notes?.trim() || null,
        date: new Date(createTransactionDto.date),
        frequencyType: createTransactionDto.frequencyType ?? 'one_time',
        transactionNature: createTransactionDto.transactionNature ?? 'other',
      },
      include: {
        category: true,
        account: true,
      },
    });
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      select: {
        id: true,
        type: true,
        categoryId: true,
        accountId: true,
      },
    });

    if (!existingTransaction) {
      throw new NotFoundException('Transaction not found.');
    }

    const nextType = updateTransactionDto.type ?? existingTransaction.type;
    const nextCategoryId =
      updateTransactionDto.categoryId ?? existingTransaction.categoryId;
    const nextAccountId =
      updateTransactionDto.accountId ?? existingTransaction.accountId;

    const category = await this.prisma.category.findFirst({
      where: {
        id: nextCategoryId,
        userId,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    if (category.type !== nextType) {
      throw new BadRequestException(
        'Transaction type must match category type.',
      );
    }

    const account = await this.prisma.account.findFirst({
      where: {
        id: nextAccountId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found.');
    }

    return this.prisma.transaction.update({
      where: {
        id: existingTransaction.id,
      },
      data: {
        ...(updateTransactionDto.amount !== undefined && {
          amount: new Prisma.Decimal(updateTransactionDto.amount),
        }),
        ...(updateTransactionDto.currency !== undefined && {
          currency: updateTransactionDto.currency.trim().toUpperCase(),
        }),
        ...(updateTransactionDto.type !== undefined && {
          type: updateTransactionDto.type,
        }),
        ...(updateTransactionDto.description !== undefined && {
          description: updateTransactionDto.description.trim(),
        }),
        ...(updateTransactionDto.notes !== undefined && {
          notes: updateTransactionDto.notes?.trim() || null,
        }),
        ...(updateTransactionDto.date !== undefined && {
          date: new Date(updateTransactionDto.date),
        }),
        ...(updateTransactionDto.categoryId !== undefined && {
          categoryId: category.id,
        }),
        ...(updateTransactionDto.accountId !== undefined && {
          accountId: account.id,
        }),
        ...(updateTransactionDto.frequencyType !== undefined && {
          frequencyType: updateTransactionDto.frequencyType,
        }),
        ...(updateTransactionDto.transactionNature !== undefined && {
          transactionNature: updateTransactionDto.transactionNature,
        }),
      },
      include: {
        category: true,
        account: true,
      },
    });
  }

  async deleteTransaction(userId: string, transactionId: string) {
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!existingTransaction) {
      throw new NotFoundException('Transaction not found.');
    }

    await this.prisma.transaction.delete({
      where: {
        id: existingTransaction.id,
      },
    });

    return {
      id: existingTransaction.id,
      deleted: true,
    };
  }

}