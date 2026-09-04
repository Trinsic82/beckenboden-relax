<script lang="ts">
  import { untrack } from 'svelte';

  let { inhale = 4, hold = 2, exhale = 7, durationSeconds = 90, onComplete = () => {} } = $props();

  let phase = $state<'inhale' | 'hold' | 'exhale'>('inhale');
  let phaseSeconds = $state(untrack(() => inhale));
  let elapsed = $state(0);
  let amplitude = $state(0.25);

  const phaseLabel = { inhale: 'Einatmen …', hold: 'Halten …', exhale: 'Loslassen …' };
  const bars = [0, 1, 2, 3, 4, 5, 6];

  function nextPhase() {
    if (phase === 'inhale') {
      phase = hold > 0 ? 'hold' : 'exhale';
      phaseSeconds = hold > 0 ? hold : exhale;
    } else if (phase === 'hold') {
      phase = 'exhale';
      phaseSeconds = exhale;
    } else {
      phase = 'inhale';
      phaseSeconds = inhale;
    }
  }

  $effect(() => {
    if (phase === 'inhale') {
      requestAnimationFrame(() => requestAnimationFrame(() => { amplitude = 1; }));
    } else if (phase === 'exhale') {
      requestAnimationFrame(() => requestAnimationFrame(() => { amplitude = 0.25; }));
    }
  });

  $effect(() => {
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
  const transitionDuration = $derived(phase === 'inhale' ? inhale : phase === 'hold' ? 0.3 : exhale);

  function barHeight(i: number) {
    const factors = [0.4, 0.7, 1, 0.85, 1, 0.7, 0.4];
    return 30 + factors[i] * amplitude * 90;
  }
</script>

<div class="wrapper">
  <div class="wave">
    {#each bars as i}
      <div class="bar" style="height: {barHeight(i)}px; transition-duration: {transitionDuration}s;"></div>
    {/each}
  </div>
  <p class="label">{phaseLabel[phase]}</p>
  <p class="timer">{minutes}:{seconds.toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; height:100%; color:#e2e8f0; }
  .wave { display:flex; align-items:center; gap:8px; height:130px; }
  .bar { width: 14px; border-radius: 8px; background: linear-gradient(to top, #0891b2, #67e8f9); transition-property: height; transition-timing-function: ease-in-out; }
  .label { font-size:1.4rem; font-weight:500; }
  .timer { font-size:1rem; opacity:0.7; letter-spacing:0.05em; }
</style>