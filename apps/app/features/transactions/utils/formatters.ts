import { formatCurrency } from "@/utils/formatCurrency";
import { FrequencyType, TransactionNature } from "@repo/shared-types";

export function formatSignedAmount(
  amount: string,
  type: "income" | "expense",
  currency = "USD"
) {
  const formatted = formatCurrency(amount, currency);
  return type === "expense" ? `-${formatted}` : formatted;
}

export function formatTransactionMeta(dateIso: string) {
  const date = new Date(dateIso);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  const monthDay = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(date);

  return `${time} · ${monthDay}`;
}

export function getTransactionLabel(item: {
  category: { name: string };
  frequencyType: string;
  transactionNature: string;
}) {
  if (item.transactionNature && item.transactionNature !== "other") {
    return capitalize(item.transactionNature);
  }

  if (item.frequencyType && item.frequencyType !== "one_time") {
    return capitalize(item.frequencyType);
  }

  return item.category.name;
}

export function formatCategoryLabel(
  categoryName: string,
  frequencyType: FrequencyType,
  transactionNature: TransactionNature,
) {
  if (transactionNature !== "other") {
    return transactionNature
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  if (frequencyType !== "one_time") {
    return frequencyType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return categoryName;
}

function capitalize(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}