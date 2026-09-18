<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { exercises } from '$lib/exercises';
  import { unlockAudio, preloadAll } from '$lib/audio';
  import { setSelectedExerciseIndices } from '$lib/session';

  let selectedIndices = $state<number[]>([]);

  const exerciseName = (title: string) => title.replace(/^Übung \d+: /, '');
  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')} Min.`;
  const totalSeconds = $derived(selectedIndices.reduce((total, index) => total + exercises[index].durationSeconds, 0));
  const totalLabel = $derived(formatDuration(totalSeconds));

  onMount(() => {
    preloadAll();
  });

  function handleStart() {
    unlockAudio();
    if (selectedIndices.length === 0) return;
    setSelectedExerciseIndices(selectedIndices);
    void goto(`/uebung-${selectedIndices[0] + 1}-intro`);
  }

  function toggleExercise(index: number) {
    selectedIndices = selectedIndices.includes(index)
      ? selectedIndices.filter((selectedIndex) => selectedIndex !== index)
      : [...selectedIndices, index];
  }
</script>

<div class="page">
  <h1>Beckenboden Relax</h1>

  <p class="hint">Wähle deine Übungen in der gewünschten Reihenfolge.</p>

  <div class="list">
    {#each exercises as exercise, i}
      <button class:selected={selectedIndices.includes(i)} type="button" onclick={() => toggleExercise(i)}>
        <span>{exerciseName(exercise.title)}</span>
        <span class="duration">{formatDuration(exercise.durationSeconds)}</span>
      </button>
    {/each}
  </div>

  <div class="summary">
    <span>{selectedIndices.length} {selectedIndices.length === 1 ? 'Übung' : 'Übungen'} ausgewählt</span>
    <strong>Gesamt: {totalLabel}</strong>
  </div>

  <button class="start" type="button" disabled={selectedIndices.length === 0} onclick={handleStart}>Session starten</button>
</div>

<style>
  .page { min-height: 100vh; background: #0f172a; display: flex; flex-direction: column; align-items: center; padding: 3rem 1.5rem; font-family: system-ui, sans-serif; gap: 1rem; }
  h1 { color: #f8fafc; font-size: 1.8rem; }
  .hint { color: #94a3b8; text-align: center; margin: 0 0 .5rem; }
  .list { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 360px; }
  .list button { display: flex; justify-content: space-between; align-items: center; width: 100%; border: 1px solid transparent; color: #e2e8f0; background: #1e293b; padding: 0.85rem 1rem; border-radius: 8px; font: inherit; text-align: left; cursor: pointer; }
  .list button.selected { border-color: #38bdf8; background: #164e63; }
  .duration { color: #94a3b8; font-size: .9rem; white-space: nowrap; margin-left: 1rem; }
  .summary { display: flex; justify-content: space-between; width: 100%; max-width: 360px; color: #94a3b8; font-size: .9rem; margin-top: .75rem; }
  .summary strong { color: #e2e8f0; }
  .start { margin-top: 1rem; border: 0; background: #1e3a8a; color: #f8fafc; padding: 0.9rem 2rem; border-radius: 8px; font: inherit; font-weight: 600; cursor: pointer; }
  .start:disabled { cursor: not-allowed; opacity: .45; }
</style>