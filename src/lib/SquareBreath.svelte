<script lang="ts">
  import { untrack } from 'svelte';

  let { inhale = 4, hold = 7, exhale = 8, durationSeconds = 60, onComplete = () => {} } = $props();

  let phase = $state<'inhale' | 'hold' | 'exhale'>('inhale');
  let phaseSeconds = $state(untrack(() => inhale));
  let elapsed = $state(0);
  let scale = $state(0.6);
  let radius = $state(32);

  const phaseLabel = { inhale: 'Einatmen …', hold: 'Halten …', exhale: 'Ausatmen …' };

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
      requestAnimationFrame(() => requestAnimationFrame(() => { scale = 1; radius = 8; }));
    } else if (phase === 'exhale') {
      requestAnimationFrame(() => requestAnimationFrame(() => { scale = 0.6; radius = 32; }));
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
</script>

<div class="wrapper">
  <div class="square" style="transform: scale({scale}); border-radius: {radius}px; transition-duration: {transitionDuration}s;"></div>
  <p class="label">{phaseLabel[phase]}</p>
  <p class="timer">{minutes}:{seconds.toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; height:100%; color:#e2e8f0; }
  .square { width: 160px; height: 160px; background: linear-gradient(135deg, #c084fc, #6d28d9); transition-property: transform, border-radius; transition-timing-function: ease-in-out; }
  .label { font-size:1.4rem; font-weight:500; }
  .timer { font-size:1rem; opacity:0.7; letter-spacing:0.05em; }
</style>