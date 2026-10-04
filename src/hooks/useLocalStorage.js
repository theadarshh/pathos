import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pathos:profile:v1';

// A plain-object profile is all that's persisted — no PII beyond what the
// user typed into onboarding, and nothing sensitive.
export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage can fail (private browsing, quota) — fail silently,
    // the app still works, it just won't persist across reloads.
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

export function usePersistentState(initialValue) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    saveProfile(value);
  }, [value]);
  const update = useCallback((updater) => setValue(updater), []);
  return [value, update];
}
