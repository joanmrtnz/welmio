import { TransactionType } from '@repo/shared-types';

export class TransactionsByCategoryItemDto {
  categoryId: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: TransactionType;
  total: string;
  percentage: number;
  transactionsCount: number;
}

export class TransactionsByCategoryResponseDto {
  period: string;
  type: TransactionType;
  total: string;
  items: TransactionsByCategoryItemDto[];
}