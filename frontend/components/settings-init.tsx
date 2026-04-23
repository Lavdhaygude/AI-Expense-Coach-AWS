"use client";

import { useEffect } from "react";
import { applySettingsToDocument, readSettings } from "@/lib/settings-store";

export function SettingsInit() {
  useEffect(() => {
    applySettingsToDocument(readSettings());
  }, []);

  return null;
}

