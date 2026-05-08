export function formatCurrency(amount: number | string, currency = "EUR") {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number.isFinite(numericAmount) ? numericAmount : 0);
}