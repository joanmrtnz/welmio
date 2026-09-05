import type {
  Account,
  Category,
  CreateTransactionPayload,
  FrequencyType,
  TransactionNature,
  TransactionOverviewItem,
  TransactionType,
} from "@repo/shared-types";

export type CsvImportRow = {
  source: "welmio" | "bank";
  rowNumber: number;
  amount: number;
  currency: string;
  type: TransactionType;
  description: string;
  notes?: string;
  date: string;
  categoryName?: string;
  accountName?: string;
  frequencyType: FrequencyType;
  transactionNature: TransactionNature;
};

export type CsvImportMapping = {
  accountId: string;
  incomeCategoryId: string;
  expenseCategoryId: string;
};

export type PendingCsvImport = {
  fileName: string;
  rows: CsvImportRow[];
  categories: Category[];
  accounts: Account[];
};

export type ParsedImportTransaction = {
  payload: CreateTransactionPayload;
  preview: TransactionOverviewItem;
};

export type ImportTransactionsPreview = {
  fileName: string;
  transactions: ParsedImportTransaction[];
};
