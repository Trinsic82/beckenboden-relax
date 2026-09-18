const cache: Record<string, HTMLAudioElement> = {};

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

export function playAudio(key: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    let audio = cache[key];
    if (!audio) {
      audio = new Audio(`/audio/${key}.mp3`);
      cache[key] = audio;
    }
    audio.currentTime = 0;

    const onEnded = () => {
      audio.removeEventListener('ended', onEnded);
      resolve();
    };
    audio.addEventListener('ended', onEnded);

    audio.play().catch(() => {
      audio.removeEventListener('ended', onEnded);
      resolve();
    });
  });
}

export function unlockAudio() {
  if (typeof window === 'undefined') return;
  for (const key of ALL_KEYS) {
    const dummy = new Audio(`/audio/${key}.mp3`);
    dummy.volume = 0;
    dummy
      .play()
      .then(() => {
        dummy.pause();
      })
      .catch(() => {});
  }
}