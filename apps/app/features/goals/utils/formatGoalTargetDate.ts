import i18n, { t } from "@/lib/i18n";

type FormatGoalTargetDateOptions = {
  fallback?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
};

export function formatGoalTargetDate(
  targetDate?: string | Date | null,
  options: FormatGoalTargetDateOptions = {},
) {
  const fallback = options.fallback ?? t("goals.details.noDeadline");

  if (!targetDate) return fallback;

  const date = targetDate instanceof Date ? targetDate : new Date(targetDate);

  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat(i18n.locale || "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options.formatOptions,
  }).format(date);
}
