import { FrequencyType, TransactionNature } from "@repo/shared-types";

type TransactionOption<TValue extends string> = {
  value: TValue;
  translationKey: string;
};

export const FREQUENCY_OPTIONS: TransactionOption<FrequencyType>[] = [
  {
    value: "one_time",
    translationKey: "transactions.form.frequencyOptions.one_time",
  },
  {
    value: "weekly",
    translationKey: "transactions.form.frequencyOptions.weekly",
  },
  {
    value: "monthly",
    translationKey: "transactions.form.frequencyOptions.monthly",
  },
  {
    value: "yearly",
    translationKey: "transactions.form.frequencyOptions.yearly",
  },
];

export const NATURE_OPTIONS: TransactionOption<TransactionNature>[] = [
  {
    value: "variable",
    translationKey: "transactions.form.natureOptions.variable",
  },
  { value: "fixed", translationKey: "transactions.form.natureOptions.fixed" },
  { value: "rent", translationKey: "transactions.form.natureOptions.rent" },
  {
    value: "subscription",
    translationKey: "transactions.form.natureOptions.subscription",
  },
  { value: "salary", translationKey: "transactions.form.natureOptions.salary" },
  { value: "refund", translationKey: "transactions.form.natureOptions.refund" },
  { value: "other", translationKey: "transactions.form.natureOptions.other" },
];
