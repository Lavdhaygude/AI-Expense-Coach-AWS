"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  AppSettings,
  DEFAULT_SETTINGS,
  applySettingsToDocument,
  readSettings,
  saveSettings
} from "@/lib/settings-store";

function Toggle({
  checked,
  onChange
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button className="switch" data-on={checked} onClick={onChange} type="button">
      <span className="switch-thumb" />
    </button>
  );
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = readSettings();
    setSettings(loaded);
    applySettingsToDocument(loaded);
  }, []);

  useEffect(() => {
    if (!saved) {
      return;
    }

    const timeout = window.setTimeout(() => setSaved(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  function updateSettings(next: AppSettings) {
    setSettings(next);
    saveSettings(next);
    applySettingsToDocument(next);
    setSaved(true);
  }

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    updateSettings({ ...settings, [name]: value });
  }

  return (
    <section className="panel">
      <div className="section-header">
        <h2>Settings</h2>
        <span className="status-pill">Preferences saved locally</span>
      </div>

      <div className="settings-grid">
        <div className="metric-card">
          <div className="field">
            <label htmlFor="currency">Preferred currency</label>
            <select id="currency" name="currency" onChange={updateField} value={settings.currency}>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div className="metric-card">
          <div className="field">
            <label htmlFor="monthlyBudgetGoal">Monthly budget goal</label>
            <input
              id="monthlyBudgetGoal"
              name="monthlyBudgetGoal"
              onChange={updateField}
              type="number"
              value={settings.monthlyBudgetGoal}
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="toggle-row">
            <div>
              <strong>Compact mode</strong>
              <p style={{ marginBottom: 0, color: "var(--muted)" }}>
                Tighten cards and spacing for a denser dashboard.
              </p>
            </div>
            <Toggle
              checked={settings.compactMode}
              onChange={() => updateSettings({ ...settings, compactMode: !settings.compactMode })}
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="toggle-row">
            <div>
              <strong>Reduced motion</strong>
              <p style={{ marginBottom: 0, color: "var(--muted)" }}>
                Minimize movement and animation transitions.
              </p>
            </div>
            <Toggle
              checked={settings.reducedMotion}
              onChange={() =>
                updateSettings({ ...settings, reducedMotion: !settings.reducedMotion })
              }
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="toggle-row">
            <div>
              <strong>Smart greetings</strong>
              <p style={{ marginBottom: 0, color: "var(--muted)" }}>
                Show contextual welcome prompts across the app.
              </p>
            </div>
            <Toggle
              checked={settings.smartGreetings}
              onChange={() =>
                updateSettings({ ...settings, smartGreetings: !settings.smartGreetings })
              }
            />
          </div>
        </div>
      </div>

      {saved ? <div className="toast">Settings updated.</div> : null}
    </section>
  );
}
