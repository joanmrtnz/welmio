import {
  AccountType,
  FrequencyType,
  TransactionNature,
  TransactionType,
} from '@repo/shared-types';

export class TransactionOverviewCategoryDto {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: TransactionType;
}

export class TransactionOverviewAccountDto {
  id: string;
  name: string;
  type: AccountType;
  currencies: string[];
}

export class TransactionOverviewItemDto {
  id: string;
  description: string;
  notes?: string | null;
  amount: string;
  currency: string;
  type: TransactionType;
  date: string;
  frequencyType: FrequencyType;
  transactionNature: TransactionNature;
  category: TransactionOverviewCategoryDto;
  account: TransactionOverviewAccountDto;
}

export class TransactionOverviewGroupDto {
  month: string;
  items: TransactionOverviewItemDto[];
}

export class TransactionsOverviewSummaryDto {
  totalBalance: string;
  totalIncome: string;
  totalExpense: string;
  expenseRatio: number;
  progressMessage: string;
}

export class TransactionsOverviewResponseDto {
  summary: TransactionsOverviewSummaryDto;
  groups: TransactionOverviewGroupDto[];
}