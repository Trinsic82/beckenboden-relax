<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { totalSessionSeconds, getSessionStart } from '$lib/session';

  let { reset = false } = $props();

  let elapsed = $state(0);
  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    const start = getSessionStart(reset);
    function tick() {
      elapsed = Math.floor((Date.now() - start) / 1000);
    }
    tick();
    interval = setInterval(tick, 1000);
  });

  onDestroy(() => clearInterval(interval));

  const remaining = $derived(Math.max(totalSessionSeconds - elapsed, 0));
  const elapsedM = $derived(Math.floor(elapsed / 60));
  const elapsedS = $derived(elapsed % 60);
  const remainingM = $derived(Math.floor(remaining / 60));
  const remainingS = $derived(remaining % 60);
</script>

<div class="session-bar">
  <span>Trainiert: {elapsedM}:{elapsedS.toString().padStart(2, '0')}</span>
  <span>Verbleibend: {remainingM}:{remainingS.toString().padStart(2, '0')}</span>
</div>

<style>
  .session-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 320px;
    color: #64748b;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
</style>