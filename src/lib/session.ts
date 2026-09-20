import { exercises } from './exercises';
import { skipIntros } from './locale.svelte';

export const totalSessionSeconds = exercises.reduce((sum, e) => sum + e.durationSeconds, 0);

const STORAGE_KEY = 'beckenboden-session-start';
const PLAN_KEY = 'beckenboden-session-plan';

export function setSelectedExerciseIndices(indices: number[]) {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(PLAN_KEY, JSON.stringify(indices));
  getSessionStart(true);
}

export function getSelectedExerciseIndices(): number[] {
  if (typeof sessionStorage === 'undefined') return exercises.map((_, index) => index);

  try {
    const stored = sessionStorage.getItem(PLAN_KEY);
    if (!stored) return exercises.map((_, index) => index);
    const indices = JSON.parse(stored);
    if (!Array.isArray(indices) || indices.length === 0) return exercises.map((_, index) => index);
    return indices.filter((index): index is number => Number.isInteger(index) && index >= 0 && index < exercises.length);
  } catch {
    return exercises.map((_, index) => index);
  }
}

export function getNextExerciseHref(currentIndex: number): string {
  const plan = getSelectedExerciseIndices();
  const nextIndex = plan[plan.indexOf(currentIndex) + 1];
  if (nextIndex === undefined) return '/abschluss';
  return skipIntros.value ? `/uebung-${nextIndex + 1}` : `/uebung-${nextIndex + 1}-intro`;
}

export function getTotalSessionSeconds(): number {
  return getSelectedExerciseIndices().reduce((sum, index) => sum + exercises[index].durationSeconds, 0);
}

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