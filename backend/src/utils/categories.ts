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

const keywordMap: Record<string, (typeof EXPENSE_CATEGORIES)[number]> = {
  uber: "Transport",
  fuel: "Transport",
  shell: "Transport",
  grocery: "Groceries",
  mart: "Groceries",
  market: "Groceries",
  restaurant: "Dining",
  coffee: "Dining",
  cafe: "Dining",
  netflix: "Subscriptions",
  spotify: "Subscriptions",
  power: "Utilities",
  electric: "Utilities",
  pharmacy: "Healthcare",
  hospital: "Healthcare",
  hotel: "Travel"
};

export function classifyExpense(merchant: string, description?: string) {
  const content = `${merchant} ${description ?? ""}`.toLowerCase();

  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (content.includes(keyword)) {
      return { category, confidence: "rule" as const };
    }
  }

  return { category: "Other" as const, confidence: "low" as const };
}

