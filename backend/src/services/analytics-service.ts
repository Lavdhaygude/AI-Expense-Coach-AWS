import { pool } from "../db/pool";

type SummaryMetrics = {
  month: string;
  totalSpend: number;
  previousMonthSpend: number;
  categoryTotals: Array<{ category: string; total: number }>;
  budgetComparisons: Array<{ category: string; budget: number; spent: number }>;
};

export async function getMonthlyMetrics(userId: number, month: string): Promise<SummaryMetrics> {
  const previousMonth = new Date(`${month}-01T00:00:00Z`);
  previousMonth.setUTCMonth(previousMonth.getUTCMonth() - 1);
  const previousMonthKey = previousMonth.toISOString().slice(0, 7);

  const totalResult = await pool.query(
    `
      SELECT COALESCE(SUM(amount), 0)::float AS total
      FROM expenses
      WHERE user_id = $1 AND TO_CHAR(transaction_date, 'YYYY-MM') = $2
    `,
    [userId, month]
  );

  const previousResult = await pool.query(
    `
      SELECT COALESCE(SUM(amount), 0)::float AS total
      FROM expenses
      WHERE user_id = $1 AND TO_CHAR(transaction_date, 'YYYY-MM') = $2
    `,
    [userId, previousMonthKey]
  );

  const categoryResult = await pool.query(
    `
      SELECT category, COALESCE(SUM(amount), 0)::float AS total
      FROM expenses
      WHERE user_id = $1 AND TO_CHAR(transaction_date, 'YYYY-MM') = $2
      GROUP BY category
      ORDER BY total DESC
    `,
    [userId, month]
  );

  const budgetResult = await pool.query(
    `
      SELECT b.category, b.amount::float AS budget,
             COALESCE(SUM(e.amount), 0)::float AS spent
      FROM budgets b
      LEFT JOIN expenses e
        ON e.user_id = b.user_id
       AND e.category = b.category
       AND TO_CHAR(e.transaction_date, 'YYYY-MM') = b.month
      WHERE b.user_id = $1 AND b.month = $2
      GROUP BY b.category, b.amount
      ORDER BY b.category ASC
    `,
    [userId, month]
  );

  return {
    month,
    totalSpend: totalResult.rows[0]?.total ?? 0,
    previousMonthSpend: previousResult.rows[0]?.total ?? 0,
    categoryTotals: categoryResult.rows,
    budgetComparisons: budgetResult.rows
  };
}

