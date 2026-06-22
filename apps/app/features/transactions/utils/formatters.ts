import i18n, { t } from "@/lib/i18n";
import { formatCurrency } from "@/utils/formatCurrency";
import { FrequencyType, TransactionNature } from "@repo/shared-types";

export function formatSignedAmount(
  amount: string,
  type: "income" | "expense",
  currency = "USD",
) {
  const formatted = formatCurrency(amount, currency);

  return type === "expense" ? `-${formatted}` : formatted;
}

export function formatTransactionMeta(dateIso: string) {
  const date = new Date(dateIso);
  const locale = i18n.locale || "en";

  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  const monthDay = new Intl.DateTimeFormat(locale, {
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
    return translateTransactionNature(item.transactionNature);
  }

  if (item.frequencyType && item.frequencyType !== "one_time") {
    return translateFrequencyType(item.frequencyType);
  }

  return item.category.name;
}

export function formatCategoryLabel(
  categoryName: string,
  frequencyType: FrequencyType,
  transactionNature: TransactionNature,
) {
  if (transactionNature !== "other") {
    return translateTransactionNature(transactionNature);
  }

  if (frequencyType !== "one_time") {
    return translateFrequencyType(frequencyType);
  }

  return categoryName;
}

function translateTransactionNature(value: string) {
  return translateOption(
    `transactions.form.natureOptions.${value}`,
    value,
  );
}

function translateFrequencyType(value: string) {
  return translateOption(
    `transactions.form.frequencyOptions.${value}`,
    value,
  );
}

function translateOption(key: string, fallbackValue: string) {
  const translated = t(key);

  if (typeof translated === "string" && !isMissingTranslation(translated)) {
    return translated;
  }

  return capitalize(fallbackValue);
}

function isMissingTranslation(value: string) {
  return value.startsWith("[missing");
}

function capitalize(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}