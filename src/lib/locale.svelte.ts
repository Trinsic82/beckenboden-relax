import { browser } from '$app/environment';

export type Locale = 'de' | 'en';

function getInitialLocale(): Locale {
  if (!browser) return 'de';
  const stored = localStorage.getItem('beckenboden-locale');
  if (stored === 'de' || stored === 'en') return stored;
  return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export const locale = $state<{ value: Locale }>({ value: getInitialLocale() });

export function changeLocale(newLocale: Locale) {
  locale.value = newLocale;
  if (browser) localStorage.setItem('beckenboden-locale', newLocale);
}
