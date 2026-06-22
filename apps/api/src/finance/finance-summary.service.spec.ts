import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { FinanceSummaryService } from './finance-summary.service';

describe('FinanceSummaryService', () => {
  let service: FinanceSummaryService;

  const prisma = {
    transaction: {
      findMany: jest.fn(),
    },
  };

  const expectedFindManyArgs = (
    dateRange?: {
      startDate: Date;
      endDate: Date;
    },
  ) => ({
    where: {
      userId: 'user-1',
      ...(dateRange
        ? {
            date: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            },
          }
        : {}),
    },
    select: {
      amount: true,
      type: true,
    },
  });

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceSummaryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<FinanceSummaryService>(FinanceSummaryService);
  });

  it('calculates balance, totals and expense ratio from real transaction rows', async () => {
    prisma.transaction.findMany.mockResolvedValue([
      { amount: '2500.00', type: 'income' },
      { amount: '500.25', type: 'expense' },
      { amount: '149.75', type: 'expense' },
    ]);

    await expect(service.getUserFinanceSummary('user-1')).resolves.toEqual({
      totalBalance: '1850.00',
      totalIncome: '2500.00',
      totalExpense: '650.00',
      expenseRatio: 26,
      progressMessage: '26% of your income has been spent.',
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedFindManyArgs(),
    );
  });

  it('adds the date window when both start and end dates are provided', async () => {
    const startDate = new Date('2026-06-01T00:00:00.000Z');
    const endDate = new Date('2026-06-30T23:59:59.999Z');

    prisma.transaction.findMany.mockResolvedValue([]);

    await service.getUserFinanceSummary('user-1', startDate, endDate);

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedFindManyArgs({ startDate, endDate }),
    );
  });

  it('does not add the date window when only one date boundary is provided', async () => {
    const startDate = new Date('2026-06-01T00:00:00.000Z');
    const endDate = new Date('2026-06-30T23:59:59.999Z');

    prisma.transaction.findMany.mockResolvedValue([]);

    await service.getUserFinanceSummary('user-1', startDate);
    await service.getUserFinanceSummary('user-1', undefined, endDate);

    expect(prisma.transaction.findMany).toHaveBeenNthCalledWith(
      1,
      expectedFindManyArgs(),
    );
    expect(prisma.transaction.findMany).toHaveBeenNthCalledWith(
      2,
      expectedFindManyArgs(),
    );
  });

  it('returns zero totals when the user has no transactions', async () => {
    prisma.transaction.findMany.mockResolvedValue([]);

    await expect(service.getUserFinanceSummary('user-1')).resolves.toEqual({
      totalBalance: '0.00',
      totalIncome: '0.00',
      totalExpense: '0.00',
      expenseRatio: 0,
      progressMessage: 'No income registered yet.',
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedFindManyArgs(),
    );
  });

  it('returns a no-income message when only expenses exist', async () => {
    prisma.transaction.findMany.mockResolvedValue([
      { amount: '12.50', type: 'expense' },
    ]);

    await expect(service.getUserFinanceSummary('user-1')).resolves.toEqual({
      totalBalance: '-12.50',
      totalIncome: '0.00',
      totalExpense: '12.50',
      expenseRatio: 0,
      progressMessage: 'No income registered yet.',
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedFindManyArgs(),
    );
  });

  it('calculates zero expense ratio when only income exists', async () => {
    prisma.transaction.findMany.mockResolvedValue([
      { amount: '1000.00', type: 'income' },
    ]);

    await expect(service.getUserFinanceSummary('user-1')).resolves.toEqual({
      totalBalance: '1000.00',
      totalIncome: '1000.00',
      totalExpense: '0.00',
      expenseRatio: 0,
      progressMessage: '0% of your income has been spent.',
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedFindManyArgs(),
    );
  });

  it('rounds the expense ratio to the nearest whole percentage', async () => {
    prisma.transaction.findMany.mockResolvedValue([
      { amount: '6.00', type: 'income' },
      { amount: '1.00', type: 'expense' },
    ]);

    await expect(service.getUserFinanceSummary('user-1')).resolves.toEqual({
      totalBalance: '5.00',
      totalIncome: '6.00',
      totalExpense: '1.00',
      expenseRatio: 17,
      progressMessage: '17% of your income has been spent.',
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith(
      expectedFindManyArgs(),
    );
  });
});