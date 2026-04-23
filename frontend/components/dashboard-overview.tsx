"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/api";
import { readSettings } from "@/lib/settings-store";
import { MetricCard } from "@/components/metric-card";

type Expense = {
  id: number;
  amount: number | string;
  currency: string;
  transactionDate: string;
  merchant: string;
  category: string;
  source: string;
};

type Budget = {
  id: number;
  category: string;
  month: string;
  amount: number | string;
};

type SummaryPayload = {
  enabled?: boolean;
  model?: string;
  metrics: {
    month: string;
    totalSpend: number;
    previousMonthSpend: number;
    categoryTotals: Array<{ category: string; total: number }>;
    budgetComparisons: Array<{ category: string; budget: number; spent: number }>;
  };
  insight: {
    summary: string;
    recommendations: string[];
  };
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}

export function DashboardOverview() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<SummaryPayload | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const settings = useMemo(() => readSettings(), []);
  const month = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    async function load() {
      try {
        const [expensesResponse, budgetsResponse] = await Promise.all([
          fetch(`${API_URL}/expenses`, { credentials: "include" }),
          fetch(`${API_URL}/budgets`, { credentials: "include" })
        ]);

        if (!expensesResponse.ok || !budgetsResponse.ok) {
          throw new Error("Please sign in to see your live dashboard.");
        }

        const expensesData = (await expensesResponse.json()) as { items: Expense[] };
        const budgetsData = (await budgetsResponse.json()) as { items: Budget[] };

        setExpenses(expensesData.items);
        setBudgets(budgetsData.items);

        const summaryResponse = await fetch(`${API_URL}/ai/monthly-summary?month=${month}`, {
          credentials: "include"
        });

        if (summaryResponse.ok) {
          const summaryData = (await summaryResponse.json()) as SummaryPayload;
          setSummary(summaryData);
        } else {
          setSummary(null);
          setMessage("Imported data is available, but AI summary could not be refreshed right now.");
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [month]);

  const currency = settings.currency || expenses[0]?.currency || "USD";
  const currentMonthExpenses = expenses.filter((expense) =>
    String(expense.transactionDate).startsWith(month)
  );
  const topRecent = currentMonthExpenses.slice(0, 5);
  const recurringEstimate = expenses
    .filter((expense) => expense.category === "Subscriptions")
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
  const budgetGoal = Number(settings.monthlyBudgetGoal || 0);
  const totalSpend = summary?.metrics.totalSpend ?? 0;
  const budgetUsedPercent =
    budgetGoal > 0 ? Math.min(999, Math.round((totalSpend / budgetGoal) * 100)) : 0;
  const changeAmount = totalSpend - (summary?.metrics.previousMonthSpend ?? 0);

  const metrics = [
    {
      label: "Total Spend",
      value: formatCurrency(totalSpend, currency),
      detail: `For ${month}`
    },
    {
      label: "Budget Used",
      value: `${budgetUsedPercent}%`,
      detail: budgetGoal > 0 ? `Against ${formatCurrency(budgetGoal, currency)}` : "Set in settings"
    },
    {
      label: "Imported Expenses",
      value: String(expenses.filter((expense) => expense.source === "import").length),
      detail: "Pulled from statements"
    },
    {
      label: "Recurring Charges",
      value: formatCurrency(recurringEstimate, currency),
      detail: "Detected from subscription category"
    }
  ];

  if (loading) {
    return <section className="panel">Loading your dashboard...</section>;
  }

  return (
    <div className="page-stack">
      {message ? <section className="panel">{message}</section> : null}

      <section className="panel">
        <div className="dashboard-grid">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="dashboard-main">
        <div className="panel">
          <div className="section-header">
            <h2>Monthly spending pulse</h2>
            <span className="status-pill">
              {changeAmount >= 0 ? "Up" : "Down"} {formatCurrency(Math.abs(changeAmount), currency)} vs last month
            </span>
          </div>
          <div className="chart-list">
            {(summary?.metrics.categoryTotals ?? []).length === 0 ? (
              <div className="metric-card">Import a statement or add expenses to populate the dashboard.</div>
            ) : (
              (summary?.metrics.categoryTotals ?? []).map((item) => {
                const width = totalSpend > 0 ? `${Math.max(10, (item.total / totalSpend) * 100)}%` : "10%";
                return (
                  <div className="bar-row" key={item.category}>
                    <div className="section-header">
                      <strong>{item.category}</strong>
                      <span>{formatCurrency(item.total, currency)}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="panel">
          <div className="section-header">
            <h2>AI spotlight</h2>
            <Link className="button secondary" href="/insights">
              Open insights
            </Link>
          </div>
          <div className="spotlight-list">
            <div className="metric-card">
              <strong>OpenAI status</strong>
              <p style={{ marginBottom: 0 }}>
                {summary?.enabled === false
                  ? "OpenAI API key not connected yet. Add OPENAI_API_KEY to backend env or docker compose."
                  : `Connected to ${summary?.model ?? "gpt-4o-mini"} for AI coaching and categorization.`}
              </p>
            </div>
            <div className="metric-card">
              <strong>Summary</strong>
              <p style={{ marginBottom: 0 }}>
                {summary?.insight.summary ?? "Generate AI insights after importing your first statement."}
              </p>
            </div>
            {(summary?.insight.recommendations ?? []).slice(0, 3).map((item) => (
              <div className="metric-card" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-main">
        <div className="panel">
          <div className="section-header">
            <h2>Recent activity</h2>
            <Link className="button secondary" href="/expenses">
              Manage expenses
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Source</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {topRecent.length === 0 ? (
                <tr>
                  <td colSpan={5}>No activity yet. Add an expense or import a CSV statement.</td>
                </tr>
              ) : (
                topRecent.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.merchant}</td>
                    <td>{expense.category}</td>
                    <td>{formatCurrency(Number(expense.amount), expense.currency || currency)}</td>
                    <td>{expense.source}</td>
                    <td>{String(expense.transactionDate).slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="section-header">
            <h2>Budget watch</h2>
            <Link className="button secondary" href="/budgets">
              Open budgets
            </Link>
          </div>
          <div className="spotlight-list">
            {budgets.length === 0 ? (
              <div className="metric-card">Create a category budget to compare planned spend with actuals.</div>
            ) : (
              (summary?.metrics.budgetComparisons ?? []).map((budget) => {
                const ratio = budget.budget > 0 ? Math.round((budget.spent / budget.budget) * 100) : 0;
                return (
                  <div className="metric-card" key={budget.category}>
                    <div className="section-header">
                      <strong>{budget.category}</strong>
                      <span>{ratio}% used</span>
                    </div>
                    <p style={{ margin: "8px 0" }}>
                      {formatCurrency(budget.spent, currency)} of {formatCurrency(budget.budget, currency)}
                    </p>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.min(100, Math.max(8, ratio))}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
