import { IsEnum, IsOptional } from 'class-validator';

export enum AnalyticsPeriod {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export class GetGoalContributionsAnalyticsQueryDto {
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod = AnalyticsPeriod.monthly;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.desc;
}
