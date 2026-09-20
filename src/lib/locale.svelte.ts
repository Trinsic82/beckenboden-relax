import { browser } from '$app/environment';

export type Locale = 'de' | 'en';
const SKIP_INTROS_KEY = 'beckenboden-skip-intros';

function getInitialLocale(): Locale {
  if (!browser) return 'de';
  const stored = localStorage.getItem('beckenboden-locale');
  if (stored === 'de' || stored === 'en') return stored;
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export const locale = $state<{ value: Locale }>({ value: getInitialLocale() });
export const skipIntros = $state({ value: browser && localStorage.getItem(SKIP_INTROS_KEY) === 'true' });

export function changeLocale(newLocale: Locale) {
  locale.value = newLocale;
  if (browser) localStorage.setItem('beckenboden-locale', newLocale);
}

export function changeSkipIntros(enabled: boolean) {
  skipIntros.value = enabled;
  if (browser) localStorage.setItem(SKIP_INTROS_KEY, String(enabled));
}
