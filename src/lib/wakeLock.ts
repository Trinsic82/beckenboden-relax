import NoSleep from 'nosleep.js';

let noSleep: NoSleep | null = null;

export function setupWakeLock(): () => void {
  let sentinel: any = null;
  let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

  async function requestNative() {
    try {
      if (!('wakeLock' in navigator)) return false;
      if (sentinel && !sentinel.released) return true;
      sentinel = await (navigator as any).wakeLock.request('screen');
      return true;
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
      void enable();
    }
  }

  void enable();
  document.addEventListener('visibilitychange', handleVisibility);
  keepAliveTimer = setInterval(() => {
    if (document.visibilityState === 'visible') {
      void enable();
    }
  }, 30000);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
    if (sentinel) {
      sentinel.release();
      sentinel = null;
    }
    if (noSleep) {
      noSleep.disable();
    }
  };
}