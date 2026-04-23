import OpenAI from "openai";
import { env } from "../config/env";
import { EXPENSE_CATEGORIES } from "../utils/categories";

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;
type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export function getAiStatus() {
  return {
    enabled: Boolean(client),
    model: env.OPENAI_MODEL
  };
}

export async function suggestCategory(merchant: string, description?: string) {
  if (!client) {
    return { category: "Other" as ExpenseCategory, source: "fallback" as const };
  }

  const response = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Classify the expense into exactly one category from this list: " +
          EXPENSE_CATEGORIES.join(", ")
      },
      {
        role: "user",
        content: `Merchant: ${merchant}\nDescription: ${description ?? "n/a"}`
      }
    ],
    temperature: 0
  });

  const text = response.choices[0]?.message?.content?.trim() ?? "";
  const category: ExpenseCategory = EXPENSE_CATEGORIES.find((item) => item === text) ?? "Other";
  return { category, source: "ai" as const };
}

type MonthlyMetrics = {
  month: string;
  totalSpend: number;
  previousMonthSpend: number;
  categoryTotals: Array<{ category: string; total: number }>;
  budgetComparisons: Array<{ category: string; budget: number; spent: number }>;
};

export async function generateMonthlySummary(metrics: MonthlyMetrics) {
  const fallbackSummary = {
    summary: `Total spend for ${metrics.month} was $${metrics.totalSpend.toFixed(
      2
    )}. Compared to last month, spending changed by $${(
      metrics.totalSpend - metrics.previousMonthSpend
    ).toFixed(2)}.`,
    recommendations: [
      client
        ? "AI summary generation is temporarily unavailable, so a grounded fallback summary is shown."
        : "Connect an OpenAI API key to enable richer budgeting coaching.",
      "Review the top spending category on the dashboard and reduce repeat discretionary purchases."
    ]
  };

  if (!client) {
    return fallbackSummary;
  }

  try {
    const response = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a cautious financial coach. Explain trends clearly, never invent totals, and respond in JSON with keys summary and recommendations."
        },
        {
          role: "user",
          content: JSON.stringify(metrics)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const content = response.choices[0]?.message?.content ?? "";

    return JSON.parse(content) as {
      summary: string;
      recommendations: string[];
    };
  } catch {
    return fallbackSummary;
  }
}
