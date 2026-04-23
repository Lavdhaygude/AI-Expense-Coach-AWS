import { pool } from "../db/pool";
import { classifyExpense } from "../utils/categories";

export type ExpenseInput = {
  userId: number;
  amount: number;
  currency: string;
  transactionDate: string;
  merchant: string;
  description?: string;
  category?: string;
  source: "manual" | "import";
};

export async function listExpenses(userId: number) {
  const result = await pool.query(
    `
      SELECT id, amount, currency, transaction_date AS "transactionDate", merchant,
             description, category, source, created_at AS "createdAt"
      FROM expenses
      WHERE user_id = $1
      ORDER BY transaction_date DESC, id DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function createExpense(input: ExpenseInput) {
  const resolvedCategory =
    input.category && input.category.trim().length > 0
      ? input.category
      : classifyExpense(input.merchant, input.description).category;

  const result = await pool.query(
    `
      INSERT INTO expenses (
        user_id, amount, currency, transaction_date, merchant, description, category, source
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, amount, currency, transaction_date AS "transactionDate",
                merchant, description, category, source, created_at AS "createdAt"
    `,
    [
      input.userId,
      input.amount,
      input.currency,
      input.transactionDate,
      input.merchant,
      input.description ?? null,
      resolvedCategory,
      input.source
    ]
  );

  return result.rows[0];
}

export async function updateExpense(
  userId: number,
  expenseId: number,
  input: Omit<ExpenseInput, "userId" | "source">
) {
  const result = await pool.query(
    `
      UPDATE expenses
      SET amount = $3,
          currency = $4,
          transaction_date = $5,
          merchant = $6,
          description = $7,
          category = $8
      WHERE id = $1 AND user_id = $2
      RETURNING id, amount, currency, transaction_date AS "transactionDate",
                merchant, description, category, source, created_at AS "createdAt"
    `,
    [
      expenseId,
      userId,
      input.amount,
      input.currency,
      input.transactionDate,
      input.merchant,
      input.description ?? null,
      input.category
    ]
  );

  return result.rows[0] ?? null;
}

export async function deleteExpense(userId: number, expenseId: number) {
  const result = await pool.query(`DELETE FROM expenses WHERE id = $1 AND user_id = $2`, [
    expenseId,
    userId
  ]);

  return (result.rowCount ?? 0) > 0;
}
