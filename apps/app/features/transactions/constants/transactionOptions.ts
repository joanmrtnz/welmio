import { FrequencyType, TransactionNature } from "@repo/shared-types";

export const FREQUENCY_OPTIONS: { value: FrequencyType; label: string }[] = [
  { value: "one_time", label: "One time" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const NATURE_OPTIONS: { value: TransactionNature; label: string }[] = [
  { value: "variable", label: "Variable" },
  { value: "fixed", label: "Fixed" },
  { value: "rent", label: "Rent" },
  { value: "subscription", label: "Subscription" },
  { value: "salary", label: "Salary" },
  { value: "refund", label: "Refund" },
  { value: "other", label: "Other" },
];