<script lang="ts">
  import { untrack } from 'svelte';

  let { contract = 4, hold = 2, exhale = 9, durationSeconds = 90, onComplete = () => {} } = $props();
  const release = exhale;

  let phase = $state<'contract' | 'hold' | 'release'>('contract');
  let phaseSeconds = $state(untrack(() => contract));
  let elapsed = $state(0);
  let fill = $state(0);

  const phaseLabel = { contract: 'Beckenboden sanft anspannen …', hold: 'Halten …', release: 'Loslassen und lange entspannen …' };

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
      requestAnimationFrame(() => requestAnimationFrame(() => { fill = 100; }));
    } else if (phase === 'release') {
      requestAnimationFrame(() => requestAnimationFrame(() => { fill = 0; }));
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
  const transitionDuration = $derived(phase === 'contract' ? contract : phase === 'hold' ? 0.2 : release);
</script>

<div class="wrapper">
  <div class="meter">
    <div class="fill" style="height:{fill}%; transition-duration:{transitionDuration}s;"></div>
  </div>
  <p class="label">{phaseLabel[phase]}</p>
  <p class="timer">{minutes}:{seconds.toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; height:100%; color:#e2e8f0; }
  .meter { width:60px; height:200px; border:2px solid #334155; border-radius:30px; overflow:hidden; display:flex; align-items:flex-end; background:#1e293b; }
  .fill { width:100%; background:linear-gradient(to top, #f97316, #fbbf24); transition-property: height; transition-timing-function: ease-in-out; }
  .label { font-size:1.3rem; font-weight:500; text-align:center; max-width:280px; }
  .timer { font-size:1rem; opacity:0.7; letter-spacing:0.05em; }
</style>