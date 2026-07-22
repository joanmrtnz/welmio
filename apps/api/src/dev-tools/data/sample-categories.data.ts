import { TransactionType } from '@prisma/client';

export type SampleCategoryUpdate = {
  matchName: string;
  type: TransactionType;
  color: string;
  icon: string;
};

export const SAMPLE_CATEGORY_UPDATES: SampleCategoryUpdate[] = [
  {
    matchName: 'Groceries',
    type: TransactionType.expense,
    color: '#22C55E',
    icon: 'groceries',
  },
  {
    matchName: 'Food & Dining',
    type: TransactionType.expense,
    color: '#F97316',
    icon: 'food',
  },
  {
    matchName: 'Transport',
    type: TransactionType.expense,
    color: '#3B82F6',
    icon: 'car',
  },
  {
    matchName: 'Housing',
    type: TransactionType.expense,
    color: '#8B5CF6',
    icon: 'rent',
  },
  {
    matchName: 'Salary',
    type: TransactionType.income,
    color: '#16A34A',
    icon: 'income',
  },
  {
    matchName: 'Freelance',
    type: TransactionType.income,
    color: '#2563EB',
    icon: 'document',
  },
];
