<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { consumeInitialAudioPlayed, playAudio } from '$lib/audio';

  let { tempoMs = 1100, durationSeconds = 120, onComplete = () => {} } = $props();
  let side = $state<'left' | 'right'>('left');
  let elapsed = $state(0);
  let running = $state(false);
  let interval: ReturnType<typeof setInterval>;

  function start() {
    if (running) return;
    running = true;
    playAudio('tick');
    interval = setInterval(() => {
      side = side === 'left' ? 'right' : 'left';
      elapsed += tempoMs / 1000;
      playAudio('tick');
      if (elapsed >= durationSeconds) {
        clearInterval(interval);
        playAudio('fertig').then(() => onComplete());
      }
    }, tempoMs);
  }

  onMount(async () => {
    if (consumeInitialAudioPlayed('tick')) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    start();
  });

  onDestroy(() => clearInterval(interval));
  const remaining = $derived(Math.max(durationSeconds - elapsed, 0));
</script>

<div class="wrapper">
  <div class="pendulum" class:left={side === 'left'} class:right={side === 'right'}><span></span></div>
  <p class="label">Knie nach {side === 'left' ? 'links' : 'rechts'}</p>
  <p class="timer">{Math.floor(remaining / 60)}:{Math.floor(remaining % 60).toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; min-height:260px; color:#e2e8f0; }
  .pendulum { width:180px; height:130px; position:relative; border-bottom:3px solid #334155; }
  .pendulum span { position:absolute; left:50%; bottom:8px; width:34px; height:34px; border-radius:50%; background:#22d3ee; transition:transform .4s ease; }
  .pendulum.left span { transform:translateX(-58px); }
  .pendulum.right span { transform:translateX(24px); }
  .label { font-size:1.3rem; font-weight:500; }
  .timer { color:#94a3b8; }
</style>