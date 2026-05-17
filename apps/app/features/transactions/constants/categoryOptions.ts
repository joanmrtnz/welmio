export const CATEGORY_ICONS = [
  { name: "food", label: "Food & Dining" },
  { name: "groceries", label: "Groceries" },
  { name: "car", label: "Transport" },
  { name: "rent", label: "Housing" },
  { name: "document", label: "Utilities" },
  { name: "medicine", label: "Health" },
  { name: "ticket", label: "Entertainment" },
  { name: "gift", label: "Shopping / Gifts" },
  { name: "book", label: "Education" },
  { name: "plane", label: "Travel" },
  { name: "expense", label: "Other Expense" },
  { name: "income", label: "Salary" },
  { name: "savings", label: "Investments" },
  { name: "arrowLeft", label: "Refunds" },
  { name: "plus", label: "Other Income" },
  { name: "money", label: "Money" },
] as const;

export const CATEGORY_COLORS = [
  "#16a34a",
  "#14cfa1",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
];

export const DEFAULT_CATEGORY_ICON = "plus";
export const DEFAULT_CATEGORY_COLOR = "#16a34a";
export const DEFAULT_CATEGORY_TYPE = "expense";