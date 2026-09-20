<script lang="ts">
  import { locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';
</script>

<div class="page">
  <h1>{t[locale.value].sessionCompleted}</h1>
  <p class="desc">{t[locale.value].completedDescription}</p>
  <a href="/" class="button">{t[locale.value].back}</a>
</div>

<style>
  .page {
    min-height: 100vh;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: system-ui, sans-serif;
    gap: 1.5rem;
  }

  h1 {
    color: #f8fafc;
    font-size: 1.6rem;
    text-align: center;
  }

  .desc {
    color: #94a3b8;
    max-width: 320px;
    text-align: center;
  }

  .button {
    background: #1e3a8a;
    color: #f8fafc;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
  }
</style>