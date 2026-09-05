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

export interface TransactionOverviewCategory {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: TransactionType;
}

export interface TransactionOverviewAccount {
  id: string;
  name: string;
  type: string;
  currencies: string[];
}

export interface TransactionOverviewItem {
  id: string;
  description: string;
  notes?: string | null;
  amount: string;
  currency: string;
  type: TransactionType;
  date: string;
  frequencyType: FrequencyType;
  transactionNature: TransactionNature;
  category: TransactionOverviewCategory;
  account: TransactionOverviewAccount;
}

export interface TransactionOverviewGroup {
  month: string;
  items: TransactionOverviewItem[];
}

export interface TransactionsOverviewResponse {
  summary: {
    totalBalance: string;
    totalIncome: string;
    totalExpense: string;
    expenseRatio: number;
    progressMessage: string;
  };
  groups: TransactionOverviewGroup[];
}

export type CreateTransactionPayload = {
  amount: number;
  currency: string;
  type: TransactionType;
  description: string;
  notes?: string;
  date: string;
  categoryId: string;
  accountId: string;
  frequencyType: FrequencyType;
  transactionNature: TransactionNature;
  goalId?: string | null;
};

export type ImportTransactionsPayload = {
  transactions: CreateTransactionPayload[];
};

export type ImportTransactionsResponse = {
  importedCount: number;
};
