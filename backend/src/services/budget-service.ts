import { pool } from "../db/pool";

export async function listBudgets(userId: number) {
  const result = await pool.query(
    `
      SELECT id, category, month, amount, created_at AS "createdAt"
      FROM budgets
      WHERE user_id = $1
      ORDER BY month DESC, category ASC
    `,
    [userId]
  );

  return result.rows;
}

export async function upsertBudget(
  userId: number,
  category: string,
  month: string,
  amount: number
) {
  const result = await pool.query(
    `
      INSERT INTO budgets (user_id, category, month, amount)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, category, month)
      DO UPDATE SET amount = EXCLUDED.amount
      RETURNING id, category, month, amount, created_at AS "createdAt"
    `,
    [userId, category, month, amount]
  );

  return result.rows[0];
}

