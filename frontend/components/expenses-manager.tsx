"use client";

import { FormEvent, useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

type Expense = {
  id: number;
  amount: number | string;
  currency: string;
  transactionDate: string;
  merchant: string;
  description?: string;
  category: string;
  source: string;
};

export function ExpensesManager() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadExpenses() {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? "Please sign in first" : "Failed to load expenses");
      }

      const data = (await response.json()) as { items: Expense[] };
      setExpenses(data.items);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadExpenses();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      merchant: String(formData.get("merchant") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      currency: String(formData.get("currency") ?? "USD"),
      transactionDate: String(formData.get("transactionDate") ?? ""),
      category: String(formData.get("category") ?? ""),
      description: String(formData.get("description") ?? "")
    };

    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => ({}))) as {
        item?: Expense;
        message?: string;
      };

      if (!response.ok || !data.item) {
        throw new Error(data.message ?? "Unable to add expense");
      }

      setExpenses((current) => [data.item!, ...current]);
      form.reset();
      setMessage("Expense added successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to add expense");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <div className="section-header">
        <h2>Expenses</h2>
      </div>
      <p className="subtitle">
        Add real expenses below. Imported and manual transactions will both appear in the
        table after sign-in.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="dashboard-grid">
          <div className="field">
            <label htmlFor="merchant">Merchant</label>
            <input id="merchant" name="merchant" placeholder="Fresh Basket" required />
          </div>
          <div className="field">
            <label htmlFor="amount">Amount</label>
            <input id="amount" name="amount" min="0.01" step="0.01" type="number" required />
          </div>
          <div className="field">
            <label htmlFor="transactionDate">Date</label>
            <input id="transactionDate" name="transactionDate" type="date" required />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue="">
              <option value="">Auto-detect</option>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="field">
            <label htmlFor="currency">Currency</label>
            <input defaultValue="USD" id="currency" name="currency" />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" placeholder="Weekly groceries" rows={3} />
          </div>
        </div>
        <div className="cta-row">
          <button className="button" disabled={saving} type="submit">
            {saving ? "Saving..." : "Add expense"}
          </button>
        </div>
      </form>

      {message ? (
        <div className="metric-card" style={{ marginTop: 16 }}>
          {message}
        </div>
      ) : null}

      <div style={{ marginTop: 24 }}>
        {loading ? (
          <div className="metric-card">Loading expenses...</div>
        ) : (
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
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5}>No expenses yet. Add one above.</td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.merchant}</td>
                    <td>{expense.category}</td>
                    <td>
                      {expense.currency} {Number(expense.amount).toFixed(2)}
                    </td>
                    <td>{expense.source}</td>
                    <td>{String(expense.transactionDate).slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
