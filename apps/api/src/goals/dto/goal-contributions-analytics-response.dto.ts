import { GoalStatus, GoalType } from '@prisma/client';

export class GoalContributionAnalyticsItemDto {
  goalId: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: GoalType;
  status: GoalStatus;
  currency: string;
  total: string;
  percentage: number;
  contributionsCount: number;
}

export class GoalContributionsAnalyticsResponseDto {
  period: string;
  total: string;
  items: GoalContributionAnalyticsItemDto[];
}
