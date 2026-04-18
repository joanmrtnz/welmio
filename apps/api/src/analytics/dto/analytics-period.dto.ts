import { IsIn, IsOptional } from 'class-validator';

export class AnalyticsPeriodDto {
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly', 'yearly'])
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'weekly';
}