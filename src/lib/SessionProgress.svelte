<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getSessionStart, getTotalSessionSeconds } from '$lib/session';
  import { locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';

  let { reset = false } = $props();

  let elapsed = $state(0);
  let total = $state(0);
  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    const start = getSessionStart(reset);
    total = getTotalSessionSeconds();
    function tick() {
      elapsed = Math.floor((Date.now() - start) / 1000);
    }
    tick();
    interval = setInterval(tick, 1000);
  });

  onDestroy(() => clearInterval(interval));

  const remaining = $derived(Math.max(total - elapsed, 0));
  const elapsedM = $derived(Math.floor(elapsed / 60));
  const elapsedS = $derived(elapsed % 60);
  const remainingM = $derived(Math.floor(remaining / 60));
  const remainingS = $derived(remaining % 60);
</script>

<div class="session-bar">
  <span>{t[locale.value].trained}: {elapsedM}:{elapsedS.toString().padStart(2, '0')}</span>
  <span>{t[locale.value].remaining}: {remainingM}:{remainingS.toString().padStart(2, '0')}</span>
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