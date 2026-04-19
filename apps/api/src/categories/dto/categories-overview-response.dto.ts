import { TransactionType } from '@repo/shared-types';

export class CategoryOverviewItemDto {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  type: TransactionType;
}

export class CategoriesOverviewSummaryDto {
  totalBalance: string;
  totalIncome: string;
  totalExpense: string;
  expenseRatio: number;
  progressMessage: string;
}

export class CategoriesOverviewResponseDto {
  summary: CategoriesOverviewSummaryDto;
  categories: CategoryOverviewItemDto[];
}