import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';
import { FinanceSummaryService } from '../finance/finance-summary.service';
import { TransactionsService } from './transactions.service';
import { BrowseTransactionsQueryDto } from './dto/browse-transactions-query.dto';

describe('transaction browsing', () => {
  const transaction = {
    count: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
  };
  const prisma = { $transaction: jest.fn((fn) => fn({ transaction })) };
  const service = new TransactionsService(
    prisma as unknown as PrismaService,
    {} as FinanceSummaryService,
  );
  beforeEach(() => {
    jest.clearAllMocks();
    transaction.count.mockResolvedValue(52);
    transaction.findMany.mockResolvedValue([]);
    transaction.groupBy.mockResolvedValue([
      { type: 'income', _sum: { amount: new Prisma.Decimal('100.10') } },
      { type: 'expense', _sum: { amount: new Prisma.Decimal('20.20') } },
    ]);
  });

  it('filters before pagination while keeping totals scoped only to the user and period', async () => {
    const query = plainToInstance(BrowseTransactionsQueryDto, {
      startDate: '2025-12-01T00:00:00Z',
      endDate: '2026-01-01T00:00:00Z',
      page: '2',
      search: ' Lunch ',
      type: 'expense',
      categoryIds: 'food,cafe',
    });
    const result = await service.browseTransactions('user-1', query);
    const periodWhere = {
      userId: 'user-1',
      date: { gte: new Date(query.startDate!), lt: new Date(query.endDate!) },
    };
    const where = {
      ...periodWhere,
      type: 'expense',
      categoryId: { in: ['food', 'cafe'] },
      OR: [
        { description: { contains: 'Lunch', mode: 'insensitive' } },
        { notes: { contains: 'Lunch', mode: 'insensitive' } },
      ],
    };
    expect(transaction.count).toHaveBeenCalledWith({ where });
    expect(transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where,
        skip: 25,
        take: 25,
        orderBy: [{ date: 'desc' }, { id: 'desc' }],
      }),
    );
    expect(transaction.groupBy).toHaveBeenCalledWith({
      by: ['type'],
      where: periodWhere,
      _sum: { amount: true },
    });
    expect(result.summary).toEqual({
      totalIncome: '100.10',
      totalExpense: '20.20',
      totalBalance: '79.90',
    });
    expect(result.pagination).toEqual({
      page: 2,
      pageSize: 25,
      total: 52,
      totalPages: 3,
    });
  });

  it('keeps period totals identical across pages and different list filters', async () => {
    const first = await service.browseTransactions(
      'user-1',
      plainToInstance(BrowseTransactionsQueryDto, { page: 1 }),
    );
    const second = await service.browseTransactions(
      'user-1',
      plainToInstance(BrowseTransactionsQueryDto, {
        page: 2,
        search: 'coffee',
        type: 'expense',
      }),
    );
    expect(first.summary).toEqual(second.summary);
    expect(transaction.groupBy).toHaveBeenNthCalledWith(2, {
      by: ['type'],
      where: { userId: 'user-1' },
      _sum: { amount: true },
    });
  });

  it('returns distinct years with serialized amounts and dates', async () => {
    const common = {
      description: 'Coffee',
      notes: null,
      amount: new Prisma.Decimal('1.10'),
      currency: 'EUR',
      type: 'expense',
      frequencyType: 'one_time',
      transactionNature: 'variable',
      category: { id: 'food' },
      account: { id: 'cash' },
    };
    transaction.findMany.mockResolvedValue([
      { ...common, id: 'new', date: new Date('2026-01-01T00:00:00Z') },
      { ...common, id: 'old', date: new Date('2025-01-01T00:00:00Z') },
    ]);
    const result = await service.browseTransactions(
      'user-1',
      new BrowseTransactionsQueryDto(),
    );
    expect(result.groups.map((group) => group.month)).toEqual([
      '2026-01',
      '2025-01',
    ]);
    expect(result.groups[0].items[0]).toMatchObject({
      id: 'new',
      amount: '1.1',
      date: '2026-01-01T00:00:00.000Z',
    });
  });

  it('clamps the page after deleting the last item on the final page', async () => {
    transaction.count.mockResolvedValue(25);
    const result = await service.browseTransactions(
      'user-1',
      plainToInstance(BrowseTransactionsQueryDto, { page: 2 }),
    );
    expect(result.pagination.page).toBe(1);
    expect(transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0 }),
    );
  });

  it('handles empty all-time results', async () => {
    transaction.count.mockResolvedValue(0);
    transaction.groupBy.mockResolvedValue([]);
    const result = await service.browseTransactions(
      'user-2',
      new BrowseTransactionsQueryDto(),
    );
    expect(transaction.count).toHaveBeenCalledWith({
      where: { userId: 'user-2' },
    });
    expect(result.summary.totalBalance).toBe('0.00');
    expect(result.pagination).toEqual({
      page: 1,
      total: 0,
      totalPages: 1,
      pageSize: 25,
    });
  });

  it('rejects reversed date bounds', async () => {
    await expect(
      service.browseTransactions(
        'user-1',
        plainToInstance(BrowseTransactionsQueryDto, {
          startDate: '2026-02-01',
          endDate: '2026-01-01',
        }),
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it.each([
    { page: 0 },
    { page: 1.5 },
    { pageSize: 101 },
    { pageSize: 'bad' },
    { startDate: '2026-02-30' },
    { endDate: 'bad' },
    { type: 'invalid' },
    { search: 'x'.repeat(201) },
    { categoryIds: [42] },
  ])('rejects invalid query %j', async (query) => {
    expect(
      (await validate(plainToInstance(BrowseTransactionsQueryDto, query)))
        .length,
    ).toBeGreaterThan(0);
  });
});
