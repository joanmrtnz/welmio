import type { TransactionDetailsItem } from "../types/transactionDetails.types";

export function formatAmount(transaction: TransactionDetailsItem) {
  const amountNumber = Number(transaction.amount);
  const sign = transaction.type === "expense" ? "-" : "+";

  if (Number.isNaN(amountNumber)) {
    return `${sign}${transaction.amount} ${transaction.currency}`;
  }

  return `${sign}${amountNumber.toFixed(2)} ${transaction.currency}`;
}

export function formatDate(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatValue(value?: string | null) {
  if (!value) return "Not set";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}