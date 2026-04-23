"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import { aiInsights } from "@/lib/demo-data";

export function InsightsPanel() {
  const [summary, setSummary] = useState<string[]>(aiInsights);
  const [loading, setLoading] = useState(false);

  async function refreshSummary() {
    setLoading(true);

    try {
      const month = new Date().toISOString().slice(0, 7);
      const response = await fetch(`${API_URL}/ai/monthly-summary?month=${month}`, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Unable to refresh AI summary");
      }

      const data = (await response.json()) as {
        insight: { summary: string; recommendations: string[] };
      };

      setSummary([data.insight.summary, ...data.insight.recommendations]);
    } catch {
      setSummary(aiInsights);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-grid">
      <div className="section-header">
        <h2>AI insights</h2>
        <button className="button" onClick={refreshSummary} type="button">
          {loading ? "Refreshing..." : "Refresh summary"}
        </button>
      </div>
      {summary.map((insight) => (
        <div key={insight} className="metric-card">
          {insight}
        </div>
      ))}
    </div>
  );
}

