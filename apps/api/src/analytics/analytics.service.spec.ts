import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { FinanceSummaryService } from '../finance/finance-summary.service';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const prisma = {
    user: { findUnique: jest.fn() },
    transaction: { findMany: jest.fn() },
  };

  const financeSummaryService = {
    getUserFinanceSummary: jest.fn(),
  };

  const defaultSummary = {
    totalIncome: '2000.00',
    totalExpense: '500.00',
    totalBalance: '1500.00',
    expenseRatio: 25,
    progressMessage: '25% of your income has been spent.',
  };

  const expectedUserFindUniqueArgs = {
    where: { id: 'user-1' },
    select: { id: true },
  };

  const expectedTransactionFindManyArgs = (
    startDate: Date,
    endDate: Date,
  ) => ({
    where: {
      userId: 'user-1',
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: prisma },
        { provide: FinanceSummaryService, useValue: financeSummaryService },
      ],
    }).compile();

    service = module.get(AnalyticsService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('builds weekly summary, budget and chart from UTC transaction rows', async () => {
    const startDate = new Date('2026-06-22T00:00:00.000Z');
    const endDate = new Date('2026-06-28T23:59:59.999Z');

    prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    financeSummaryService.getUserFinanceSummary.mockResolvedValue(
      defaultSummary,
    );
    prisma.transaction.findMany.mockResolvedValue([
      {
        type: 'income',
        amount: '1000.25',
        date: new Date('2026-06-22T09:00:00.000Z'),
      },
      {
        type: 'expense',
        amount: '40.125',
        date: new Date('2026-06-24T18:00:00.000Z'),
      },
    ]);

    await expect(service.getSummary('user-1', 'weekly')).resolves.toEqual({
      period: 'weekly',
      summary: defaultSummary,
      budget: {
        spentPercentage: 3,
        spentAmount: 500,
        limitAmount: 20000,
        message: '3% Of Your Expenses, Looks Good.',
      },
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        income: [1000.25, 0, 0, 0, 0, 0, 0],
        expense: [0, 0, 40.13, 0, 0, 0, 0],
      },
      targets: [],
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expectedUserFindUniqueArgs,
    );

    expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
      'user-1',
      startDate,
      endDate,
    );

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedTransactionFindManyArgs(startDate, endDate),
    );
  });

  it('uses weekly period by default with UTC boundaries', async () => {
    const startDate = new Date('2026-06-22T00:00:00.000Z');
    const endDate = new Date('2026-06-28T23:59:59.999Z');

    prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    financeSummaryService.getUserFinanceSummary.mockResolvedValue(
      defaultSummary,
    );
    prisma.transaction.findMany.mockResolvedValue([]);

    await expect(service.getSummary('user-1')).resolves.toMatchObject({
      period: 'weekly',
      chart: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        income: [0, 0, 0, 0, 0, 0, 0],
        expense: [0, 0, 0, 0, 0, 0, 0],
      },
    });

    expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
      'user-1',
      startDate,
      endDate,
    );

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedTransactionFindManyArgs(startDate, endDate),
    );
  });

  it('uses daily UTC hour buckets', async () => {
    const startDate = new Date('2026-06-22T00:00:00.000Z');
    const endDate = new Date('2026-06-22T23:59:59.999Z');

    prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    financeSummaryService.getUserFinanceSummary.mockResolvedValue({
      ...defaultSummary,
      totalExpense: '10.00',
    });
    prisma.transaction.findMany.mockResolvedValue([
      {
        type: 'expense',
        amount: '10',
        date: new Date('2026-06-22T21:00:00.000Z'),
      },
    ]);

    const result = await service.getSummary('user-1', 'daily');

    expect(result.chart).toEqual({
      labels: ['00', '04', '08', '12', '16', '20'],
      income: [0, 0, 0, 0, 0, 0],
      expense: [0, 0, 0, 0, 0, 10],
    });

    expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
      'user-1',
      startDate,
      endDate,
    );

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedTransactionFindManyArgs(startDate, endDate),
    );
  });

  it('uses monthly UTC week buckets', async () => {
    const startDate = new Date('2026-06-01T00:00:00.000Z');
    const endDate = new Date('2026-06-30T23:59:59.999Z');

    prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    financeSummaryService.getUserFinanceSummary.mockResolvedValue(
      defaultSummary,
    );
    prisma.transaction.findMany.mockResolvedValue([
      {
        type: 'income',
        amount: '100',
        date: new Date('2026-06-03T10:00:00.000Z'),
      },
      {
        type: 'expense',
        amount: '25.555',
        date: new Date('2026-06-15T10:00:00.000Z'),
      },
      {
        type: 'expense',
        amount: '50',
        date: new Date('2026-06-29T10:00:00.000Z'),
      },
    ]);

    const result = await service.getSummary('user-1', 'monthly');

    expect(result.chart).toEqual({
      labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
      income: [100, 0, 0, 0, 0],
      expense: [0, 0, 25.56, 0, 50],
    });

    expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
      'user-1',
      startDate,
      endDate,
    );

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedTransactionFindManyArgs(startDate, endDate),
    );
  });

  it('uses yearly UTC month buckets and supports decimal-like amounts', async () => {
    const startDate = new Date('2026-01-01T00:00:00.000Z');
    const endDate = new Date('2026-12-31T23:59:59.999Z');

    prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    financeSummaryService.getUserFinanceSummary.mockResolvedValue({
      ...defaultSummary,
      totalExpense: '25000.00',
    });
    prisma.transaction.findMany.mockResolvedValue([
      {
        type: 'income',
        amount: { toNumber: () => 1234.567 },
        date: new Date('2026-01-10T10:00:00.000Z'),
      },
      {
        type: 'expense',
        amount: { toNumber: () => 987.654 },
        date: new Date('2026-12-10T10:00:00.000Z'),
      },
    ]);

    const result = await service.getSummary('user-1', 'yearly');

    expect(result.budget).toEqual({
      spentPercentage: 100,
      spentAmount: 25000,
      limitAmount: 20000,
      message: '100% Of Your Expenses, Looks Good.',
    });

    expect(result.chart).toEqual({
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      income: [1234.57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      expense: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 987.65],
    });

    expect(financeSummaryService.getUserFinanceSummary).toHaveBeenCalledWith(
      'user-1',
      startDate,
      endDate,
    );

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedTransactionFindManyArgs(startDate, endDate),
    );
  });

  it('rejects analytics for missing users and does not query summary or transactions', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.getSummary('missing', 'weekly'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'missing' },
      select: { id: true },
    });

    expect(financeSummaryService.getUserFinanceSummary).not.toHaveBeenCalled();
    expect(prisma.transaction.findMany).not.toHaveBeenCalled();
  });
});