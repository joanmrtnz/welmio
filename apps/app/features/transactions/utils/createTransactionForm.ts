import { AccountsResponse, TransactionType } from "@repo/shared-types";

export function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

export function normalizeAmountInput(amount: string) {
  return Number(amount.replace(",", "."));
}

export function parseTransactionDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function normalizeCurrency(currency: string) {
  return currency.trim().toUpperCase();
}

export function getAccountsFromResponse(response: AccountsResponse) {
  return Array.isArray(response) ? response : response.accounts;
}

export function getDefaultTransactionNature(type: TransactionType) {
  return type === "income" ? "salary" : "variable";
}