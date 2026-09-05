import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FinanceSummaryService } from '../finance/finance-summary.service';
import {
  AnalyticsPeriod,
  SortOrder,
} from './dto/get-transactions-by-category-query.dto';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const prisma = {
    user: { findUnique: jest.fn() },
    transaction: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    account: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const financeSummaryService = {
    getUserFinanceSummary: jest.fn(),
  };

  const expectedUserFindUniqueArgs = (userId = 'user-1') => ({
    where: { id: userId },
    select: { id: true },
  });

  describe('importTransactions', () => {
    const importedTransaction = {
      accountId: 'account-1',
      categoryId: 'cat-1',
      amount: 12.5,
      currency: ' eur ',
      type: 'expense' as any,
      description: '  Lunch  ',
      notes: '  Menu  ',
      date: '2026-06-22T12:00:00.000Z',
      frequencyType: 'one_time' as any,
      transactionNature: 'variable' as any,
    };

    it('validates references and writes the entire import in one bulk operation', async () => {
      prisma.category.findMany.mockResolvedValue([
        { id: 'cat-1', type: 'expense' },
      ]);
      prisma.account.findMany.mockResolvedValue([{ id: 'account-1' }]);
      prisma.transaction.createMany.mockResolvedValue({ count: 1 });

      await expect(
        service.importTransactions('user-1', [importedTransaction]),
      ).resolves.toEqual({ importedCount: 1 });

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['cat-1'] }, userId: 'user-1' },
        select: { id: true, type: true },
      });
      expect(prisma.account.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['account-1'] }, userId: 'user-1' },
        select: { id: true },
      });
      expect(prisma.transaction.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            userId: 'user-1',
            amount: expect.any(Prisma.Decimal),
            currency: 'EUR',
            description: 'Lunch',
            notes: 'Menu',
          }),
        ],
      });
    });

    it('does not write any rows when an imported category is invalid', async () => {
      prisma.category.findMany.mockResolvedValue([]);
      prisma.account.findMany.mockResolvedValue([{ id: 'account-1' }]);

      await expect(
        service.importTransactions('user-1', [importedTransaction]),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.transaction.createMany).not.toHaveBeenCalled();
    });
  });

  const expectedTransactionInclude = {
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
  };

  const expectedOverviewTransactionInclude = {
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
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useRealTimers();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prisma },
        { provide: FinanceSummaryService, useValue: financeSummaryService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getUserTransactions', () => {
    it('returns user transactions with category and account details newest first', async () => {
      const rows = [{ id: 'tx-1' }];

      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.transaction.findMany.mockResolvedValue(rows);

      await expect(service.getUserTransactions('user-1')).resolves.toBe(rows);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs(),
      );

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: expectedTransactionInclude,
        orderBy: { date: 'desc' },
      });
    });

    it('returns an empty transaction list when the user has no transactions', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.transaction.findMany.mockResolvedValue([]);

      await expect(service.getUserTransactions('user-1')).resolves.toEqual([]);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: expectedTransactionInclude,
        orderBy: { date: 'desc' },
      });
    });

    it('rejects transaction listing for a missing user and does not query transactions', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getUserTransactions('missing'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs('missing'),
      );
      expect(prisma.transaction.findMany).not.toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    it('creates a transaction only when the category and account belong to the user', async () => {
      const created = { id: 'tx-1' };

      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        type: 'expense',
      });
      prisma.account.findFirst.mockResolvedValue({ id: 'account-1' });
      prisma.transaction.create.mockResolvedValue(created);

      await expect(
        service.createTransaction('user-1', {
          accountId: 'account-1',
          categoryId: 'cat-1',
          amount: 12.50,
          currency: ' eur ',
          type: 'expense' as any,
          description: '  Lunch  ',
          notes: '  menu  ',
          date: '2026-06-22T12:00:00.000Z',
        }),
      ).resolves.toBe(created);

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
          userId: 'user-1',
        },
        select: {
          id: true,
          type: true,
        },
      });

      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'account-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          accountId: 'account-1',
          categoryId: 'cat-1',
          amount: expect.any(Prisma.Decimal),
          currency: 'EUR',
          type: 'expense',
          description: 'Lunch',
          notes: 'menu',
          date: new Date('2026-06-22T12:00:00.000Z'),
          frequencyType: 'one_time',
          transactionNature: 'other',
        },
        include: {
          category: true,
          account: true,
        },
      });

      const amount = prisma.transaction.create.mock.calls[0][0].data.amount;
      expect(amount).toBeInstanceOf(Prisma.Decimal);
      expect(amount.toNumber()).toBe(12.5);
    });

    it('creates a transaction with provided frequency and transaction nature', async () => {
      const created = { id: 'tx-1' };

      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        type: 'income',
      });
      prisma.account.findFirst.mockResolvedValue({ id: 'account-1' });
      prisma.transaction.create.mockResolvedValue(created);

      await expect(
        service.createTransaction('user-1', {
          accountId: 'account-1',
          categoryId: 'cat-1',
          amount: 1000,
          currency: 'EUR',
          type: 'income' as any,
          description: 'Salary',
          notes: '',
          date: '2026-06-22T12:00:00.000Z',
          frequencyType: 'monthly' as any,
          transactionNature: 'salary' as any,
        }),
      ).resolves.toBe(created);

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          frequencyType: 'monthly',
          transactionNature: 'salary',
          notes: null,
        }),
        include: {
          category: true,
          account: true,
        },
      });
    });

    it('rejects creation when the category does not belong to the user', async () => {
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.createTransaction('user-1', {
          accountId: 'account-1',
          categoryId: 'cat-1',
          amount: 12.50,
          currency: 'EUR',
          type: 'expense' as any,
          description: 'Lunch',
          date: '2026-06-22T12:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.account.findFirst).not.toHaveBeenCalled();
      expect(prisma.transaction.create).not.toHaveBeenCalled();
    });

    it('rejects creation when category type and transaction type differ', async () => {
      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        type: 'income',
      });

      await expect(
        service.createTransaction('user-1', {
          accountId: 'account-1',
          categoryId: 'cat-1',
          amount: 12.50,
          currency: 'EUR',
          type: 'expense' as any,
          description: 'Lunch',
          date: '2026-06-22T12:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.account.findFirst).not.toHaveBeenCalled();
      expect(prisma.transaction.create).not.toHaveBeenCalled();
    });

    it('rejects creation when the account does not belong to the user', async () => {
      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        type: 'expense',
      });
      prisma.account.findFirst.mockResolvedValue(null);

      await expect(
        service.createTransaction('user-1', {
          accountId: 'account-1',
          categoryId: 'cat-1',
          amount: 12.50,
          currency: 'EUR',
          type: 'expense' as any,
          description: 'Lunch',
          date: '2026-06-22T12:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'account-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });
      expect(prisma.transaction.create).not.toHaveBeenCalled();
    });
  });

  describe('updateTransaction', () => {
    it('updates only provided transaction fields after validating ownership', async () => {
      prisma.transaction.findFirst.mockResolvedValue({
        id: 'tx-1',
        type: 'expense',
        categoryId: 'cat-1',
        accountId: 'account-1',
      });
      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        type: 'expense',
      });
      prisma.account.findFirst.mockResolvedValue({ id: 'account-1' });
      prisma.transaction.update.mockResolvedValue({ id: 'tx-1' });

      await expect(
        service.updateTransaction('user-1', 'tx-1', {
          amount: 20,
          currency: ' usd ',
          notes: '   ',
        }),
      ).resolves.toEqual({ id: 'tx-1' });

      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'tx-1',
          userId: 'user-1',
        },
        select: {
          id: true,
          type: true,
          categoryId: true,
          accountId: true,
        },
      });

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cat-1',
          userId: 'user-1',
        },
        select: {
          id: true,
          type: true,
        },
      });

      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'account-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });

      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
        data: {
          amount: expect.any(Prisma.Decimal),
          currency: 'USD',
          notes: null,
        },
        include: {
          category: true,
          account: true,
        },
      });

      const amount = prisma.transaction.update.mock.calls[0][0].data.amount;
      expect(amount.toString()).toBe('20');
    });

    it('updates changed category, account, type, description, date and metadata fields', async () => {
      prisma.transaction.findFirst.mockResolvedValue({
        id: 'tx-1',
        type: 'expense',
        categoryId: 'old-cat',
        accountId: 'old-account',
      });
      prisma.category.findFirst.mockResolvedValue({
        id: 'new-cat',
        type: 'income',
      });
      prisma.account.findFirst.mockResolvedValue({ id: 'new-account' });
      prisma.transaction.update.mockResolvedValue({ id: 'tx-1' });

      await expect(
        service.updateTransaction('user-1', 'tx-1', {
          categoryId: 'new-cat',
          accountId: 'new-account',
          type: 'income' as any,
          description: '  Salary  ',
          date: '2026-06-22T12:00:00.000Z',
          frequencyType: 'monthly' as any,
          transactionNature: 'salary' as any,
        }),
      ).resolves.toEqual({ id: 'tx-1' });

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'new-cat',
          userId: 'user-1',
        },
        select: {
          id: true,
          type: true,
        },
      });

      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'new-account',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });

      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: 'tx-1' },
        data: {
          type: 'income',
          description: 'Salary',
          date: new Date('2026-06-22T12:00:00.000Z'),
          categoryId: 'new-cat',
          accountId: 'new-account',
          frequencyType: 'monthly',
          transactionNature: 'salary',
        },
        include: {
          category: true,
          account: true,
        },
      });
    });

    it('rejects updating a transaction owned by another user', async () => {
      prisma.transaction.findFirst.mockResolvedValue(null);

      await expect(
        service.updateTransaction('user-1', 'tx-1', {
          amount: 20,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'tx-1',
          userId: 'user-1',
        },
        select: {
          id: true,
          type: true,
          categoryId: true,
          accountId: true,
        },
      });
      expect(prisma.category.findFirst).not.toHaveBeenCalled();
      expect(prisma.account.findFirst).not.toHaveBeenCalled();
      expect(prisma.transaction.update).not.toHaveBeenCalled();
    });

    it('rejects update when the next category does not belong to the user', async () => {
      prisma.transaction.findFirst.mockResolvedValue({
        id: 'tx-1',
        type: 'expense',
        categoryId: 'cat-1',
        accountId: 'account-1',
      });
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.updateTransaction('user-1', 'tx-1', {
          categoryId: 'missing-cat',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'missing-cat',
          userId: 'user-1',
        },
        select: {
          id: true,
          type: true,
        },
      });
      expect(prisma.account.findFirst).not.toHaveBeenCalled();
      expect(prisma.transaction.update).not.toHaveBeenCalled();
    });

    it('rejects update when the next category type and next transaction type differ', async () => {
      prisma.transaction.findFirst.mockResolvedValue({
        id: 'tx-1',
        type: 'expense',
        categoryId: 'cat-1',
        accountId: 'account-1',
      });
      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        type: 'income',
      });

      await expect(
        service.updateTransaction('user-1', 'tx-1', {
          amount: 20,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.account.findFirst).not.toHaveBeenCalled();
      expect(prisma.transaction.update).not.toHaveBeenCalled();
    });

    it('rejects update when the next account does not belong to the user', async () => {
      prisma.transaction.findFirst.mockResolvedValue({
        id: 'tx-1',
        type: 'expense',
        categoryId: 'cat-1',
        accountId: 'account-1',
      });
      prisma.category.findFirst.mockResolvedValue({
        id: 'cat-1',
        type: 'expense',
      });
      prisma.account.findFirst.mockResolvedValue(null);

      await expect(
        service.updateTransaction('user-1', 'tx-1', {
          accountId: 'missing-account',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'missing-account',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });
      expect(prisma.transaction.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteTransaction', () => {
    it('deletes only transactions owned by the user', async () => {
      prisma.transaction.findFirst.mockResolvedValue({ id: 'tx-1' });
      prisma.transaction.delete.mockResolvedValue({ id: 'tx-1' });

      await expect(service.deleteTransaction('user-1', 'tx-1')).resolves.toEqual({
        id: 'tx-1',
        deleted: true,
      });

      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'tx-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });

      expect(prisma.transaction.delete).toHaveBeenCalledWith({
        where: {
          id: 'tx-1',
        },
      });
    });

    it('rejects deleting a transaction owned by another user', async () => {
      prisma.transaction.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteTransaction('user-1', 'tx-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'tx-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });
      expect(prisma.transaction.delete).not.toHaveBeenCalled();
    });
  });

  describe('getUserTransactionsOverview', () => {
    it('groups overview transactions by display month with formatted amounts', async () => {
      const summary = { totalBalance: '100.00' };

      financeSummaryService.getUserFinanceSummary.mockResolvedValue(summary);
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.transaction.findMany.mockResolvedValue([
        {
          id: 'tx-1',
          description: 'Salary',
          notes: null,
          amount: new Prisma.Decimal('1000'),
          currency: 'EUR',
          type: 'income',
          date: new Date('2026-06-15T00:00:00.000Z'),
          frequencyType: 'monthly',
          transactionNature: 'salary',
          category: {
            id: 'cat-income',
            name: 'Salary',
            icon: 'income',
            color: '#16A34A',
            type: 'income',
          },
          account: {
            id: 'account-1',
            name: 'Cash',
            type: 'cash',
            currencies: ['EUR'],
          },
        },
        {
          id: 'tx-2',
          description: 'Lunch',
          notes: 'Menu',
          amount: new Prisma.Decimal('12.50'),
          currency: 'EUR',
          type: 'expense',
          date: new Date('2026-07-01T00:00:00.000Z'),
          frequencyType: 'one_time',
          transactionNature: 'other',
          category: {
            id: 'cat-food',
            name: 'Food',
            icon: 'food',
            color: '#F97316',
            type: 'expense',
          },
          account: {
            id: 'account-1',
            name: 'Cash',
            type: 'cash',
            currencies: ['EUR'],
          },
        },
      ]);

      await expect(
        service.getUserTransactionsOverview('user-1'),
      ).resolves.toEqual({
        summary,
        groups: [
          {
            month: 'June',
            items: [
              {
                id: 'tx-1',
                description: 'Salary',
                notes: null,
                amount: '1000',
                currency: 'EUR',
                type: 'income',
                date: '2026-06-15T00:00:00.000Z',
                frequencyType: 'monthly',
                transactionNature: 'salary',
                category: {
                  id: 'cat-income',
                  name: 'Salary',
                  icon: 'income',
                  color: '#16A34A',
                  type: 'income',
                },
                account: {
                  id: 'account-1',
                  name: 'Cash',
                  type: 'cash',
                  currencies: ['EUR'],
                },
              },
            ],
          },
          {
            month: 'July',
            items: [
              {
                id: 'tx-2',
                description: 'Lunch',
                notes: 'Menu',
                amount: '12.5',
                currency: 'EUR',
                type: 'expense',
                date: '2026-07-01T00:00:00.000Z',
                frequencyType: 'one_time',
                transactionNature: 'other',
                category: {
                  id: 'cat-food',
                  name: 'Food',
                  icon: 'food',
                  color: '#F97316',
                  type: 'expense',
                },
                account: {
                  id: 'account-1',
                  name: 'Cash',
                  type: 'cash',
                  currencies: ['EUR'],
                },
              },
            ],
          },
        ],
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs(),
      );
      expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
        'user-1',
      );
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: expectedOverviewTransactionInclude,
        orderBy: {
          date: 'desc',
        },
      });
    });

    it('returns summary and empty groups when the user has no transactions', async () => {
      const summary = { totalBalance: '0.00' };

      financeSummaryService.getUserFinanceSummary.mockResolvedValue(summary);
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.transaction.findMany.mockResolvedValue([]);

      await expect(
        service.getUserTransactionsOverview('user-1'),
      ).resolves.toEqual({
        summary,
        groups: [],
      });

      expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
        'user-1',
      );
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: expectedOverviewTransactionInclude,
        orderBy: {
          date: 'desc',
        },
      });
    });

    it('rejects overview for a missing user and does not load summary or transactions', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getUserTransactionsOverview('missing'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs('missing'),
      );
      expect(financeSummaryService.getUserFinanceSummary).not.toHaveBeenCalled();
      expect(prisma.transaction.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getTransactionsByCategories', () => {
    it('builds category analytics totals, percentages and ascending sort order', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.transaction.groupBy.mockResolvedValue([
        { categoryId: 'cat-food', _sum: { amount: '75' }, _count: { _all: 3 } },
        { categoryId: 'cat-rent', _sum: { amount: '25' }, _count: { _all: 1 } },
      ]);
      prisma.category.findMany.mockResolvedValue([
        {
          id: 'cat-food',
          name: 'Food',
          icon: 'food',
          color: '#F97316',
          type: 'expense',
        },
        {
          id: 'cat-rent',
          name: 'Rent',
          icon: 'rent',
          color: '#8B5CF6',
          type: 'expense',
        },
      ]);

      await expect(
        service.getTransactionsByCategories('user-1', {
          period: AnalyticsPeriod.monthly,
          type: 'expense' as any,
          order: SortOrder.asc,
        }),
      ).resolves.toEqual({
        period: AnalyticsPeriod.monthly,
        type: 'expense',
        total: '100.00',
        items: [
          expect.objectContaining({
            categoryId: 'cat-rent',
            total: '25.00',
            percentage: 25,
            transactionsCount: 1,
          }),
          expect.objectContaining({
            categoryId: 'cat-food',
            total: '75.00',
            percentage: 75,
            transactionsCount: 3,
          }),
        ],
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs(),
      );

      expect(prisma.transaction.groupBy).toHaveBeenCalledWith({
        by: ['categoryId'],
        where: {
          userId: 'user-1',
          type: 'expense',
          date: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
        _sum: {
          amount: true,
        },
        _count: {
          _all: true,
        },
      });

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['cat-food', 'cat-rent'],
          },
          userId: 'user-1',
        },
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
          type: true,
        },
      });
    });

    it('uses monthly expense descending analytics by default', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.transaction.groupBy.mockResolvedValue([
        { categoryId: 'cat-food', _sum: { amount: '25' }, _count: { _all: 1 } },
        { categoryId: 'cat-rent', _sum: { amount: '75' }, _count: { _all: 3 } },
      ]);
      prisma.category.findMany.mockResolvedValue([
        {
          id: 'cat-food',
          name: 'Food',
          icon: 'food',
          color: '#F97316',
          type: 'expense',
        },
        {
          id: 'cat-rent',
          name: 'Rent',
          icon: 'rent',
          color: '#8B5CF6',
          type: 'expense',
        },
      ]);

      await expect(
        service.getTransactionsByCategories('user-1', {}),
      ).resolves.toEqual({
        period: AnalyticsPeriod.monthly,
        type: 'expense',
        total: '100.00',
        items: [
          expect.objectContaining({
            categoryId: 'cat-rent',
            total: '75.00',
          }),
          expect.objectContaining({
            categoryId: 'cat-food',
            total: '25.00',
          }),
        ],
      });
    });

    it('returns empty analytics when there are no grouped transactions', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.transaction.groupBy.mockResolvedValue([]);
      prisma.category.findMany.mockResolvedValue([]);

      await expect(
        service.getTransactionsByCategories('user-1', {
          period: AnalyticsPeriod.weekly,
          type: 'income' as any,
          order: SortOrder.desc,
        }),
      ).resolves.toEqual({
        period: AnalyticsPeriod.weekly,
        type: 'income',
        total: '0.00',
        items: [],
      });

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: [],
          },
          userId: 'user-1',
        },
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
          type: true,
        },
      });
    });

    it('skips grouped transaction categories that no longer exist or do not belong to the user', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.transaction.groupBy.mockResolvedValue([
        { categoryId: 'cat-food', _sum: { amount: '25' }, _count: { _all: 1 } },
        {
          categoryId: 'deleted-cat',
          _sum: { amount: '75' },
          _count: { _all: 3 },
        },
      ]);
      prisma.category.findMany.mockResolvedValue([
        {
          id: 'cat-food',
          name: 'Food',
          icon: 'food',
          color: '#F97316',
          type: 'expense',
        },
      ]);

      await expect(
        service.getTransactionsByCategories('user-1', {
          period: AnalyticsPeriod.monthly,
        }),
      ).resolves.toEqual({
        period: AnalyticsPeriod.monthly,
        type: 'expense',
        total: '100.00',
        items: [
          expect.objectContaining({
            categoryId: 'cat-food',
            total: '25.00',
            percentage: 25,
            transactionsCount: 1,
          }),
        ],
      });
    });

    it('rejects category analytics for a missing user and does not query grouped transactions', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getTransactionsByCategories('missing', {
          period: AnalyticsPeriod.monthly,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs('missing'),
      );
      expect(prisma.transaction.groupBy).not.toHaveBeenCalled();
      expect(prisma.category.findMany).not.toHaveBeenCalled();
    });
  });
});
