import { parse } from "csv-parse/sync";
import { pool } from "../db/pool";
import { createExpense } from "./expense-service";
import { classifyExpense } from "../utils/categories";
import { suggestCategory } from "./ai-service";

type CsvRow = {
  date: string;
  merchant: string;
  amount: string;
  description?: string;
  currency?: string;
};

export async function importCsv(userId: number, filename: string, csvText: string) {
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CsvRow[];

  let importedCount = 0;
  let usedFallbackBecauseOfAiError = false;

  for (const row of rows) {
    const ruleBased = classifyExpense(row.merchant, row.description);
    let resolvedCategory = ruleBased.category;

    if (ruleBased.confidence !== "rule") {
      try {
        resolvedCategory = (await suggestCategory(row.merchant, row.description)).category;
      } catch {
        usedFallbackBecauseOfAiError = true;
        resolvedCategory = ruleBased.category;
      }
    }

    await createExpense({
      userId,
      amount: Number(row.amount),
      currency: row.currency ?? "USD",
      transactionDate: row.date,
      merchant: row.merchant,
      description: row.description,
      category: resolvedCategory,
      source: "import"
    });
    importedCount += 1;
  }

  const result = await pool.query(
    `
      INSERT INTO expense_imports (user_id, filename, imported_count)
      VALUES ($1, $2, $3)
      RETURNING id, filename, imported_count AS "importedCount", created_at AS "createdAt"
    `,
    [userId, filename, importedCount]
  );

  return {
    ...result.rows[0],
    warning: usedFallbackBecauseOfAiError
      ? "Some AI categorization requests failed, so fallback categorization was used."
      : null
  };
}
