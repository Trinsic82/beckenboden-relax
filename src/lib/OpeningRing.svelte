<script lang="ts">
  let { contract = 4, hold = 0, exhale = 7, durationSeconds = 180, onComplete = () => {} } = $props();
  const release = exhale;

  let phase = $state<'contract' | 'hold' | 'release'>('contract');
  let phaseSeconds = $state(contract);
  let elapsed = $state(0);
  let openAmount = $state(0.35);

  const phaseLabel = { contract: 'Sanft anspannen …', hold: 'Halten …', release: 'Ganz langsam loslassen …' };
  const petalAngles = [0, 60, 120, 180, 240, 300];

  function nextPhase() {
    if (phase === 'contract') {
      phase = hold > 0 ? 'hold' : 'release';
      phaseSeconds = hold > 0 ? hold : release;
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
      requestAnimationFrame(() => requestAnimationFrame(() => { openAmount = 0.35; }));
    } else if (phase === 'release') {
      requestAnimationFrame(() => requestAnimationFrame(() => { openAmount = 1; }));
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
  const phaseDuration = $derived(phase === 'contract' ? contract : phase === 'hold' ? 0.3 : release);
</script>

<div class="wrapper">
  <div class="ring">
    {#each petalAngles as angle}
      <div
        class="petal"
        style="transform: rotate({angle}deg) translateY({-40 - openAmount * 40}px) rotate({-angle}deg); transition-duration: {phaseDuration}s;"
      ></div>
    {/each}
    <div class="center"></div>
  </div>
  <p class="label">{phaseLabel[phase]}</p>
  <p class="timer">{minutes}:{seconds.toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; height:100%; color:#e2e8f0; }
  .ring { position:relative; width:160px; height:160px; }
  .petal {
    position:absolute; top:50%; left:50%; width:28px; height:44px; margin:-22px 0 0 -14px;
    border-radius:50%;
    background:radial-gradient(circle at 40% 30%, #5eead4, #0f766e);
    transition-property: transform;
    transition-timing-function: ease-in-out;
  }
  .center { position:absolute; top:50%; left:50%; width:24px; height:24px; margin:-12px 0 0 -12px; border-radius:50%; background:#134e4a; }
  .label { font-size:1.4rem; font-weight:500; }
  .timer { font-size:1rem; opacity:0.7; letter-spacing:0.05em; }
</style>