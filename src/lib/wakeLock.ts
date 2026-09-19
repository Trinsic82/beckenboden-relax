import NoSleep from 'nosleep.js';

let noSleep: NoSleep | null = null;

export function setupWakeLock(): () => void {
  let sentinel: any = null;
  let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
  let isEnabled = false;

  async function requestNative() {
    try {
      if (!('wakeLock' in navigator) || typeof (navigator as any).wakeLock?.request !== 'function') {
        return false;
      }
      if (sentinel && !sentinel.released) return true;
      sentinel = await (navigator as any).wakeLock.request('screen');
      sentinel.addEventListener?.('release', () => {
        sentinel = null;
        if (document.visibilityState === 'visible') {
          void enable();
        }
      });
      return true;
    } catch (err) {
      console.warn('Native Wake Lock fehlgeschlagen:', err);
      sentinel = null;
      return false;
    }
  }

  async function enable() {
    if (isEnabled) return;
    isEnabled = true;

    const ok = await requestNative();
    if (!ok) {
      if (!noSleep) noSleep = new NoSleep();
      noSleep.enable();
    }
  }

  function disable() {
    isEnabled = false;
    if (sentinel) {
      sentinel.release().catch(() => {});
      sentinel = null;
    }
    if (noSleep) {
      noSleep.disable();
    }
  }

  function handleVisibility() {
    if (document.visibilityState === 'visible') {
      void enable();
    }
  }

  function handleInteraction() {
    if (document.visibilityState === 'visible') {
      void enable();
    }
  }

  void enable();
  document.addEventListener('visibilitychange', handleVisibility);
  document.addEventListener('touchstart', handleInteraction, { passive: true });
  document.addEventListener('pointerdown', handleInteraction, { passive: true });
  document.addEventListener('click', handleInteraction, { passive: true });
  keepAliveTimer = setInterval(() => {
    if (document.visibilityState === 'visible') {
      void enable();
    }
  }, 15000);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    document.removeEventListener('touchstart', handleInteraction);
    document.removeEventListener('pointerdown', handleInteraction);
    document.removeEventListener('click', handleInteraction);
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
    disable();
  };
}