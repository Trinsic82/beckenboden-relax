<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { consumeInitialAudioPlayed, playAudio, stopAllAudio } from '$lib/audio';
  import { cancelSpeech, speak, unlockSpeech } from '$lib/speech';
  import { locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';

  let { onComplete = () => {} } = $props();
  let side = $state<'left' | 'right'>('left');
  let repetition = $state(1);
  let stepLabel = $state(t[locale.value].ready);
  let running = $state(false);
  let cancelled = false;

  const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

  function announce(step: string) {
    unlockSpeech();
    speak(step);
  }

  async function command(key: string, milliseconds: number) {
    if (cancelled) return;
    stepLabel = key === 'hand-linker-rippenbogen' ? t[locale.value].prepareLeft :
      key === 'hand-rechter-rippenbogen' ? t[locale.value].prepareRight :
      key === 'tief-einatmen' ? t[locale.value].deepInhale :
      key === 'ausatmen-tiefer-eindruecken' ? t[locale.value].pressDeeper :
      key === 'halten-10-sekunden' ? t[locale.value].holdTen : t[locale.value].done;
    announce(stepLabel);
    await Promise.all([playAudio(key), wait(milliseconds)]);
    if (cancelled) return;
  }

  async function runSide(currentSide: 'left' | 'right') {
    if (cancelled) return;
    side = currentSide;
    await command(currentSide === 'left' ? 'hand-linker-rippenbogen' : 'hand-rechter-rippenbogen', 2500);
    if (cancelled) return;
    for (let currentRepetition = 1; currentRepetition <= 3; currentRepetition += 1) {
      if (cancelled) return;
      repetition = currentRepetition;
      await command('tief-einatmen', 4000);
      if (cancelled) return;
      await command('ausatmen-tiefer-eindruecken', 2000);
      if (cancelled) return;
      await command('halten-10-sekunden', 10000);
      if (cancelled) return;
      stepLabel = t[locale.value].shortPause;
      announce(stepLabel);
      await wait(2000);
      if (cancelled) return;
    }
  }

  async function run() {
    if (running || cancelled) return;
    running = true;
    announce(t[locale.value].ready);
    const firstAudioAlreadyPlayed = consumeInitialAudioPlayed('hand-linker-rippenbogen');
    if (firstAudioAlreadyPlayed) {
      side = 'left';
      await wait(2500);
      if (cancelled) return;
      for (let currentRepetition = 1; currentRepetition <= 3; currentRepetition += 1) {
        if (cancelled) return;
        repetition = currentRepetition;
        await command('tief-einatmen', 4000);
        if (cancelled) return;
        await command('ausatmen-tiefer-eindruecken', 2000);
        if (cancelled) return;
        await command('halten-10-sekunden', 10000);
        if (cancelled) return;
        stepLabel = t[locale.value].shortPause;
        announce(stepLabel);
        await wait(2000);
        if (cancelled) return;
      }
    } else {
      await runSide('left');
    }
    if (cancelled) return;
    await command('seite-wechseln', 2500);
    if (cancelled) return;
    await runSide('right');
    if (cancelled) return;
    stepLabel = t[locale.value].done;
    await playAudio('fertig');
    if (cancelled) return;
    onComplete();
  }

  onMount(() => {
    void run();
  });

  onDestroy(() => {
    cancelled = true;
    stopAllAudio();
    cancelSpeech();
  });
</script>

<div class="wrapper">
  <div class="hands" aria-hidden="true"><span class:left={side === 'left'}>L</span><span class:right={side === 'right'}>R</span></div>
  <p class="label">{stepLabel}</p>
  <p class="counter">{t[locale.value].repetition} {repetition} {t[locale.value].of} 3 · {side === 'left' ? t[locale.value].left : t[locale.value].right}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.25rem; min-height:260px; color:#e2e8f0; text-align:center; }
  .hands { display:flex; gap:1rem; }
  .hands span { display:grid; place-items:center; width:76px; height:76px; border:2px solid #334155; border-radius:50%; color:#64748b; font-size:1.5rem; transition:all .3s ease; }
  .hands .left { border-color:#67e8f9; background:#155e75; color:#f0fdfa; transform:scale(1.12); }
  .hands .right { border-color:#fbbf24; background:#92400e; color:#fffbeb; transform:scale(1.12); }
  .label { font-size:1.3rem; font-weight:500; }
  .counter { color:#94a3b8; font-size:.9rem; }
</style>