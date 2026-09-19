<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import MetronomeBounce from '$lib/MetronomeBounce.svelte';
  import { exercises } from '$lib/exercises';
  import { setupWakeLock } from '$lib/wakeLock';
  import { getNextExerciseHref } from '$lib/session';

  const exercise = exercises[7];
  onMount(() => setupWakeLock());
</script>

<div class="page">
  <h1>{exercise.title.replace(/^Übung \d+: /, '')}</h1>
  <p class="desc">{exercise.description}</p>
  <MetronomeBounce tempoMs={600} durationSeconds={exercise.durationSeconds} onComplete={() => goto(getNextExerciseHref(7))} />
</div>

<style>
  .page { min-height:100vh; background:#0f172a; display:flex; flex-direction:column; align-items:center; padding:2rem 1rem; font-family:system-ui,sans-serif; }
  h1 { color:#f8fafc; font-size:1.5rem; margin-bottom:.5rem; text-align:center; }
  .desc { color:#94a3b8; max-width:320px; text-align:center; margin-bottom:2rem; }
</style>