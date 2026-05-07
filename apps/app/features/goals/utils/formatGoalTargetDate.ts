export function formatGoalTargetDate(targetDate?: string | Date | null) {
  if (!targetDate) return "No date";

  const date = targetDate instanceof Date ? targetDate : new Date(targetDate);

  if (Number.isNaN(date.getTime())) return "No date";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
