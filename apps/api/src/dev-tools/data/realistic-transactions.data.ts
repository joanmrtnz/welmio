import {
  FrequencyType,
  TransactionNature,
  TransactionType,
} from '@prisma/client';

export type RealisticTransactionTemplate = {
  description: string;
  type: TransactionType;
  categoryNames: string[];
  amountMin: number;
  amountMax: number;
  frequencyType: FrequencyType;
  transactionNature: TransactionNature;
};

export const REALISTIC_TRANSACTION_TEMPLATES: RealisticTransactionTemplate[] = [
  {
    description: 'Mercadona groceries',
    type: TransactionType.expense,
    categoryNames: ['Groceries'],
    amountMin: 18,
    amountMax: 95,
    frequencyType: FrequencyType.weekly,
    transactionNature: TransactionNature.variable,
  },
  {
    description: 'Coffee with friends',
    type: TransactionType.expense,
    categoryNames: ['Food & Dining'],
    amountMin: 6,
    amountMax: 24,
    frequencyType: FrequencyType.one_time,
    transactionNature: TransactionNature.variable,
  },
  {
    description: 'Monthly rent',
    type: TransactionType.expense,
    categoryNames: ['Housing'],
    amountMin: 720,
    amountMax: 1150,
    frequencyType: FrequencyType.monthly,
    transactionNature: TransactionNature.rent,
  },
  {
    description: 'Metro pass',
    type: TransactionType.expense,
    categoryNames: ['Transport'],
    amountMin: 20,
    amountMax: 55,
    frequencyType: FrequencyType.monthly,
    transactionNature: TransactionNature.fixed,
  },
  {
    description: 'Pharmacy purchase',
    type: TransactionType.expense,
    categoryNames: ['Health'],
    amountMin: 9,
    amountMax: 48,
    frequencyType: FrequencyType.one_time,
    transactionNature: TransactionNature.variable,
  },
  {
    description: 'Streaming subscription',
    type: TransactionType.expense,
    categoryNames: ['Subscriptions'],
    amountMin: 8,
    amountMax: 18,
    frequencyType: FrequencyType.monthly,
    transactionNature: TransactionNature.subscription,
  },
  {
    description: 'Weekend trip',
    type: TransactionType.expense,
    categoryNames: ['Travel'],
    amountMin: 85,
    amountMax: 320,
    frequencyType: FrequencyType.one_time,
    transactionNature: TransactionNature.variable,
  },
  {
    description: 'Monthly salary',
    type: TransactionType.income,
    categoryNames: ['Salary'],
    amountMin: 1900,
    amountMax: 3600,
    frequencyType: FrequencyType.monthly,
    transactionNature: TransactionNature.salary,
  },
  {
    description: 'Freelance project',
    type: TransactionType.income,
    categoryNames: ['Freelance'],
    amountMin: 250,
    amountMax: 1200,
    frequencyType: FrequencyType.one_time,
    transactionNature: TransactionNature.other,
  },
  {
    description: 'Returned purchase refund',
    type: TransactionType.income,
    categoryNames: ['Refunds'],
    amountMin: 15,
    amountMax: 140,
    frequencyType: FrequencyType.one_time,
    transactionNature: TransactionNature.refund,
  },
];
