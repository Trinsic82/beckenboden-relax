<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { markInitialAudioPlayed, playAudio, stopAllAudio } from '$lib/audio';
  import { cancelSpeech } from '$lib/speech';

  let { title, description, introKey, firstAudioKey, nextHref } = $props();
  let started = $state(false);
  let cancelled = false;
  let autoStartTimeout: ReturnType<typeof setTimeout> | undefined;

  onMount(() => {
    playAudio(`intro-${introKey}`).then(() => {
      if (started || cancelled) return;
      autoStartTimeout = setTimeout(() => {
        if (!cancelled) startExercise();
      }, 1000);
    });
  });

  onDestroy(() => {
    cancelled = true;
    if (autoStartTimeout) clearTimeout(autoStartTimeout);
    stopAllAudio();
    cancelSpeech();
  });

  function startExercise() {
    if (started) return;
    started = true;
    if (autoStartTimeout) {
      clearTimeout(autoStartTimeout);
      autoStartTimeout = undefined;
    }
    markInitialAudioPlayed(firstAudioKey);
    void playAudio(firstAudioKey);
    void goto(nextHref);
  }
</script>

<div class="page">
  <h1>{title.replace(/^Übung \d+: /, '')}</h1>
  <p class="desc">{description}</p>
  <div class="pulse"></div>
  <button type="button" onclick={startExercise}>Übung starten</button>
</div>

<style>
  .page { min-height: 100vh; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 2rem 1rem; font-family: system-ui, sans-serif; }
  h1 { color: #f8fafc; font-size: 1.5rem; margin-bottom: 0.5rem; text-align: center; }
  .desc { color: #94a3b8; max-width: 320px; text-align: center; margin-bottom: 2rem; }
  .pulse { width: 60px; height: 60px; border-radius: 50%; background: #1e3a8a; animation: pulse 1.6s ease-in-out infinite; }
  button { margin-top: 2rem; border: 0; border-radius: 8px; background: #1e3a8a; color: #f8fafc; padding: 0.9rem 2rem; font: inherit; font-weight: 600; cursor: pointer; }
  @keyframes pulse { 0%,100% { transform: scale(0.8); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 1; } }
</style>