const cache: Record<string, HTMLAudioElement> = {};
let activeAudio: HTMLAudioElement | undefined;

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

export function preloadAll() {
  if (typeof window === 'undefined') return;
  for (const key of ALL_KEYS) {
    getAudio(key).load();
  }
}

export function playAudio(key: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    const audio = getAudio(key);
    if (activeAudio && activeAudio !== audio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }
    activeAudio = audio;
    audio.pause();
    audio.currentTime = 0;

    const onEnded = () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      if (activeAudio === audio) activeAudio = undefined;
      resolve();
    };
    const onError = () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      if (activeAudio === audio) activeAudio = undefined;
      resolve();
    };
    audio.addEventListener('ended', onEnded, { once: true });
    audio.addEventListener('error', onError, { once: true });

    audio.play().catch(() => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      if (activeAudio === audio) activeAudio = undefined;
      resolve();
    });
  });
}

export function unlockAudio() {
  if (typeof window === 'undefined') return;
  const a = getAudio('einatmen');
  a.volume = 0;
  a.play()
    .then(() => {
      a.pause();
      a.currentTime = 0;
      a.volume = 1;
    })
    .catch(() => {
      a.volume = 1;
    });
}