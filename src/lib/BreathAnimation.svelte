<script lang="ts">
  import { untrack } from 'svelte';
  import { playAudio } from '$lib/audio';

  let { inhale = 4, hold = 0, exhale = 6, durationSeconds = 180, introKey = '', onComplete = () => {} } = $props();

  let phase = $state<'inhale' | 'hold' | 'exhale'>('inhale');
  let phaseSeconds = $state(untrack(() => inhale));
  let elapsed = $state(0);
  let scale = $state(0.6);
  let hasStarted = false;
  let running = $state(false);

  const phaseLabel = { inhale: 'Einatmen', hold: 'Halten', exhale: 'Ausatmen' };
  const phaseAudioKey = { inhale: 'einatmen', hold: 'halten', exhale: 'ausatmen' };

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
    playAudio(phaseAudioKey[phase]);
  }

  $effect(() => {
    if (phase === 'inhale') {
      requestAnimationFrame(() => requestAnimationFrame(() => { scale = 1; }));
    } else if (phase === 'exhale') {
      requestAnimationFrame(() => requestAnimationFrame(() => { scale = 0.6; }));
    }
  });

  $effect(() => {
    if (!hasStarted) {
      hasStarted = true;
      if (introKey) {
        playAudio(`intro-${introKey}`).then(() => {
          playAudio(phaseAudioKey[phase]);
          running = true;
        });
      } else {
        playAudio(phaseAudioKey[phase]);
        running = true;
      }
    }
  });

  $effect(() => {
    if (!running) return;
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
</script>

<div class="wrapper">
  <div
    class="circle"
    style="transform: scale({scale}); transition-duration: {phase === 'inhale' ? inhale : phase === 'hold' ? 0.3 : exhale}s;"
  ></div>
  <p class="label">{phaseLabel[phase]} …</p>
  <p class="timer">{minutes}:{seconds.toString().padStart(2, '0')}</p>
</div>

<style>
  .wrapper { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1.5rem; height:100%; color:#e2e8f0; }
  .circle { width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #60a5fa, #1e3a8a); transition-property: transform; transition-timing-function: ease-in-out; }
  .label { font-size:1.4rem; font-weight:500; }
  .timer { font-size:1rem; opacity:0.7; letter-spacing:0.05em; }
</style>