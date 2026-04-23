export type AppSettings = {
  currency: string;
  monthlyBudgetGoal: string;
  compactMode: boolean;
  reducedMotion: boolean;
  smartGreetings: boolean;
};

const SETTINGS_KEY = "expense-coach-settings";

export const DEFAULT_SETTINGS: AppSettings = {
  currency: "USD",
  monthlyBudgetGoal: "2500",
  compactMode: false,
  reducedMotion: false,
  smartGreetings: true
};

export function readSettings(): AppSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    return DEFAULT_SETTINGS;
  }

  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function applySettingsToDocument(settings: AppSettings) {
  if (typeof document === "undefined") {
    return;
  }

  document.body.dataset.density = settings.compactMode ? "compact" : "comfortable";
  document.body.dataset.motion = settings.reducedMotion ? "reduced" : "full";
}

