export type TransactionType = 'income' | 'expense';

export type FrequencyType = 'one_time' | 'weekly' | 'monthly' | 'yearly';

export type TransactionNature =
  | 'fixed'
  | 'variable'
  | 'rent'
  | 'subscription'
  | 'salary'
  | 'refund'
  | 'other';

export interface Transaction {
  id: string;
  userId: string;
  amount: string;
  currency: string;
  type: TransactionType;
  description: string;
  notes?: string | null;
  date: Date;
  categoryId: string;
  accountId: string;
  frequencyType: FrequencyType;
  transactionNature: TransactionNature;
  createdAt: Date;
  updatedAt: Date;
}