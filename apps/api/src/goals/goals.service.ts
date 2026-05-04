import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  GoalOverviewItemDto,
  GoalsOverviewResponseDto,
} from './dto/goals-overview-response.dto';
import { Goal, Prisma } from '@prisma/client';
import { CreateGoalDto } from './dto/create-goal.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

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

 private toGoalOverviewItem(goal: Goal): GoalOverviewItemDto {
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
}