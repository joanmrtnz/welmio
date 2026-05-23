import { IsEnum, IsOptional } from 'class-validator';
import { TransactionType } from '@prisma/client';

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

export class GetTransactionsByCategoryQueryDto {
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod = AnalyticsPeriod.monthly;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType = 'expense' as TransactionType;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.desc;
}