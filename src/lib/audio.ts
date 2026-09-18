const cache: Record<string, HTMLAudioElement> = {};

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
  const a = new Audio('/audio/einatmen.mp3');
  a.volume = 0;
  a.play()
    .then(() => {
      a.pause();
      a.currentTime = 0;
    })
    .catch(() => {});
}