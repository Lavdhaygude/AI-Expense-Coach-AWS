"use client";

import { useEffect, useState } from "react";
import { readSettings } from "@/lib/settings-store";
import { readStoredUser } from "@/lib/user-session";

export function WelcomeBanner() {
  const [name, setName] = useState<string>("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const user = readStoredUser();
    setName(user?.fullName ?? "");
    setEnabled(readSettings().smartGreetings);
  }, []);

  if (!name || !enabled) {
    return null;
  }

  return (
    <div className="metric-card" style={{ padding: 18 }}>
      <strong>Welcome, {name}.</strong>
      <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
        Your account is signed in. Add expenses, create budgets, or import a statement to
        watch the dashboard update from your own data.
      </p>
    </div>
  );
}
