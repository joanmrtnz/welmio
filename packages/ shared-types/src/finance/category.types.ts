import type { TransactionType } from './transaction.types';

export interface Category {
  id: string;
  userId: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoriesOverviewResponse = {
  categories: Category[];
};