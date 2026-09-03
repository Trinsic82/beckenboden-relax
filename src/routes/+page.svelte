<script lang="ts">
  import { exercises } from '$lib/exercises';
</script>

<div class="page">
  <h1>Beckenboden Relax</h1>

  <ul class="list">
    {#each exercises as exercise, i}
      <li>
        <a href="/uebung-{i + 1}">{exercise.title}</a>
      </li>
    {/each}
  </ul>

  <a href="/uebung-1" class="start">Session starten</a>
</div>

<style>
  .page { min-height: 100vh; background: #0f172a; display: flex; flex-direction: column; align-items: center; padding: 3rem 1.5rem; font-family: system-ui, sans-serif; gap: 1.5rem; }
  h1 { color: #f8fafc; font-size: 1.8rem; }
  .list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; width: 100%; max-width: 320px; }
  .list a { display: block; color: #e2e8f0; background: #1e293b; padding: 0.75rem 1rem; border-radius: 8px; text-decoration: none; }
  .start { margin-top: 1rem; background: #1e3a8a; color: #f8fafc; padding: 0.9rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
</style>