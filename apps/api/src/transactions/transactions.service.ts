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
import {
  AnalyticsPeriod,
  GetTransactionsByCategoryQueryDto,
  SortOrder,
} from './dto/get-transactions-by-category-query.dto';
import { TransactionsByCategoryResponseDto } from './dto/transactions-by-category-response.dto';

const MAX_DATABASE_DECIMAL_AMOUNT = new Prisma.Decimal('9999999999.99');
const DECIMAL_SCALE = 2;

const MAX_TRANSACTION_DESCRIPTION_LENGTH = 120;
const MAX_TRANSACTION_NOTES_LENGTH = 500;

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

  async getTransactionsByCategories(
    userId: string,
    query: GetTransactionsByCategoryQueryDto,
  ): Promise<TransactionsByCategoryResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const period = query.period ?? AnalyticsPeriod.monthly;
    const type = query.type ?? ('expense' as any);
    const order = query.order ?? SortOrder.desc;

    const { startDate, endDate } = this.getAnalyticsDateRange(period);

    const grouped = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        _all: true,
      },
    });

    const categoryIds = grouped.map((item) => item.categoryId);

    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
        userId,
      },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        type: true,
      },
    });

    const categoriesById = new Map(
      categories.map((category) => [category.id, category]),
    );

    const total = grouped.reduce((sum, item) => {
      return sum + Number(item._sum.amount ?? 0);
    }, 0);

    const items = grouped
      .map((item) => {
        const category = categoriesById.get(item.categoryId);
        const amount = Number(item._sum.amount ?? 0);

        if (!category) {
          return null;
        }

        return {
          categoryId: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          type: category.type,
          total: amount.toFixed(2),
          percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
          transactionsCount: item._count._all,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const amountA = Number(a!.total);
        const amountB = Number(b!.total);

        return order === SortOrder.asc ? amountA - amountB : amountB - amountA;
      });

    return {
      period,
      type,
      total: total.toFixed(2),
      items: items as any,
    };
  }

  private getAnalyticsDateRange(period: AnalyticsPeriod) {
    const now = new Date();

    const startDate = new Date(now);
    const endDate = new Date(now);

    switch (period) {
      case AnalyticsPeriod.daily:
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);
        break;

      case AnalyticsPeriod.weekly: {
        const day = now.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;

        startDate.setDate(now.getDate() + diffToMonday);
        startDate.setHours(0, 0, 0, 0);

        endDate.setTime(startDate.getTime());
        endDate.setDate(startDate.getDate() + 7);
        break;
      }

      case AnalyticsPeriod.yearly:
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);

        endDate.setFullYear(startDate.getFullYear() + 1);
        endDate.setMonth(0, 1);
        endDate.setHours(0, 0, 0, 0);
        break;

      case AnalyticsPeriod.monthly:
      default:
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        endDate.setMonth(startDate.getMonth() + 1, 1);
        endDate.setHours(0, 0, 0, 0);
        break;
    }

    return {
      startDate,
      endDate,
    };
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
    const amount = this.toDecimalAmount(
      createTransactionDto.amount,
      'Amount',
    );

    this.validateAmount(amount, 'Amount');

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

    const currency = this.normalizeCurrency(createTransactionDto.currency);
    const description = this.normalizeText(
      createTransactionDto.description,
      'Description',
      MAX_TRANSACTION_DESCRIPTION_LENGTH,
    );
    const notes = this.normalizeOptionalText(
      createTransactionDto.notes,
      'Notes',
      MAX_TRANSACTION_NOTES_LENGTH,
    );

    return this.prisma.transaction.create({
      data: {
        userId,
        accountId: account.id,
        categoryId: category.id,
        amount,
        currency,
        type: createTransactionDto.type,
        description,
        notes,
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

  async importTransactions(
    userId: string,
    transactions: CreateTransactionDto[],
  ) {
    const categoryIds = [
      ...new Set(transactions.map(({ categoryId }) => categoryId)),
    ];
    const accountIds = [
      ...new Set(transactions.map(({ accountId }) => accountId)),
    ];

    const [categories, accounts] = await Promise.all([
      this.prisma.category.findMany({
        where: { id: { in: categoryIds }, userId },
        select: { id: true, type: true },
      }),
      this.prisma.account.findMany({
        where: { id: { in: accountIds }, userId },
        select: { id: true },
      }),
    ]);

    const categoriesById = new Map(
      categories.map((category) => [category.id, category]),
    );
    const accountIdSet = new Set(accounts.map((account) => account.id));

    const data = transactions.map((transaction, index) => {
      const rowNumber = index + 2;
      const category = categoriesById.get(transaction.categoryId);

      if (!category) {
        throw new NotFoundException(
          `Category not found on CSV row ${rowNumber}.`,
        );
      }

      if (category.type !== transaction.type) {
        throw new BadRequestException(
          `Transaction type must match category type on CSV row ${rowNumber}.`,
        );
      }

      if (!accountIdSet.has(transaction.accountId)) {
        throw new NotFoundException(
          `Account not found on CSV row ${rowNumber}.`,
        );
      }

      const amount = this.toDecimalAmount(
        transaction.amount,
        `Amount on CSV row ${rowNumber}`,
      );
      this.validateAmount(amount, `Amount on CSV row ${rowNumber}`);

      return {
        userId,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amount,
        currency: this.normalizeCurrency(transaction.currency),
        type: transaction.type,
        description: this.normalizeText(
          transaction.description,
          `Description on CSV row ${rowNumber}`,
          MAX_TRANSACTION_DESCRIPTION_LENGTH,
        ),
        notes: this.normalizeOptionalText(
          transaction.notes,
          `Notes on CSV row ${rowNumber}`,
          MAX_TRANSACTION_NOTES_LENGTH,
        ),
        date: new Date(transaction.date),
        frequencyType: transaction.frequencyType ?? 'one_time',
        transactionNature: transaction.transactionNature ?? 'other',
      };
    });

    const result = await this.prisma.transaction.createMany({ data });

    return { importedCount: result.count };
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

    const nextAmount =
      updateTransactionDto.amount !== undefined
        ? this.toDecimalAmount(updateTransactionDto.amount, 'Amount')
        : undefined;

    if (nextAmount !== undefined) {
      this.validateAmount(nextAmount, 'Amount');
    }

    const nextCurrency =
      updateTransactionDto.currency !== undefined
        ? this.normalizeCurrency(updateTransactionDto.currency)
        : undefined;

    const nextDescription =
      updateTransactionDto.description !== undefined
        ? this.normalizeText(
            updateTransactionDto.description,
            'Description',
            MAX_TRANSACTION_DESCRIPTION_LENGTH,
          )
        : undefined;

    const nextNotes =
      updateTransactionDto.notes !== undefined
        ? this.normalizeOptionalText(
            updateTransactionDto.notes,
            'Notes',
            MAX_TRANSACTION_NOTES_LENGTH,
          )
        : undefined;

    return this.prisma.transaction.update({
      where: {
        id: existingTransaction.id,
      },
      data: {
        ...(nextAmount !== undefined && {
          amount: nextAmount,
        }),
        ...(nextCurrency !== undefined && {
          currency: nextCurrency,
        }),
        ...(updateTransactionDto.type !== undefined && {
          type: updateTransactionDto.type,
        }),
        ...(nextDescription !== undefined && {
          description: nextDescription,
        }),
        ...(updateTransactionDto.notes !== undefined && {
          notes: nextNotes,
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

  private toDecimalAmount(value: number, fieldName: string): Prisma.Decimal {
    try {
      const amount = new Prisma.Decimal(value);

      if (!amount.isFinite()) {
        throw new Error('Invalid decimal amount');
      }

      return amount;
    } catch {
      throw new BadRequestException(`${fieldName} must be a valid amount.`);
    }
  }

  private validateAmount(amount: Prisma.Decimal, fieldName: string) {
    if (amount.decimalPlaces() > DECIMAL_SCALE) {
      throw new BadRequestException(
        `${fieldName} cannot have more than ${DECIMAL_SCALE} decimal places.`,
      );
    }

    if (amount.lessThanOrEqualTo(0)) {
      throw new BadRequestException(`${fieldName} must be greater than 0.`);
    }

    if (amount.greaterThan(MAX_DATABASE_DECIMAL_AMOUNT)) {
      throw new BadRequestException(
        `${fieldName} cannot be greater than ${MAX_DATABASE_DECIMAL_AMOUNT.toFixed(
          2,
        )}.`,
      );
    }
  }

  private normalizeText(
    value: string,
    fieldName: string,
    maxLength: number,
  ) {
    const normalizedValue = value.trim();

    this.validateTextLength(normalizedValue, fieldName, maxLength);

    return normalizedValue;
  }

  private normalizeOptionalText(
    value: string | null | undefined,
    fieldName: string,
    maxLength: number,
  ) {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
      return null;
    }

    this.validateTextLength(normalizedValue, fieldName, maxLength);

    return normalizedValue;
  }

  private validateTextLength(
    value: string,
    fieldName: string,
    maxLength: number,
  ) {
    if (value.length > maxLength) {
      throw new BadRequestException(
        `${fieldName} cannot be longer than ${maxLength} characters.`,
      );
    }
  }

  private normalizeCurrency(currency: string) {
    const normalizedCurrency = currency.trim().toUpperCase();

    if (normalizedCurrency.length > 3) {
      throw new BadRequestException(
        'Currency cannot be longer than 3 characters.',
      );
    }

    return normalizedCurrency;
  }

}
