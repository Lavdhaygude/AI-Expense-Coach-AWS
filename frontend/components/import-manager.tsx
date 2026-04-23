"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export function ImportManager() {
  const router = useRouter();
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("statement.csv");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setCsvText(await file.text());
    setMessage(`Loaded ${file.name}. Ready to import.`);
  }

  async function handleImport() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/imports/csv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          filename: fileName,
          csv: csvText
        })
      });

      const data = (await response.json().catch(() => ({}))) as {
        item?: { importedCount: number; warning?: string | null };
        message?: string;
      };

      if (!response.ok || !data.item) {
        throw new Error(data.message ?? "Import failed");
      }

      setMessage(
        data.item.warning
          ? `Imported ${data.item.importedCount} expenses from ${fileName}. ${data.item.warning}`
          : `Imported ${data.item.importedCount} expenses from ${fileName}.`
      );
      window.setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <div className="section-header">
        <h2>Import CSV statements</h2>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="statement">Statement CSV</label>
          <input id="statement" onChange={handleFileChange} type="file" accept=".csv" />
        </div>
        <div className="cta-row">
          <button
            className="button"
            disabled={loading || csvText.length === 0}
            onClick={handleImport}
            type="button"
          >
            {loading ? "Importing..." : "Upload file"}
          </button>
        </div>
        <div className="metric-card">
          AI categorization only steps in when the rules engine cannot confidently map a
          merchant. Amounts and dates remain unchanged from the imported source data.
        </div>
        {message ? <div className="metric-card">{message}</div> : null}
      </div>
    </section>
  );
}
