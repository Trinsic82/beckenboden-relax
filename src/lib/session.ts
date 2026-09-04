import { exercises } from './exercises';

export const totalSessionSeconds = exercises.reduce((sum, e) => sum + e.durationSeconds, 0);

const STORAGE_KEY = 'beckenboden-session-start';

export function getSessionStart(reset = false): number {
  if (typeof sessionStorage === 'undefined') return Date.now();

  if (reset) {
    const now = Date.now();
    sessionStorage.setItem(STORAGE_KEY, String(now));
    return now;
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) return Number(stored);

  const now = Date.now();
  sessionStorage.setItem(STORAGE_KEY, String(now));
  return now;
}