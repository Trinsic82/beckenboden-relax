<script lang="ts">
  import OpeningRing from '$lib/OpeningRing.svelte';
  import { exercises } from '$lib/exercises';
  import { goto } from '$app/navigation';

  const exercise = exercises[5];

  function handleComplete() {
    goto('/uebung-7');
  }
</script>

<div class="page">
  <h1>{exercise.title}</h1>
  <p class="desc">{exercise.description}</p>
  <OpeningRing
    contract={exercise.inhale}
    hold={exercise.hold}
    release={exercise.exhale}
    durationSeconds={exercise.durationSeconds}
    onComplete={handleComplete}
  />
</div>

<style>
  .page { min-height: 100vh; background: #0f172a; display: flex; flex-direction: column; align-items: center; padding: 2rem 1rem; font-family: system-ui, sans-serif; }
  h1 { color: #f8fafc; font-size: 1.5rem; margin-bottom: 0.5rem; text-align: center; }
  .desc { color: #94a3b8; max-width: 320px; text-align: center; margin-bottom: 2rem; }
</style>