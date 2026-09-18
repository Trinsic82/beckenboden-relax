const cache: Record<string, HTMLAudioElement> = {};
let player: HTMLAudioElement | undefined;
let stopActivePlayback: (() => void) | undefined;
const INITIAL_AUDIO_STORAGE_KEY = 'beckenboden-relax-initial-audio';

const ALL_KEYS = [
  'einatmen',
  'ausatmen',
  'halten',
  'anspannen',
  'loslassen',
  'intro-zwerchfellatmung',
  'intro-wellen-loslassen',
  'intro-reverse-kegel',
  'intro-anspannen-loslassen',
  'intro-4-7-8-atmung'
];

function getAudio(key: string): HTMLAudioElement {
  let audio = cache[key];
  if (!audio) {
    audio = new Audio(`/audio/${key}.mp3`);
    audio.preload = 'auto';
    cache[key] = audio;
  }
  return audio;
}

function getPlayer(): HTMLAudioElement {
  if (!player) {
    player = new Audio();
    player.preload = 'auto';
  }
  return player;
}

export function preloadAll() {
  if (typeof window === 'undefined') return;
  for (const key of ALL_KEYS) {
    getAudio(key).load();
  }
}

export function playAudio(key: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    stopActivePlayback?.();
    const audio = getPlayer();
    audio.pause();
    audio.currentTime = 0;
    audio.src = `/audio/${key}.mp3`;
    audio.volume = 1;

    const onEnded = () => {
      finish();
    };
    const onError = () => {
      finish();
    };
    const finish = () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      if (stopActivePlayback === finish) stopActivePlayback = undefined;
      resolve();
    };
    stopActivePlayback = finish;
    audio.addEventListener('ended', onEnded, { once: true });
    audio.addEventListener('error', onError, { once: true });

    audio.load();
    audio.play().catch(finish);
  });
}

export function markInitialAudioPlayed(key: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(INITIAL_AUDIO_STORAGE_KEY, key);
  }
}

export function consumeInitialAudioPlayed(key: string): boolean {
  if (typeof window === 'undefined') return false;
  if (sessionStorage.getItem(INITIAL_AUDIO_STORAGE_KEY) !== key) return false;

  sessionStorage.removeItem(INITIAL_AUDIO_STORAGE_KEY);
  return true;
}

export function unlockAudio() {
  if (typeof window === 'undefined') return;
  const a = getPlayer();
  const source = '/audio/einatmen.mp3';
  a.src = source;
  a.volume = 0;
  a.load();
  a.play()
    .then(() => {
      if (!a.src.endsWith(source)) return;
      a.pause();
      a.currentTime = 0;
      a.volume = 1;
    })
    .catch(() => {
      if (a.src.endsWith(source)) a.volume = 1;
    });
}