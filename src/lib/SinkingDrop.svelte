<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import { playAudio, stopAllAudio } from '$lib/audio';
  import { cancelSpeech } from '$lib/speech';
  import { locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';

  let { contract = 3, hold = 3, exhale = 13, durationSeconds = 90, preparationLabel = '', onComplete = () => {} } = $props();
  const release = exhale;

  let phase = $state<'contract' | 'hold' | 'release'>('contract');
  let phaseSeconds = $state(untrack(() => contract));
  let elapsed = $state(0);
  let translateY = $state(60);
  let opacity = $state(0.3);
  let hasStarted = false;
  let running = $state(false);
  let preparing = $state(true);
  let cancelled = false;

  const phaseLabel = { contract: 'gentlyTense', hold: 'hold', release: 'releaseAndSink' } as const;
  const phaseAudioKey = { contract: 'anspannen', hold: 'halten', release: 'loslassen' };

  function nextPhase() {
    if (phase === 'contract') {
      phase = 'hold';
      phaseSeconds = hold;
    } else if (phase === 'hold') {
      phase = 'release';
      phaseSeconds = release;
    } else {
      phase = 'contract';
      phaseSeconds = contract;
    }
    playAudio(phaseAudioKey[phase]);
  }

  $effect(() => {
    if (phase === 'contract') {
      requestAnimationFrame(() => requestAnimationFrame(() => { translateY = 0; opacity = 1; }));
    } else if (phase === 'release') {
      requestAnimationFrame(() => requestAnimationFrame(() => { translateY = 60; opacity = 0.3; }));
    }
  });

  $effect(() => {
    if (!hasStarted) {
      hasStarted = true;
      setTimeout(() => {
        if (cancelled) return;
        preparing = false;
        void playAudio(phaseAudioKey[phase]);
        running = true;
      }, 1000);
    }
  });

  $effect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      elapsed += 1;
      phaseSeconds -= 1;
      if (elapsed >= durationSeconds) {
        clearInterval(tick);
        onComplete();
        return;
      }
      if (phaseSeconds <= 0) nextPhase();
    }, 1000);
    return () => clearInterval(tick);
  });

  const remaining = $derived(durationSeconds - elapsed);
  const minutes = $derived(Math.floor(remaining / 60));
  const seconds = $derived(remaining % 60);
  const transitionDuration = $derived(phase === 'contract' ? contract : phase === 'hold' ? 0.3 : release);

  onDestroy(() => {
    cancelled = true;
    stopAllAudio();
    cancelSpeech();
  });
</script>

<div class="wrapper">
  <div class="track">
    <div class="drop" style="transform: translateY({translateY}px); opacity: {opacity}; transition-duration: {transitionDuration}s;"></div>
  </div>
  <p class="label">{preparing ? preparationLabel : `${t[locale.value][phaseLabel[phase]]} …`}</p>
  <p class="timer">{minutes}:{seconds.toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; height:100%; color:#e2e8f0; }
  .track { width: 100px; height: 140px; display:flex; justify-content:center; }
  .drop { width: 70px; height: 70px; border-radius: 50% 50% 50% 0; background: radial-gradient(circle at 35% 35%, #fca5a5, #b91c1c); transform-origin: top center; transition-property: transform, opacity; transition-timing-function: ease-in-out; }
  .label { font-size:1.4rem; font-weight:500; text-align:center; max-width:280px; }
  .timer { font-size:1rem; opacity:0.7; letter-spacing:0.05em; }
</style>