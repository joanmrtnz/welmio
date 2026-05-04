import { GoalStatus, GoalType } from '@prisma/client';

export class GoalOverviewItemDto {
  id: string;
  name: string;
  description?: string | null;

  icon?: string | null;
  color?: string | null;

  type: GoalType;
  status: GoalStatus;

  saved: number;
  target: number;
  currency: string;

  progress: number;
  targetDate?: string | null;
  monthlyNeeded: number;
  statusLabel: string;

  contributionsCount: number;
}

export class GoalsOverviewSummaryDto {
  totalSaved: number;
  totalTarget: number;
  globalProgress: number;
  activeGoals: number;
  monthlyNeeded: number;
  progressMessage: string;
}

export class GoalsOverviewResponseDto {
  summary: GoalsOverviewSummaryDto;
  mainGoal: GoalOverviewItemDto | null;
  goals: GoalOverviewItemDto[];
}