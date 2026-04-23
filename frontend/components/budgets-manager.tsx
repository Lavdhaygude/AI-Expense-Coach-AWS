"use client";

import { FormEvent, useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

type Budget = {
  id: number;
  category: string;
  month: string;
  amount: number | string;
};

export function BudgetsManager() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadBudgets() {
    try {
      const response = await fetch(`${API_URL}/budgets`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? "Please sign in first" : "Failed to load budgets");
      }

      const data = (await response.json()) as { items: Budget[] };
      setBudgets(data.items);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBudgets();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      category: String(formData.get("category") ?? ""),
      month: String(formData.get("month") ?? ""),
      amount: Number(formData.get("amount") ?? 0)
    };

    try {
      const response = await fetch(`${API_URL}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => ({}))) as {
        item?: Budget;
        message?: string;
      };

      if (!response.ok || !data.item) {
        throw new Error(data.message ?? "Unable to save budget");
      }

      setBudgets((current) => {
        const withoutDuplicate = current.filter(
          (budget) => !(budget.category === data.item!.category && budget.month === data.item!.month)
        );
        return [data.item!, ...withoutDuplicate];
      });
      form.reset();
      setMessage("Budget saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save budget");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <div className="section-header">
        <h2>Monthly budgets</h2>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="dashboard-grid">
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue="" required>
              <option disabled value="">
                Select category
              </option>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="month">Month</label>
            <input id="month" name="month" type="month" required />
          </div>
          <div className="field">
            <label htmlFor="amount">Budget amount</label>
            <input id="amount" name="amount" min="0.01" step="0.01" type="number" required />
          </div>
        </div>
        <div className="cta-row">
          <button className="button" disabled={saving} type="submit">
            {saving ? "Saving..." : "Create budget"}
          </button>
        </div>
      </form>

      {message ? (
        <div className="metric-card" style={{ marginTop: 16 }}>
          {message}
        </div>
      ) : null}

      <div className="form-grid" style={{ marginTop: 24 }}>
        {loading ? (
          <div className="metric-card">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <div className="metric-card">No budgets yet. Create one above.</div>
        ) : (
          budgets.map((budget) => (
            <div key={`${budget.category}-${budget.month}`} className="metric-card">
              <h3 style={{ marginTop: 0 }}>{budget.category}</h3>
              <p>Month: {budget.month}</p>
              <p>Target: USD {Number(budget.amount).toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
