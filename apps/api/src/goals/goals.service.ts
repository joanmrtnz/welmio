import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  GoalOverviewItemDto,
  GoalsOverviewResponseDto,
} from './dto/goals-overview-response.dto';
import { Goal, Prisma } from '@prisma/client';
import { CreateGoalDto } from './dto/create-goal.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalContributionResponseDto } from './dto/goal-contribution-response.dto';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';
import {
  AnalyticsPeriod,
  GetGoalContributionsAnalyticsQueryDto,
  SortOrder,
} from './dto/get-goal-contributions-analytics-query.dto';
import { GoalContributionsAnalyticsResponseDto } from './dto/goal-contributions-analytics-response.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGoalContributionsAnalytics(
    userId: string,
    query: GetGoalContributionsAnalyticsQueryDto,
  ): Promise<GoalContributionsAnalyticsResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const period = query.period ?? AnalyticsPeriod.monthly;
    const order = query.order ?? SortOrder.desc;
    const { startDate, endDate } = this.getAnalyticsDateRange(period);

    const grouped = await this.prisma.goalContribution.groupBy({
      by: ['goalId'],
      where: {
        userId,
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

    const goalIds = grouped.map((item) => item.goalId);

    const goals = await this.prisma.goal.findMany({
      where: {
        id: {
          in: goalIds,
        },
        userId,
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

    const goalsById = new Map(goals.map((goal) => [goal.id, goal]));

    const total = grouped.reduce((sum, item) => {
      return sum + Number(item._sum.amount ?? 0);
    }, 0);

    const items = grouped
      .map((item) => {
        const goal = goalsById.get(item.goalId);
        const amount = Number(item._sum.amount ?? 0);

        if (!goal) {
          return null;
        }

        return {
          goalId: goal.id,
          name: goal.name,
          icon: goal.icon,
          color: goal.color,
          type: goal.type,
          status: goal.status,
          currency: goal.currency,
          total: amount.toFixed(2),
          percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
          contributionsCount: item._count._all,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => {
        const amountA = Number(a.total);
        const amountB = Number(b.total);

        return order === SortOrder.asc ? amountA - amountB : amountB - amountA;
      });

    return {
      period,
      total: total.toFixed(2),
      items,
    };
  }

  private getAnalyticsDateRange(period: AnalyticsPeriod) {
    const now = new Date();

    switch (period) {
      case AnalyticsPeriod.daily:
        return {
          startDate: new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
              0,
              0,
              0,
              0,
            ),
          ),
          endDate: new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate() + 1,
              0,
              0,
              0,
              0,
            ),
          ),
        };

      case AnalyticsPeriod.weekly: {
        const day = now.getUTCDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;

        const startDate = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() + diffToMonday,
            0,
            0,
            0,
            0,
          ),
        );

        const endDate = new Date(
          Date.UTC(
            startDate.getUTCFullYear(),
            startDate.getUTCMonth(),
            startDate.getUTCDate() + 7,
            0,
            0,
            0,
            0,
          ),
        );

        return {
          startDate,
          endDate,
        };
      }

      case AnalyticsPeriod.yearly:
        return {
          startDate: new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0)),
          endDate: new Date(
            Date.UTC(now.getUTCFullYear() + 1, 0, 1, 0, 0, 0, 0),
          ),
        };

      case AnalyticsPeriod.monthly:
      default:
        return {
          startDate: new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
          ),
          endDate: new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth() + 1,
              1,
              0,
              0,
              0,
              0,
            ),
          ),
        };
    }
  }

  async getGoalContributions(
    userId: string,
    goalId: string,
  ): Promise<GoalContributionResponseDto[]> {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const contributions = await this.prisma.goalContribution.findMany({
      where: {
        goalId,
        userId,
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

    return contributions.map((contribution) => ({
      id: contribution.id,
      goalId: contribution.goalId,
      transactionId: contribution.transactionId,
      amount: contribution.amount.toNumber(),
      currency: contribution.currency,
      date: contribution.date.toISOString(),
      notes: contribution.notes ?? contribution.transaction?.notes ?? null,
      description: contribution.transaction?.description ?? null,
    }));
  }

  async deleteGoal(
    userId: string,
    goalId: string,
  ): Promise<{ message: string }> {
    const existingGoal = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!existingGoal) {
      throw new NotFoundException('Goal not found');
    }

    await this.prisma.goal.delete({
      where: {
        id: goalId,
      },
    });

    return {
      message: 'Goal deleted successfully.',
    };
  }

  async createGoal(
    userId: string,
    createGoalDto: CreateGoalDto,
    ): Promise<GoalOverviewItemDto> {
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    const targetAmount = new Prisma.Decimal(createGoalDto.targetAmount);
    const currentAmount = new Prisma.Decimal(createGoalDto.currentAmount ?? 0);

    if (currentAmount.greaterThan(targetAmount)) {
        throw new BadRequestException(
        'Current amount cannot be greater than target amount.',
        );
    }

    const currency = createGoalDto.currency.trim().toUpperCase();

    const startDate = createGoalDto.startDate
        ? new Date(createGoalDto.startDate)
        : new Date();

    const targetDate = createGoalDto.targetDate
        ? new Date(createGoalDto.targetDate)
        : null;

    const goal = await this.prisma.$transaction(async (tx) => {
        const createdGoal = await tx.goal.create({
        data: {
            userId,
            name: createGoalDto.name.trim(),
            description: createGoalDto.description?.trim() || null,
            targetAmount,
            currentAmount,
            currency,
            targetDate,
            startDate,
            type: createGoalDto.type,
            status: 'active',
            icon: createGoalDto.icon?.trim() || null,
            color: createGoalDto.color?.trim() || null,
        },
        });

        if (currentAmount.greaterThan(0)) {
        await tx.goalContribution.create({
            data: {
            goalId: createdGoal.id,
            userId,
            amount: currentAmount,
            currency,
            date: startDate,
            notes: 'Initial goal amount.',
            transactionId: null,
            },
        });
      }

      return createdGoal;
    });

    return this.toGoalOverviewItem(goal);
 }

  private toGoalOverviewItem(
    goal: Goal & {
      _count?: {
        contributions: number;
      };
    },
  ): GoalOverviewItemDto {
    const saved = goal.currentAmount.toNumber();
    const target = goal.targetAmount.toNumber();

    const progress = this.calculateProgress(saved, target);

    return {
      id: goal.id,
      name: goal.name,
      description: goal.description,
      icon: goal.icon,
      color: goal.color,
      type: goal.type,
      status: goal.status,
      saved,
      target,
      currency: goal.currency,
      progress,
      targetDate: goal.targetDate?.toISOString() ?? null,
      monthlyNeeded: this.calculateMonthlyNeeded(
        target,
        saved,
        goal.targetDate,
      ),
      statusLabel: this.getStatusLabel({
        saved,
        target,
        progress,
        startDate: goal.startDate,
        targetDate: goal.targetDate,
        status: goal.status,
      }),
      contributionsCount: goal._count?.contributions ?? 0,
    };
  }

  async getUserGoalsOverview(userId: string): Promise<GoalsOverviewResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const goals = await this.prisma.goal.findMany({
      where: {
        userId,
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
    });

    const goalItems: GoalOverviewItemDto[] = goals.map((goal) =>
        this.toGoalOverviewItem(goal),
    );

    const activeGoals = goalItems.filter((goal) => goal.status === 'active');

    const totalSaved = activeGoals.reduce((total, goal) => {
      return total + goal.saved;
    }, 0);

    const totalTarget = activeGoals.reduce((total, goal) => {
      return total + goal.target;
    }, 0);

    const monthlyNeeded = activeGoals.reduce((total, goal) => {
      return total + goal.monthlyNeeded;
    }, 0);

    const globalProgress = this.calculateProgress(totalSaved, totalTarget);

    const mainGoal =
      activeGoals.find((goal) => goal.progress < 100) ??
      activeGoals[0] ??
      goalItems[0] ??
      null;

    return {
      summary: {
        totalSaved,
        totalTarget,
        globalProgress,
        activeGoals: activeGoals.length,
        monthlyNeeded,
        progressMessage: this.getProgressMessage(globalProgress, activeGoals.length),
      },
      mainGoal,
      goals: goalItems,
    };
  }

  private calculateProgress(saved: number, target: number): number {
    if (target <= 0) {
      return 0;
    }

    return Math.min(Math.round((saved / target) * 100), 100);
  }

  private calculateMonthlyNeeded(
    target: number,
    saved: number,
    targetDate?: Date | null,
  ): number {
    const remainingAmount = Math.max(target - saved, 0);

    if (!targetDate || remainingAmount === 0) {
      return 0;
    }

    const now = new Date();

    if (targetDate <= now) {
      return remainingAmount;
    }

    const monthsRemaining = this.getMonthsRemaining(now, targetDate);

    if (monthsRemaining <= 0) {
      return remainingAmount;
    }

    return Math.ceil(remainingAmount / monthsRemaining);
  }

  private getMonthsRemaining(from: Date, to: Date): number {
    const yearDiff = to.getFullYear() - from.getFullYear();
    const monthDiff = to.getMonth() - from.getMonth();

    const months = yearDiff * 12 + monthDiff;

    return Math.max(months, 1);
  }

  private getStatusLabel(params: {
    saved: number;
    target: number;
    progress: number;
    startDate: Date;
    targetDate?: Date | null;
    status: string;
  }): string {
    const { saved, target, progress, startDate, targetDate, status } = params;

    if (status === 'completed' || saved >= target || progress >= 100) {
      return 'Completed';
    }

    if (status === 'paused') {
      return 'Paused';
    }

    if (!targetDate) {
      return 'No deadline';
    }

    const now = new Date();

    if (targetDate <= now) {
      return 'Overdue';
    }

    const totalDuration = targetDate.getTime() - startDate.getTime();
    const elapsedDuration = now.getTime() - startDate.getTime();

    if (totalDuration <= 0 || elapsedDuration <= 0) {
      return 'On track';
    }

    const expectedProgress = Math.round((elapsedDuration / totalDuration) * 100);

    if (progress + 5 >= expectedProgress) {
      return 'On track';
    }

    if (progress + 15 >= expectedProgress) {
      return 'A bit behind';
    }

    return 'Behind';
  }

  private getProgressMessage(globalProgress: number, activeGoals: number): string {
    if (activeGoals === 0) {
      return 'Create your first goal to start tracking your progress.';
    }

    return `${globalProgress}% of your goals completed.`;
  }

  async updateGoal(
    userId: string,
    goalId: string,
    updateGoalDto: UpdateGoalDto,
  ): Promise<GoalOverviewItemDto> {
    const existingGoal = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!existingGoal) {
      throw new NotFoundException('Goal not found');
    }

    const nextTargetAmount =
      updateGoalDto.targetAmount !== undefined
        ? new Prisma.Decimal(updateGoalDto.targetAmount)
        : existingGoal.targetAmount;

    const nextCurrentAmount =
      updateGoalDto.currentAmount !== undefined
        ? new Prisma.Decimal(updateGoalDto.currentAmount)
        : existingGoal.currentAmount;

    if (nextCurrentAmount.greaterThan(nextTargetAmount)) {
      throw new BadRequestException(
        'Current amount cannot be greater than target amount.',
      );
    }

    const nextCurrency = updateGoalDto.currency
      ? updateGoalDto.currency.trim().toUpperCase()
      : existingGoal.currency;

    const currentAmountHasChanged =
      updateGoalDto.currentAmount !== undefined &&
      !nextCurrentAmount.equals(existingGoal.currentAmount);

    const amountDifference = nextCurrentAmount.minus(existingGoal.currentAmount);

    const updatedGoal = await this.prisma.$transaction(async (tx) => {
      const goal = await tx.goal.update({
        where: {
          id: goalId,
        },
        data: {
          ...(updateGoalDto.name !== undefined && {
            name: updateGoalDto.name.trim(),
          }),

          ...(updateGoalDto.description !== undefined && {
            description: updateGoalDto.description?.trim() || null,
          }),

          ...(updateGoalDto.targetAmount !== undefined && {
            targetAmount: nextTargetAmount,
          }),

          ...(updateGoalDto.currentAmount !== undefined && {
            currentAmount: nextCurrentAmount,
          }),

          ...(updateGoalDto.currency !== undefined && {
            currency: nextCurrency,
          }),

          ...(updateGoalDto.targetDate !== undefined && {
            targetDate: updateGoalDto.targetDate
              ? new Date(updateGoalDto.targetDate)
              : null,
          }),

          ...(updateGoalDto.startDate !== undefined && {
            startDate: updateGoalDto.startDate
              ? new Date(updateGoalDto.startDate)
              : existingGoal.startDate,
          }),

          ...(updateGoalDto.type !== undefined && {
            type: updateGoalDto.type,
          }),

          ...(updateGoalDto.icon !== undefined && {
            icon: updateGoalDto.icon?.trim() || null,
          }),

          ...(updateGoalDto.color !== undefined && {
            color: updateGoalDto.color?.trim() || null,
          }),
        },
      });

      if (currentAmountHasChanged && !amountDifference.equals(0)) {
        await tx.goalContribution.create({
          data: {
            goalId: goal.id,
            userId,
            amount: amountDifference,
            currency: nextCurrency,
            date: new Date(),
            notes: 'Goal balance adjustment.',
            transactionId: null,
          },
        });
      }

      return goal;
    });

    return this.toGoalOverviewItem(updatedGoal);
  }

  async createGoalContribution(
    userId: string,
    goalId: string,
    createGoalContributionDto: CreateGoalContributionDto,
  ): Promise<GoalContributionResponseDto> {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
      select: {
        id: true,
        currency: true,
        currentAmount: true,
        targetAmount: true,
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const amount = new Prisma.Decimal(createGoalContributionDto.amount);
    const nextCurrentAmount = goal.currentAmount.plus(amount);

    if (nextCurrentAmount.greaterThan(goal.targetAmount)) {
      throw new BadRequestException(
        'Contribution would exceed the goal target amount.',
      );
    }

    const currency = createGoalContributionDto.currency.trim().toUpperCase();
    const transactionId = createGoalContributionDto.transactionId ?? null;

    if (transactionId) {
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          id: transactionId,
          userId,
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

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      const existingContribution = await this.prisma.goalContribution.findFirst({
        where: {
          goalId,
          transactionId,
          userId,
        },
        select: {
          id: true,
        },
      });

      if (existingContribution) {
        throw new BadRequestException(
          'This transaction is already linked to this goal.',
        );
      }
    }

    const createdContribution = await this.prisma.$transaction(async (tx) => {
      const contribution = await tx.goalContribution.create({
        data: {
          goalId,
          userId,
          transactionId,
          amount,
          currency,
          date: new Date(createGoalContributionDto.date),
          notes: createGoalContributionDto.notes?.trim() || null,
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

      await tx.goal.update({
        where: {
          id: goalId,
        },
        data: {
          currentAmount: {
            increment: amount,
          },
        },
      });

      return contribution;
    });

    return {
      id: createdContribution.id,
      goalId: createdContribution.goalId,
      transactionId: createdContribution.transactionId,
      amount: createdContribution.amount.toNumber(),
      currency: createdContribution.currency,
      date: createdContribution.date.toISOString(),
      notes:
        createdContribution.notes ??
        createdContribution.transaction?.notes ??
        null,
      description: createdContribution.transaction?.description ?? null,
    };
  }

  async deleteGoalContribution(
    userId: string,
    goalId: string,
    contributionId: string,
  ): Promise<{ message: string }> {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
      select: {
        id: true,
        currentAmount: true,
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const contribution = await this.prisma.goalContribution.findFirst({
      where: {
        id: contributionId,
        goalId,
        userId,
      },
      select: {
        id: true,
        amount: true,
      },
    });

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    const nextCurrentAmount = goal.currentAmount.minus(contribution.amount);

    await this.prisma.$transaction(async (tx) => {
      await tx.goalContribution.delete({
        where: {
          id: contributionId,
        },
      });

      await tx.goal.update({
        where: {
          id: goalId,
        },
        data: {
          currentAmount: nextCurrentAmount.lessThan(0)
            ? 0
            : nextCurrentAmount,
        },
      });
    });

    return {
      message: 'Contribution removed successfully.',
    };
  }
}