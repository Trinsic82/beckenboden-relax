<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import RibCageTrigger from '$lib/RibCageTrigger.svelte';
  import SessionProgress from '$lib/SessionProgress.svelte';
  import { exercises } from '$lib/exercises';
  import { setupWakeLock } from '$lib/wakeLock';
  import { getNextExerciseHref } from '$lib/session';

  const exercise = exercises[5];
  onMount(() => setupWakeLock());
</script>

<div class="page">
  <SessionProgress />
  <h1>{exercise.title.replace(/^Übung \d+: /, '')}</h1>
  <p class="desc">{exercise.description}</p>
  <RibCageTrigger onComplete={() => goto(getNextExerciseHref(5))} />
  <button class="end-button" type="button" onclick={() => goto('/')}>Beenden</button>
</div>

<style>
  .page { min-height:100vh; background:#0f172a; display:flex; flex-direction:column; align-items:center; padding:2rem 1rem; font-family:system-ui,sans-serif; }
  h1 { color:#f8fafc; font-size:1.5rem; margin-bottom:.5rem; text-align:center; }
  .desc { color:#94a3b8; max-width:320px; text-align:center; margin-bottom:2rem; }
  .end-button { margin-top:1rem; border:0; background:#1e3a8a; color:#f8fafc; padding:0.9rem 2rem; border-radius:8px; font:inherit; font-weight:600; cursor:pointer; }
</style>