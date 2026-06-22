import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AnalyticsPeriod,
  SortOrder,
} from './dto/get-goal-contributions-analytics-query.dto';
import { GoalsService } from './goals.service';

describe('GoalsService', () => {
  let service: GoalsService;

  const prisma = {
    user: { findUnique: jest.fn() },
    goal: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
    goalContribution: {
      groupBy: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    transaction: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const fixedNow = new Date('2026-06-22T12:00:00.000Z');

  const makeGoal = (overrides: Record<string, unknown> = {}) => ({
    id: 'goal-1',
    name: 'Emergency Fund',
    description: null,
    icon: 'savings',
    color: '#16A34A',
    type: 'savings',
    status: 'active',
    currentAmount: new Prisma.Decimal('300'),
    targetAmount: new Prisma.Decimal('900'),
    currency: 'EUR',
    startDate: new Date('2026-06-01T00:00:00.000Z'),
    targetDate: new Date('2026-09-01T00:00:00.000Z'),
    _count: { contributions: 2 },
    ...overrides,
  });

  const expectedUserFindUniqueArgs = (userId = 'user-1') => ({
    where: { id: userId },
    select: { id: true },
  });

  const expectedGoalFindManyArgs = {
    where: {
      userId: 'user-1',
      status: {
        in: ['active', 'paused', 'completed'],
      },
    },
    include: {
      _count: {
        select: {
          contributions: true,
        },
      },
    },
    orderBy: [
      {
        status: 'asc',
      },
      {
        targetDate: 'asc',
      },
      {
        createdAt: 'desc',
      },
    ],
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(fixedNow);

    prisma.$transaction.mockImplementation((callback) =>
      callback({
        goal: {
          create: jest.fn(),
          update: jest.fn(),
        },
        goalContribution: {
          create: jest.fn(),
          delete: jest.fn(),
        },
      }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<GoalsService>(GoalsService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getUserGoalsOverview', () => {
    it('returns overview totals, progress and monthly needed for active goals', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.goal.findMany.mockResolvedValue([makeGoal()]);

      await expect(service.getUserGoalsOverview('user-1')).resolves.toEqual({
        summary: {
          totalSaved: 300,
          totalTarget: 900,
          globalProgress: 33,
          activeGoals: 1,
          monthlyNeeded: 200,
          progressMessage: '33% of your goals completed.',
        },
        mainGoal: expect.objectContaining({
          id: 'goal-1',
          saved: 300,
          target: 900,
          progress: 33,
          monthlyNeeded: 200,
          contributionsCount: 2,
          statusLabel: expect.any(String),
        }),
        goals: [expect.objectContaining({ id: 'goal-1' })],
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs(),
      );
      expect(prisma.goal.findMany).toHaveBeenCalledWith(
        expectedGoalFindManyArgs,
      );
    });

    it('returns an empty overview when the user has no goals', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.goal.findMany.mockResolvedValue([]);

      await expect(service.getUserGoalsOverview('user-1')).resolves.toEqual({
        summary: {
          totalSaved: 0,
          totalTarget: 0,
          globalProgress: 0,
          activeGoals: 0,
          monthlyNeeded: 0,
          progressMessage: 'Create your first goal to start tracking your progress.',
        },
        mainGoal: null,
        goals: [],
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs(),
      );
      expect(prisma.goal.findMany).toHaveBeenCalledWith(
        expectedGoalFindManyArgs,
      );
    });

    it('rejects overview for missing users and does not load goals', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getUserGoalsOverview('missing'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs('missing'),
      );
      expect(prisma.goal.findMany).not.toHaveBeenCalled();
    });
  });

  describe('createGoal', () => {
    it('creates a goal and initial contribution inside one transaction', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });

      const txGoalCreate = jest.fn().mockResolvedValue(
        makeGoal({
          id: 'goal-1',
          name: 'Trip',
          description: null,
          icon: null,
          color: null,
          type: 'savings',
          status: 'active',
          currentAmount: new Prisma.Decimal('100'),
          targetAmount: new Prisma.Decimal('500'),
          currency: 'EUR',
          startDate: fixedNow,
          targetDate: null,
          _count: undefined,
        }),
      );
      const txContributionCreate = jest.fn();

      prisma.$transaction.mockImplementation((callback) =>
        callback({
          goal: { create: txGoalCreate },
          goalContribution: { create: txContributionCreate },
        }),
      );

      await expect(
        service.createGoal('user-1', {
          name: '  Trip  ',
          description: '  Summer travel  ',
          targetAmount: 500,
          currentAmount: 100,
          currency: ' eur ',
          type: 'savings' as any,
          icon: '  plane  ',
          color: '  #0EA5E9  ',
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          id: 'goal-1',
          name: 'Trip',
          saved: 100,
          target: 500,
          currency: 'EUR',
          progress: 20,
          contributionsCount: 0,
        }),
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs(),
      );

      expect(txGoalCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          name: 'Trip',
          description: 'Summer travel',
          targetAmount: expect.any(Prisma.Decimal),
          currentAmount: expect.any(Prisma.Decimal),
          currency: 'EUR',
          status: 'active',
          type: 'savings',
          icon: 'plane',
          color: '#0EA5E9',
        }),
      });

      expect(txContributionCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          goalId: 'goal-1',
          userId: 'user-1',
          amount: expect.any(Prisma.Decimal),
          currency: 'EUR',
          date: fixedNow,
          notes: 'Initial goal amount.',
          transactionId: null,
        }),
      });
    });

    it('creates a goal without initial contribution when current amount is zero', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });

      const txGoalCreate = jest.fn().mockResolvedValue(
        makeGoal({
          currentAmount: new Prisma.Decimal('0'),
          targetAmount: new Prisma.Decimal('500'),
          targetDate: null,
          _count: undefined,
        }),
      );
      const txContributionCreate = jest.fn();

      prisma.$transaction.mockImplementation((callback) =>
        callback({
          goal: { create: txGoalCreate },
          goalContribution: { create: txContributionCreate },
        }),
      );

      await expect(
        service.createGoal('user-1', {
          name: 'Trip',
          targetAmount: 500,
          currentAmount: 0,
          currency: 'EUR',
          type: 'savings' as any,
        }),
      ).resolves.toEqual(expect.objectContaining({ saved: 0 }));

      expect(txGoalCreate).toHaveBeenCalled();
      expect(txContributionCreate).not.toHaveBeenCalled();
    });

    it('rejects goal creation for missing users and does not start a transaction', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.createGoal('missing', {
          name: 'Trip',
          targetAmount: 500,
          currentAmount: 100,
          currency: 'EUR',
          type: 'savings' as any,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs('missing'),
      );
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects goal creation when current amount exceeds target', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });

      await expect(
        service.createGoal('user-1', {
          name: 'Trip',
          targetAmount: 100,
          currentAmount: 101,
          currency: 'EUR',
          type: 'savings' as any,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('updateGoal', () => {
    it('updates an owned goal and creates an adjustment contribution when current amount changes', async () => {
      prisma.goal.findFirst.mockResolvedValue(
        makeGoal({
          id: 'goal-1',
          currentAmount: new Prisma.Decimal('100'),
          targetAmount: new Prisma.Decimal('500'),
          currency: 'EUR',
          startDate: new Date('2026-06-01T00:00:00.000Z'),
          targetDate: null,
        }),
      );

      const txGoalUpdate = jest.fn().mockResolvedValue(
        makeGoal({
          id: 'goal-1',
          name: 'Updated Trip',
          description: null,
          currentAmount: new Prisma.Decimal('150'),
          targetAmount: new Prisma.Decimal('500'),
          currency: 'EUR',
          targetDate: null,
          _count: undefined,
        }),
      );
      const txContributionCreate = jest.fn();

      prisma.$transaction.mockImplementation((callback) =>
        callback({
          goal: { update: txGoalUpdate },
          goalContribution: { create: txContributionCreate },
        }),
      );

      await expect(
        service.updateGoal('user-1', 'goal-1', {
          name: '  Updated Trip  ',
          currentAmount: 150,
          currency: ' eur ',
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          id: 'goal-1',
          name: 'Updated Trip',
          saved: 150,
          target: 500,
          progress: 30,
        }),
      );

      expect(prisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
          userId: 'user-1',
        },
      });

      expect(txGoalUpdate).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
        },
        data: {
          name: 'Updated Trip',
          currentAmount: expect.any(Prisma.Decimal),
          currency: 'EUR',
        },
      });

      expect(txContributionCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          goalId: 'goal-1',
          userId: 'user-1',
          amount: expect.any(Prisma.Decimal),
          currency: 'EUR',
          date: fixedNow,
          notes: 'Goal balance adjustment.',
          transactionId: null,
        }),
      });

      const adjustmentAmount =
        txContributionCreate.mock.calls[0][0].data.amount;
      expect(adjustmentAmount.toString()).toBe('50');
    });

    it('updates only provided fields and does not create adjustment when current amount is unchanged', async () => {
      prisma.goal.findFirst.mockResolvedValue(
        makeGoal({
          id: 'goal-1',
          currentAmount: new Prisma.Decimal('100'),
          targetAmount: new Prisma.Decimal('500'),
          currency: 'EUR',
          targetDate: null,
        }),
      );

      const txGoalUpdate = jest.fn().mockResolvedValue(
        makeGoal({
          id: 'goal-1',
          description: null,
          icon: null,
          color: null,
          currentAmount: new Prisma.Decimal('100'),
          targetAmount: new Prisma.Decimal('500'),
          targetDate: null,
          _count: undefined,
        }),
      );
      const txContributionCreate = jest.fn();

      prisma.$transaction.mockImplementation((callback) =>
        callback({
          goal: { update: txGoalUpdate },
          goalContribution: { create: txContributionCreate },
        }),
      );

      await expect(
        service.updateGoal('user-1', 'goal-1', {
          description: '   ',
          icon: '   ',
          color: '  #111827  ',
        }),
      ).resolves.toEqual(expect.objectContaining({ id: 'goal-1' }));

      expect(txGoalUpdate).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
        },
        data: {
          description: null,
          icon: null,
          color: '#111827',
        },
      });

      expect(txContributionCreate).not.toHaveBeenCalled();
    });

    it('rejects updating goals owned by another user', async () => {
      prisma.goal.findFirst.mockResolvedValue(null);

      await expect(
        service.updateGoal('user-1', 'goal-1', {
          name: 'Updated',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
          userId: 'user-1',
        },
      });
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects update when next current amount exceeds next target', async () => {
      prisma.goal.findFirst.mockResolvedValue(
        makeGoal({
          currentAmount: new Prisma.Decimal('100'),
          targetAmount: new Prisma.Decimal('500'),
        }),
      );

      await expect(
        service.updateGoal('user-1', 'goal-1', {
          currentAmount: 501,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('deleteGoal', () => {
    it('deletes an owned goal', async () => {
      prisma.goal.findFirst.mockResolvedValue({ id: 'goal-1' });
      prisma.goal.delete.mockResolvedValue({ id: 'goal-1' });

      await expect(service.deleteGoal('user-1', 'goal-1')).resolves.toEqual({
        message: 'Goal deleted successfully.',
      });

      expect(prisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });

      expect(prisma.goal.delete).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
        },
      });
    });

    it('rejects deleting goals owned by another user', async () => {
      prisma.goal.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteGoal('user-1', 'goal-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });
      expect(prisma.goal.delete).not.toHaveBeenCalled();
    });
  });

  describe('getGoalContributions', () => {
    it('formats contributions using transaction fallback notes and description', async () => {
      prisma.goal.findFirst.mockResolvedValue({ id: 'goal-1' });
      prisma.goalContribution.findMany.mockResolvedValue([
        {
          id: 'contribution-1',
          goalId: 'goal-1',
          transactionId: 'tx-1',
          amount: new Prisma.Decimal('25.5'),
          currency: 'EUR',
          date: new Date('2026-06-21T00:00:00.000Z'),
          notes: null,
          transaction: {
            description: 'Savings transfer',
            notes: 'From checking',
          },
        },
      ]);

      await expect(
        service.getGoalContributions('user-1', 'goal-1'),
      ).resolves.toEqual([
        {
          id: 'contribution-1',
          goalId: 'goal-1',
          transactionId: 'tx-1',
          amount: 25.5,
          currency: 'EUR',
          date: '2026-06-21T00:00:00.000Z',
          notes: 'From checking',
          description: 'Savings transfer',
        },
      ]);

      expect(prisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });

      expect(prisma.goalContribution.findMany).toHaveBeenCalledWith({
        where: {
          goalId: 'goal-1',
          userId: 'user-1',
        },
        include: {
          transaction: {
            select: {
              id: true,
              description: true,
              notes: true,
              date: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    });

    it('uses contribution notes before transaction fallback notes', async () => {
      prisma.goal.findFirst.mockResolvedValue({ id: 'goal-1' });
      prisma.goalContribution.findMany.mockResolvedValue([
        {
          id: 'contribution-1',
          goalId: 'goal-1',
          transactionId: 'tx-1',
          amount: new Prisma.Decimal('25.5'),
          currency: 'EUR',
          date: new Date('2026-06-21T00:00:00.000Z'),
          notes: 'Manual contribution note',
          transaction: {
            description: 'Savings transfer',
            notes: 'Transaction note',
          },
        },
      ]);

      await expect(
        service.getGoalContributions('user-1', 'goal-1'),
      ).resolves.toEqual([
        expect.objectContaining({
          notes: 'Manual contribution note',
          description: 'Savings transfer',
        }),
      ]);
    });

    it('rejects reading contributions for goals owned by another user', async () => {
      prisma.goal.findFirst.mockResolvedValue(null);

      await expect(
        service.getGoalContributions('user-1', 'goal-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.goalContribution.findMany).not.toHaveBeenCalled();
    });
  });

  describe('createGoalContribution', () => {
    it('creates a contribution and increments the goal current amount', async () => {
      prisma.goal.findFirst.mockResolvedValue({
        id: 'goal-1',
        currency: 'EUR',
        currentAmount: new Prisma.Decimal('90'),
        targetAmount: new Prisma.Decimal('100'),
      });

      const txContributionCreate = jest.fn().mockResolvedValue({
        id: 'contribution-1',
        goalId: 'goal-1',
        transactionId: null,
        amount: new Prisma.Decimal('10'),
        currency: 'EUR',
        date: new Date('2026-06-22T00:00:00.000Z'),
        notes: 'Monthly saving',
        transaction: null,
      });
      const txGoalUpdate = jest.fn();

      prisma.$transaction.mockImplementation((callback) =>
        callback({
          goalContribution: { create: txContributionCreate },
          goal: { update: txGoalUpdate },
        }),
      );

      await expect(
        service.createGoalContribution('user-1', 'goal-1', {
          amount: 10,
          currency: ' eur ',
          date: '2026-06-22T00:00:00.000Z',
          notes: '  Monthly saving  ',
        }),
      ).resolves.toEqual({
        id: 'contribution-1',
        goalId: 'goal-1',
        transactionId: null,
        amount: 10,
        currency: 'EUR',
        date: '2026-06-22T00:00:00.000Z',
        notes: 'Monthly saving',
        description: null,
      });

      expect(prisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
          userId: 'user-1',
        },
        select: {
          id: true,
          currency: true,
          currentAmount: true,
          targetAmount: true,
        },
      });

      expect(txContributionCreate).toHaveBeenCalledWith({
        data: {
          goalId: 'goal-1',
          userId: 'user-1',
          transactionId: null,
          amount: expect.any(Prisma.Decimal),
          currency: 'EUR',
          date: new Date('2026-06-22T00:00:00.000Z'),
          notes: 'Monthly saving',
        },
        include: {
          transaction: {
            select: {
              description: true,
              notes: true,
            },
          },
        },
      });

      expect(txGoalUpdate).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
        },
        data: {
          currentAmount: {
            increment: expect.any(Prisma.Decimal),
          },
        },
      });
    });

    it('links a valid transaction when creating a contribution', async () => {
      prisma.goal.findFirst.mockResolvedValue({
        id: 'goal-1',
        currency: 'EUR',
        currentAmount: new Prisma.Decimal('50'),
        targetAmount: new Prisma.Decimal('100'),
      });

      prisma.transaction.findFirst.mockResolvedValue({
        id: 'tx-1',
        type: 'expense',
        amount: new Prisma.Decimal('10'),
        currency: 'EUR',
        description: 'Transfer to savings',
        notes: 'Transaction note',
        date: new Date('2026-06-22T00:00:00.000Z'),
      });
      prisma.goalContribution.findFirst.mockResolvedValue(null);

      const txContributionCreate = jest.fn().mockResolvedValue({
        id: 'contribution-1',
        goalId: 'goal-1',
        transactionId: 'tx-1',
        amount: new Prisma.Decimal('10'),
        currency: 'EUR',
        date: new Date('2026-06-22T00:00:00.000Z'),
        notes: null,
        transaction: {
          description: 'Transfer to savings',
          notes: 'Transaction note',
        },
      });
      const txGoalUpdate = jest.fn();

      prisma.$transaction.mockImplementation((callback) =>
        callback({
          goalContribution: { create: txContributionCreate },
          goal: { update: txGoalUpdate },
        }),
      );

      await expect(
        service.createGoalContribution('user-1', 'goal-1', {
          amount: 10,
          currency: 'EUR',
          date: '2026-06-22T00:00:00.000Z',
          transactionId: 'tx-1',
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          transactionId: 'tx-1',
          notes: 'Transaction note',
          description: 'Transfer to savings',
        }),
      );

      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'tx-1',
          userId: 'user-1',
        },
        select: {
          id: true,
          type: true,
          amount: true,
          currency: true,
          description: true,
          notes: true,
          date: true,
        },
      });

      expect(prisma.goalContribution.findFirst).toHaveBeenCalledWith({
        where: {
          goalId: 'goal-1',
          transactionId: 'tx-1',
          userId: 'user-1',
        },
        select: {
          id: true,
        },
      });
    });

    it('rejects contributions for goals owned by another user', async () => {
      prisma.goal.findFirst.mockResolvedValue(null);

      await expect(
        service.createGoalContribution('user-1', 'goal-1', {
          amount: 10,
          currency: 'EUR',
          date: '2026-06-22T00:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.transaction.findFirst).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('prevents a contribution that exceeds the target', async () => {
      prisma.goal.findFirst.mockResolvedValue({
        id: 'goal-1',
        currency: 'EUR',
        currentAmount: new Prisma.Decimal('90'),
        targetAmount: new Prisma.Decimal('100'),
      });

      await expect(
        service.createGoalContribution('user-1', 'goal-1', {
          amount: 11,
          currency: 'EUR',
          date: '2026-06-22T00:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects linking a missing transaction', async () => {
      prisma.goal.findFirst.mockResolvedValue({
        id: 'goal-1',
        currency: 'EUR',
        currentAmount: new Prisma.Decimal('50'),
        targetAmount: new Prisma.Decimal('100'),
      });
      prisma.transaction.findFirst.mockResolvedValue(null);

      await expect(
        service.createGoalContribution('user-1', 'goal-1', {
          amount: 10,
          currency: 'EUR',
          date: '2026-06-22T00:00:00.000Z',
          transactionId: 'tx-1',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.goalContribution.findFirst).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects linking the same transaction twice to the same goal', async () => {
      prisma.goal.findFirst.mockResolvedValue({
        id: 'goal-1',
        currency: 'EUR',
        currentAmount: new Prisma.Decimal('50'),
        targetAmount: new Prisma.Decimal('100'),
      });
      prisma.transaction.findFirst.mockResolvedValue({ id: 'tx-1' });
      prisma.goalContribution.findFirst.mockResolvedValue({
        id: 'contribution-1',
      });

      await expect(
        service.createGoalContribution('user-1', 'goal-1', {
          amount: 10,
          currency: 'EUR',
          date: '2026-06-22T00:00:00.000Z',
          transactionId: 'tx-1',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('deleteGoalContribution', () => {
    it('deletes a contribution and subtracts its amount from the goal', async () => {
      prisma.goal.findFirst.mockResolvedValue({
        id: 'goal-1',
        currentAmount: new Prisma.Decimal('100'),
      });
      prisma.goalContribution.findFirst.mockResolvedValue({
        id: 'contribution-1',
        amount: new Prisma.Decimal('25'),
      });

      const txContributionDelete = jest.fn();
      const txGoalUpdate = jest.fn();

      prisma.$transaction.mockImplementation((callback) =>
        callback({
          goalContribution: { delete: txContributionDelete },
          goal: { update: txGoalUpdate },
        }),
      );

      await expect(
        service.deleteGoalContribution('user-1', 'goal-1', 'contribution-1'),
      ).resolves.toEqual({
        message: 'Contribution removed successfully.',
      });

      expect(prisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
          userId: 'user-1',
        },
        select: {
          id: true,
          currentAmount: true,
        },
      });

      expect(prisma.goalContribution.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'contribution-1',
          goalId: 'goal-1',
          userId: 'user-1',
        },
        select: {
          id: true,
          amount: true,
        },
      });

      expect(txContributionDelete).toHaveBeenCalledWith({
        where: {
          id: 'contribution-1',
        },
      });

      expect(txGoalUpdate).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
        },
        data: {
          currentAmount: new Prisma.Decimal('75'),
        },
      });
    });

    it('does not allow current amount to go below zero when deleting a contribution', async () => {
      prisma.goal.findFirst.mockResolvedValue({
        id: 'goal-1',
        currentAmount: new Prisma.Decimal('10'),
      });
      prisma.goalContribution.findFirst.mockResolvedValue({
        id: 'contribution-1',
        amount: new Prisma.Decimal('25'),
      });

      const txContributionDelete = jest.fn();
      const txGoalUpdate = jest.fn();

      prisma.$transaction.mockImplementation((callback) =>
        callback({
          goalContribution: { delete: txContributionDelete },
          goal: { update: txGoalUpdate },
        }),
      );

      await service.deleteGoalContribution(
        'user-1',
        'goal-1',
        'contribution-1',
      );

      expect(txGoalUpdate).toHaveBeenCalledWith({
        where: {
          id: 'goal-1',
        },
        data: {
          currentAmount: 0,
        },
      });
    });

    it('rejects deleting a contribution from a goal owned by another user', async () => {
      prisma.goal.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteGoalContribution('user-1', 'goal-1', 'contribution-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.goalContribution.findFirst).not.toHaveBeenCalled();
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects deleting a missing contribution', async () => {
      prisma.goal.findFirst.mockResolvedValue({
        id: 'goal-1',
        currentAmount: new Prisma.Decimal('100'),
      });
      prisma.goalContribution.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteGoalContribution('user-1', 'goal-1', 'missing'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('getGoalContributionsAnalytics', () => {
    it('builds contribution analytics totals and percentages', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.goalContribution.groupBy.mockResolvedValue([
        { goalId: 'goal-1', _sum: { amount: '30' }, _count: { _all: 3 } },
        { goalId: 'goal-2', _sum: { amount: '70' }, _count: { _all: 7 } },
      ]);
      prisma.goal.findMany.mockResolvedValue([
        {
          id: 'goal-1',
          name: 'Trip',
          icon: null,
          color: null,
          type: 'savings',
          status: 'active',
          currency: 'EUR',
        },
        {
          id: 'goal-2',
          name: 'Laptop',
          icon: null,
          color: null,
          type: 'purchase',
          status: 'active',
          currency: 'EUR',
        },
      ]);

      await expect(
        service.getGoalContributionsAnalytics('user-1', {
          period: AnalyticsPeriod.monthly,
          order: SortOrder.desc,
        }),
      ).resolves.toEqual({
        period: AnalyticsPeriod.monthly,
        total: '100.00',
        items: [
          expect.objectContaining({
            goalId: 'goal-2',
            total: '70.00',
            percentage: 70,
            contributionsCount: 7,
          }),
          expect.objectContaining({
            goalId: 'goal-1',
            total: '30.00',
            percentage: 30,
            contributionsCount: 3,
          }),
        ],
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs(),
      );

      expect(prisma.goalContribution.groupBy).toHaveBeenCalledWith({
        by: ['goalId'],
        where: {
          userId: 'user-1',
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

      expect(prisma.goal.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['goal-1', 'goal-2'],
          },
          userId: 'user-1',
        },
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
          type: true,
          status: true,
          currency: true,
        },
      });
    });

    it('uses monthly period and descending order by default', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.goalContribution.groupBy.mockResolvedValue([
        { goalId: 'goal-1', _sum: { amount: '10' }, _count: { _all: 1 } },
        { goalId: 'goal-2', _sum: { amount: '20' }, _count: { _all: 2 } },
      ]);
      prisma.goal.findMany.mockResolvedValue([
        {
          id: 'goal-1',
          name: 'Trip',
          icon: null,
          color: null,
          type: 'savings',
          status: 'active',
          currency: 'EUR',
        },
        {
          id: 'goal-2',
          name: 'Laptop',
          icon: null,
          color: null,
          type: 'purchase',
          status: 'active',
          currency: 'EUR',
        },
      ]);

      await expect(
        service.getGoalContributionsAnalytics('user-1', {}),
      ).resolves.toEqual({
        period: AnalyticsPeriod.monthly,
        total: '30.00',
        items: [
          expect.objectContaining({ goalId: 'goal-2', total: '20.00' }),
          expect.objectContaining({ goalId: 'goal-1', total: '10.00' }),
        ],
      });
    });

    it('sorts contribution analytics ascending when requested', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.goalContribution.groupBy.mockResolvedValue([
        { goalId: 'goal-1', _sum: { amount: '30' }, _count: { _all: 3 } },
        { goalId: 'goal-2', _sum: { amount: '70' }, _count: { _all: 7 } },
      ]);
      prisma.goal.findMany.mockResolvedValue([
        {
          id: 'goal-1',
          name: 'Trip',
          icon: null,
          color: null,
          type: 'savings',
          status: 'active',
          currency: 'EUR',
        },
        {
          id: 'goal-2',
          name: 'Laptop',
          icon: null,
          color: null,
          type: 'purchase',
          status: 'active',
          currency: 'EUR',
        },
      ]);

      await expect(
        service.getGoalContributionsAnalytics('user-1', {
          period: AnalyticsPeriod.monthly,
          order: SortOrder.asc,
        }),
      ).resolves.toEqual({
        period: AnalyticsPeriod.monthly,
        total: '100.00',
        items: [
          expect.objectContaining({ goalId: 'goal-1', total: '30.00' }),
          expect.objectContaining({ goalId: 'goal-2', total: '70.00' }),
        ],
      });
    });

    it('returns empty analytics when there are no contribution groups', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.goalContribution.groupBy.mockResolvedValue([]);
      prisma.goal.findMany.mockResolvedValue([]);

      await expect(
        service.getGoalContributionsAnalytics('user-1', {
          period: AnalyticsPeriod.weekly,
          order: SortOrder.desc,
        }),
      ).resolves.toEqual({
        period: AnalyticsPeriod.weekly,
        total: '0.00',
        items: [],
      });

      expect(prisma.goal.findMany).toHaveBeenCalledWith({
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
          status: true,
          currency: true,
        },
      });
    });

    it('skips grouped contributions whose goal no longer exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.goalContribution.groupBy.mockResolvedValue([
        { goalId: 'goal-1', _sum: { amount: '30' }, _count: { _all: 3 } },
        { goalId: 'deleted-goal', _sum: { amount: '70' }, _count: { _all: 7 } },
      ]);
      prisma.goal.findMany.mockResolvedValue([
        {
          id: 'goal-1',
          name: 'Trip',
          icon: null,
          color: null,
          type: 'savings',
          status: 'active',
          currency: 'EUR',
        },
      ]);

      await expect(
        service.getGoalContributionsAnalytics('user-1', {
          period: AnalyticsPeriod.monthly,
        }),
      ).resolves.toEqual({
        period: AnalyticsPeriod.monthly,
        total: '100.00',
        items: [
          expect.objectContaining({
            goalId: 'goal-1',
            total: '30.00',
            percentage: 30,
          }),
        ],
      });
    });

    it('rejects contribution analytics for missing users and does not query contributions', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getGoalContributionsAnalytics('missing', {
          period: AnalyticsPeriod.monthly,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.user.findUnique).toHaveBeenCalledWith(
        expectedUserFindUniqueArgs('missing'),
      );
      expect(prisma.goalContribution.groupBy).not.toHaveBeenCalled();
      expect(prisma.goal.findMany).not.toHaveBeenCalled();
    });
  });
});
