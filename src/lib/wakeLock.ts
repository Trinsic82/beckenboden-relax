import NoSleep from 'nosleep.js';

let noSleep: NoSleep | null = null;

export function setupWakeLock(): () => void {
  let sentinel: any = null;

  async function requestNative() {
    try {
      if ('wakeLock' in navigator) {
        sentinel = await (navigator as any).wakeLock.request('screen');
        return true;
      }
    } catch (err) {
      console.warn('Native Wake Lock fehlgeschlagen:', err);
    }
    return false;
  }

  async function enable() {
    const ok = await requestNative();
    if (!ok) {
      if (!noSleep) noSleep = new NoSleep();
      noSleep.enable();
    }
  }

  function handleVisibility() {
    if (document.visibilityState === 'visible') {
      enable();
    }
  }

  enable();
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    if (sentinel) {
      sentinel.release();
      sentinel = null;
    }
    if (noSleep) {
      noSleep.disable();
    }
  };
}