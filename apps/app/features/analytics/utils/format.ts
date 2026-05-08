export function formatCompactNumber(value: number): string {
  if (value >= 1000) {
    const compact = value / 1000;
    return Number.isInteger(compact) ? `${compact}k` : `${compact.toFixed(1)}k`;
  }

  return `${Math.round(value)}`;
}