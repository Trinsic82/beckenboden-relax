<script lang="ts">
  import { untrack } from 'svelte';

  let { contract = 3, hold = 3, exhale = 13, durationSeconds = 90, onComplete = () => {} } = $props();
  const release = exhale;

  let phase = $state<'contract' | 'hold' | 'release'>('contract');
  let phaseSeconds = $state(untrack(() => contract));
  let elapsed = $state(0);
  let translateY = $state(60);
  let opacity = $state(0.3);

  const phaseLabel = { contract: 'Sanft anspannen …', hold: 'Halten …', release: 'Loslassen und sinken lassen …' };

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
  }

  $effect(() => {
    if (phase === 'contract') {
      requestAnimationFrame(() => requestAnimationFrame(() => { translateY = 0; opacity = 1; }));
    } else if (phase === 'release') {
      requestAnimationFrame(() => requestAnimationFrame(() => { translateY = 60; opacity = 0.3; }));
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
  const transitionDuration = $derived(phase === 'contract' ? contract : phase === 'hold' ? 0.3 : release);
</script>

<div class="wrapper">
  <div class="track">
    <div class="drop" style="transform: translateY({translateY}px); opacity: {opacity}; transition-duration: {transitionDuration}s;"></div>
  </div>
  <p class="label">{phaseLabel[phase]}</p>
  <p class="timer">{minutes}:{seconds.toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; height:100%; color:#e2e8f0; }
  .track { width: 100px; height: 140px; display:flex; justify-content:center; }
  .drop { width: 70px; height: 70px; border-radius: 50% 50% 50% 0; background: radial-gradient(circle at 35% 35%, #fca5a5, #b91c1c); transform-origin: top center; transition-property: transform, opacity; transition-timing-function: ease-in-out; }
  .label { font-size:1.4rem; font-weight:500; text-align:center; max-width:280px; }
  .timer { font-size:1rem; opacity:0.7; letter-spacing:0.05em; }
</style>