import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GoalStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DevToolsService } from './dev-tools.service';
import type { DevToolActionId } from './types/dev-tool-action.types';

describe('DevToolsService', () => {
  let service: DevToolsService;

  const prisma = {
    user: { findUnique: jest.fn() },
    account: { findFirst: jest.fn() },
    category: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    transaction: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    goal: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', role: 'ADMIN' });
    prisma.$transaction.mockImplementation((queries) => Promise.all(queries));

    const module: TestingModule = await Test.createTestingModule({
      providers: [DevToolsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<DevToolsService>(DevToolsService);
  });

  it('rejects actions for a missing user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.runAction('missing', 'refresh-analytics'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects actions for a non-admin user', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1', role: 'USER' });

    await expect(
      service.runAction('user-1', 'refresh-analytics'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects unsupported actions', async () => {
    await expect(
      service.runAction('user-1', 'unknown' as DevToolActionId),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates realistic transactions using only the current user account and categories', async () => {
    prisma.account.findFirst.mockResolvedValue({
      id: 'account-1',
      name: 'Cash',
      currencies: ['EUR'],
    });
    prisma.category.findMany.mockResolvedValue([
      { id: 'cat-groceries', name: 'Groceries', type: 'expense' },
      { id: 'cat-food', name: 'Food & Dining', type: 'expense' },
      { id: 'cat-housing', name: 'Housing', type: 'expense' },
      { id: 'cat-transport', name: 'Transport', type: 'expense' },
      { id: 'cat-health', name: 'Health', type: 'expense' },
      { id: 'cat-subscriptions', name: 'Subscriptions', type: 'expense' },
      { id: 'cat-travel', name: 'Travel', type: 'expense' },
      { id: 'cat-salary', name: 'Salary', type: 'income' },
      { id: 'cat-freelance', name: 'Freelance', type: 'income' },
      { id: 'cat-refunds', name: 'Refunds', type: 'income' },
    ]);
    prisma.transaction.createMany.mockResolvedValue({ count: 50 });

    await expect(
      service.runAction('user-1', 'import-realistic-transactions'),
    ).resolves.toMatchObject({
      actionId: 'import-realistic-transactions',
      success: true,
      summary: {
        created: 50,
        skipped: 0,
        account: 'Cash',
      },
    });

    expect(prisma.account.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-1' } }),
    );
    expect(prisma.transaction.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          userId: 'user-1',
          accountId: 'account-1',
        }),
      ]),
    });
  });

  it('deletes at most 10 transactions scoped to the current user', async () => {
    prisma.transaction.findMany.mockResolvedValue(
      Array.from({ length: 15 }, (_, index) => ({ id: `tx-${index}` })),
    );
    prisma.transaction.deleteMany.mockResolvedValue({ count: 10 });

    await expect(
      service.runAction('user-1', 'delete-random-transactions'),
    ).resolves.toMatchObject({
      actionId: 'delete-random-transactions',
      success: true,
      summary: {
        requested: 10,
        deleted: 10,
      },
    });

    expect(prisma.transaction.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        id: {
          in: expect.arrayContaining([expect.any(String)]),
        },
      },
    });
    const deleteArgs = prisma.transaction.deleteMany.mock.calls[0][0];
    expect(deleteArgs.where.id.in).toHaveLength(10);
  });

  it('updates category metadata only for matched current user categories', async () => {
    prisma.category.findMany.mockResolvedValue([
      { id: 'cat-groceries', name: 'Groceries', type: 'expense' },
      { id: 'cat-salary', name: 'Salary', type: 'income' },
    ]);
    prisma.category.update.mockResolvedValue({});

    await expect(
      service.runAction('user-1', 'update-sample-categories'),
    ).resolves.toMatchObject({
      actionId: 'update-sample-categories',
      success: true,
      summary: {
        matched: 2,
        updated: 2,
      },
    });

    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: 'cat-groceries' },
      data: {
        icon: 'groceries',
        color: '#22C55E',
      },
    });
  });

  it('creates a sample savings goal when no active duplicate exists', async () => {
    prisma.goal.findFirst.mockResolvedValue(null);
    prisma.goal.create.mockResolvedValue({ id: 'goal-1' });

    await expect(
      service.runAction('user-1', 'create-savings-goal'),
    ).resolves.toMatchObject({
      actionId: 'create-savings-goal',
      success: true,
      summary: {
        created: 1,
        name: 'Emergency Cushion',
      },
    });

    expect(prisma.goal.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        name: 'Emergency Cushion',
        status: GoalStatus.active,
      },
      select: { id: true },
    });
    expect(prisma.goal.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        name: 'Emergency Cushion',
      }),
    });
  });

  it('does not create a duplicate active sample savings goal', async () => {
    prisma.goal.findFirst.mockResolvedValue({ id: 'goal-1' });

    await expect(
      service.runAction('user-1', 'create-savings-goal'),
    ).resolves.toMatchObject({
      actionId: 'create-savings-goal',
      success: true,
      summary: {
        created: 0,
        skipped: 1,
      },
    });

    expect(prisma.goal.create).not.toHaveBeenCalled();
  });

  it('returns a stable no-op response for analytics refresh', async () => {
    await expect(
      service.runAction('user-1', 'refresh-analytics'),
    ).resolves.toEqual({
      actionId: 'refresh-analytics',
      success: true,
      message: 'Analytics refreshed.',
      summary: {
        refreshed: true,
        mode: 'computed-live',
      },
    });
  });
});
