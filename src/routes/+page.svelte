<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { exercises, type ExerciseCategory } from '$lib/exercises';
  import { unlockAudio, preloadAll } from '$lib/audio';
  import { setSelectedExerciseIndices } from '$lib/session';
  import { locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';

  type ExerciseGroup = {
    category: ExerciseCategory;
    exercises: Array<(typeof exercises)[number] & { originalIndex: number }>;
  };

  let selectedIndices = $state<number[]>([]);

  const categoryOrder: ExerciseCategory[] = ['Trigger', 'Atmen', 'Lockern', 'Anspannung'];
  const exerciseName = (title: string) => title.replace(/^Übung \d+: |^Exercise \d+: /, '');
  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')} ${t[locale.value].minutes}`;
  const categoryLabel = (category: ExerciseCategory) => ({
    Trigger: t[locale.value].categoryTrigger,
    Atmen: t[locale.value].categoryBreathing,
    Lockern: t[locale.value].categoryRelax,
    Anspannung: t[locale.value].categoryTension
  })[category];
  const totalSeconds = $derived(selectedIndices.reduce((total, index) => total + exercises[index].durationSeconds, 0));
  const totalLabel = $derived(formatDuration(totalSeconds));
  const groups = $derived.by(() =>
    categoryOrder.map((category) => ({
      category,
      exercises: exercises
        .map((exercise, originalIndex) => ({ ...exercise, originalIndex }))
        .filter((exercise) => exercise.category === category)
    }))
  );

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

  <p class="hint">{t[locale.value].hint}</p>

  <a class="settings" href="/einstellungen">⚙ {t[locale.value].settings}</a>

  <div class="groups">
    {#each groups as group}
      <div class="group">
        <h2>{categoryLabel(group.category)}</h2>

        <div class="list">
          {#each group.exercises as exercise}
            <button class:selected={selectedIndices.includes(exercise.originalIndex)} type="button" onclick={() => toggleExercise(exercise.originalIndex)}>
              <span>{exerciseName(exercise.title[locale.value])}</span>
              <span class="duration">{formatDuration(exercise.durationSeconds)}</span>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="summary">
    <span>{selectedIndices.length} {selectedIndices.length === 1 ? t[locale.value].exercise : t[locale.value].exercises} {t[locale.value].selected}</span>
    <strong>{t[locale.value].total}: {totalLabel}</strong>
  </div>

  <button class="start" type="button" disabled={selectedIndices.length === 0} onclick={handleStart}>{t[locale.value].startSession}</button>
</div>

<style>
  .page { min-height: 100vh; background: #0f172a; display: flex; flex-direction: column; align-items: center; padding: 3rem 1.5rem; font-family: system-ui, sans-serif; gap: 1rem; }
  h1 { color: #f8fafc; font-size: 1.8rem; }
  .hint { color: #94a3b8; text-align: center; margin: 0 0 .5rem; }
  .settings { color: #94a3b8; font-size: .9rem; text-decoration: none; align-self: flex-end; width: 100%; max-width: 360px; text-align: right; }
  .groups { width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 1rem; }
  .group { display: flex; flex-direction: column; gap: 0.5rem; }
  h2 { margin: 0; color: #f8fafc; font-size: 1rem; font-weight: 700; }
  .list { display: flex; flex-direction: column; gap: 0.5rem; }
  .list button { display: flex; justify-content: space-between; align-items: center; width: 100%; border: 1px solid transparent; color: #e2e8f0; background: #1e293b; padding: 0.85rem 1rem; border-radius: 8px; font: inherit; text-align: left; cursor: pointer; }
  .list button.selected { border-color: #38bdf8; background: #164e63; }
  .duration { color: #94a3b8; font-size: .9rem; white-space: nowrap; margin-left: 1rem; }
  .summary { display: flex; justify-content: space-between; width: 100%; max-width: 360px; color: #94a3b8; font-size: .9rem; margin-top: .75rem; }
  .summary strong { color: #e2e8f0; }
  .start { margin-top: 1rem; border: 0; background: #1e3a8a; color: #f8fafc; padding: 0.9rem 2rem; border-radius: 8px; font: inherit; font-weight: 600; cursor: pointer; }
  .start:disabled { cursor: not-allowed; opacity: .45; }
</style>