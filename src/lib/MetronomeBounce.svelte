<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { consumeInitialAudioPlayed, playAudio, stopAllAudio } from '$lib/audio';
  import { cancelSpeech } from '$lib/speech';
  import { locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';

  let { tempoMs = 480, durationSeconds = 75, onComplete = () => {} } = $props();
  let position = $state<'up' | 'down'>('down');
  let elapsed = $state(0);
  let running = $state(false);
  let cancelled = false;
  let interval: ReturnType<typeof setInterval>;

  function start() {
    if (running || cancelled) return;
    running = true;
    playAudio('tick');
    interval = setInterval(() => {
      if (cancelled) {
        clearInterval(interval);
        return;
      }
      position = position === 'up' ? 'down' : 'up';
      elapsed += tempoMs / 1000;
      playAudio('tick');
      if (elapsed >= durationSeconds) {
        clearInterval(interval);
        playAudio('fertig').then(() => {
          if (!cancelled) onComplete();
        });
      }
    }, tempoMs);
  }

  onMount(async () => {
    if (consumeInitialAudioPlayed('tick')) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    start();
  });

  onDestroy(() => {
    cancelled = true;
    clearInterval(interval);
    stopAllAudio();
    cancelSpeech();
  });
  const remaining = $derived(Math.max(durationSeconds - elapsed, 0));
</script>

<div class="wrapper">
  <div class="bounce" class:up={position === 'up'}><span></span></div>
  <p class="label">{position === 'up' ? t[locale.value].pelvisUp : t[locale.value].pelvisDown}</p>
  <p class="timer">{Math.floor(remaining / 60)}:{Math.floor(remaining % 60).toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; min-height:260px; color:#e2e8f0; }
  .bounce { width:180px; height:150px; display:flex; align-items:flex-end; justify-content:center; border-bottom:3px solid #334155; }
  .bounce span { width:78px; height:48px; border-radius:50% 50% 40% 40%; background:linear-gradient(#fbbf24,#b45309); transition:transform .25s ease; }
  .bounce.up span { transform:translateY(-72px); }
  .label { font-size:1.3rem; font-weight:500; }
  .timer { color:#94a3b8; }
</style>