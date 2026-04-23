export const EXPENSE_CATEGORIES = [
  "Groceries",
  "Dining",
  "Transport",
  "Utilities",
  "Rent",
  "Entertainment",
  "Subscriptions",
  "Healthcare",
  "Shopping",
  "Travel",
  "Other"
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

