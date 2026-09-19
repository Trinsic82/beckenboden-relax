let unlocked = false;

export function unlockSpeech() {
  if (unlocked || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance('');
  u.volume = 0;
  window.speechSynthesis.speak(u);
  unlocked = true;
}

export function cancelSpeech() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}

export function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  cancelSpeech();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}