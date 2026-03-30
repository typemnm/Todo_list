import { useState, useEffect } from 'react';
import { getSettings, saveSettings, type AppSettings } from '../services/api';

const STORAGE_KEY = 'stellar_settings';

export const SETTINGS_DEFAULTS: AppSettings = {
  starBrightness: 65,
  glowIntensity: 42,
  connectionLines: true,
  nebulaEffects: true,
  animationSpeed: 42,
};

function readLocalSettings(): AppSettings | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...SETTINGS_DEFAULTS, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return null;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(
    readLocalSettings() ?? SETTINGS_DEFAULTS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then((apiSettings) => {
        setSettings(apiSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiSettings));
      })
      .catch(() => { /* use localStorage fallback */ })
      .finally(() => setIsLoading(false));
  }, []);

  const applySettings = async (next: AppSettings) => {
    setSaveError('');
    setIsSaving(true);
    try {
      await saveSettings(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSettings(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return { settings, isLoading, isSaving, saved, saveError, applySettings };
}
