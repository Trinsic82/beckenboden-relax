<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { markInitialAudioPlayed, playAudio, stopAllAudio } from '$lib/audio';
  import { cancelSpeech } from '$lib/speech';
  import { locale, skipIntros } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';

  let { title, description, introKey, firstAudioKey, nextHref } = $props();
  const introImageSrc = `/image/intro-${introKey}.png`;
  let started = $state(false);
  let cancelled = false;
  let autoStartTimeout: ReturnType<typeof setTimeout> | undefined;

  onMount(() => {
    if (skipIntros.value) {
      void goto(nextHref);
      return;
    }
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
  <h1>{title.replace(/^Übung \d+: |^Exercise \d+: /, '')}</h1>
  <p class="desc">{description}</p>
  <img class="intro-image" src={introImageSrc} alt={title} />
  <button type="button" onclick={startExercise}>{t[locale.value].startExercise}</button>
</div>

<style>
  .page { min-height: 100vh; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 2rem 1rem; font-family: system-ui, sans-serif; }
  h1 { color: #f8fafc; font-size: 1.5rem; margin-bottom: 0.5rem; text-align: center; }
  .desc { color: #94a3b8; max-width: 320px; text-align: center; margin-bottom: 1.5rem; }
  .intro-image { width: min(70vw, 260px); max-height: 220px; object-fit: contain; border-radius: 18px; background: rgba(15, 23, 42, 0.5); box-shadow: 0 18px 40px rgba(15, 23, 42, 0.45); }
  button { margin-top: 2rem; border: 0; border-radius: 8px; background: #1e3a8a; color: #f8fafc; padding: 0.9rem 2rem; font: inherit; font-weight: 600; cursor: pointer; }
</style>