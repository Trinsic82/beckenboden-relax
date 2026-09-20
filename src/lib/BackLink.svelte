<script lang="ts">
  import { locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';
</script>

<a href="/" class="back">← {t[locale.value].backToOverview}</a>

<style>
  .back {
    align-self: flex-start;
    color: #64748b;
    font-size: 0.85rem;
    text-decoration: none;
    margin-bottom: 1rem;
  }
</style>