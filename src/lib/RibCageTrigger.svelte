<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { consumeInitialAudioPlayed, playAudio } from '$lib/audio';
  import { speak, unlockSpeech } from '$lib/speech';

  let { onComplete = () => {} } = $props();
  let side = $state<'left' | 'right'>('left');
  let repetition = $state(1);
  let stepLabel = $state('Bereit machen');
  let running = $state(false);
  let cancelled = false;

  const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

  function announce(step: string) {
    unlockSpeech();
    speak(step);
  }

  async function command(key: string, milliseconds: number) {
    stepLabel = key === 'hand-linker-rippenbogen' ? 'Linke Hand am Rippenbogen' :
      key === 'hand-rechter-rippenbogen' ? 'Rechte Hand am Rippenbogen' :
      key === 'tief-einatmen' ? 'Tief einatmen' :
      key === 'ausatmen-tiefer-eindruecken' ? 'Ausatmen und tiefer eindrücken' :
      key === 'halten-10-sekunden' ? '10 Sekunden halten' : 'Weiter';
    announce(stepLabel);
    await Promise.all([playAudio(key), wait(milliseconds)]);
  }

  async function runSide(currentSide: 'left' | 'right') {
    side = currentSide;
    await command(currentSide === 'left' ? 'hand-linker-rippenbogen' : 'hand-rechter-rippenbogen', 2500);
    for (let currentRepetition = 1; currentRepetition <= 3; currentRepetition += 1) {
      if (cancelled) return;
      repetition = currentRepetition;
      await command('tief-einatmen', 4000);
      await command('ausatmen-tiefer-eindruecken', 2000);
      await command('halten-10-sekunden', 10000);
      stepLabel = 'Kurze Pause';
      announce(stepLabel);
      await wait(2000);
    }
  }

  async function run() {
    if (running) return;
    running = true;
    announce('Bereit machen');
    const firstAudioAlreadyPlayed = consumeInitialAudioPlayed('hand-linker-rippenbogen');
    if (firstAudioAlreadyPlayed) {
      side = 'left';
      await wait(2500);
      for (let currentRepetition = 1; currentRepetition <= 3; currentRepetition += 1) {
        if (cancelled) return;
        repetition = currentRepetition;
        await command('tief-einatmen', 4000);
        await command('ausatmen-tiefer-eindruecken', 2000);
        await command('halten-10-sekunden', 10000);
        stepLabel = 'Kurze Pause';
        announce(stepLabel);
        await wait(2000);
      }
    } else {
      await runSide('left');
    }
    if (cancelled) return;
    await command('seite-wechseln', 2500);
    await runSide('right');
    if (cancelled) return;
    stepLabel = 'Fertig';
    await playAudio('fertig');
    onComplete();
  }

  onMount(() => {
    void run();
  });

  onDestroy(() => {
    cancelled = true;
  });
</script>

<div class="wrapper">
  <div class="hands" aria-hidden="true"><span class:left={side === 'left'}>L</span><span class:right={side === 'right'}>R</span></div>
  <p class="label">{stepLabel}</p>
  <p class="counter">Wiederholung {repetition} von 3 · {side === 'left' ? 'linke' : 'rechte'} Seite</p>
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