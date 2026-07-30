type CurrencyFormatOptions = {
  compact?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

const DEFAULT_CURRENCY = "EUR";
const COMPACT_THRESHOLD = 10_000;

export function formatCurrency(
  amount: number | string | null | undefined,
  currency = DEFAULT_CURRENCY,
  options: CurrencyFormatOptions = { compact: true },
) {
  const numericAmount = toFiniteNumber(amount);
  const compact = options.compact ?? true;

  if (compact) {
    return formatCompactCurrency(numericAmount, currency, options);
  }

  return formatStandardCurrency(numericAmount, currency, options);
}

export function formatCompactCurrency(
  amount: number | string | null | undefined,
  currency = DEFAULT_CURRENCY,
  options: CurrencyFormatOptions = {},
) {
  const numericAmount = toFiniteNumber(amount);
  const absValue = Math.abs(numericAmount);

  if (absValue < COMPACT_THRESHOLD) {
    return formatStandardCurrency(numericAmount, currency, options);
  }

  const symbol = getCurrencySymbol(currency);

  return `${symbol}${formatCompactNumber(numericAmount)}`;
}

export function formatCompactNumber(value: number | string | null | undefined) {
  const numericValue = toFiniteNumber(value);
  const absValue = Math.abs(numericValue);

  if (absValue >= 1_000_000) {
    return `${formatCompactValue(numericValue / 1_000_000)} M`;
  }

  if (absValue >= COMPACT_THRESHOLD) {
    return `${formatCompactValue(numericValue / 1_000)} K`;
  }

  return formatStandardNumber(numericValue);
}

function formatStandardCurrency(
  amount: number,
  currency: string,
  options: CurrencyFormatOptions = {},
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount);
}

function formatStandardNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCompactValue(value: number) {
  return Number(value.toFixed(2)).toString();
}

function toFiniteNumber(value: number | string | null | undefined) {
  const numericValue =
    typeof value === "string" ? Number(value) : Number(value ?? 0);

  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getCurrencySymbol(currency: string) {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  const formattedCurrency = new Intl.NumberFormat("en-US", options).format(0);
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0);

  return formattedCurrency.replace(formattedNumber, "").trim() || currency;
}
