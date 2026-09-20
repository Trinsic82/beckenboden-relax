<script lang="ts">
  import { changeLocale, changeSkipIntros, locale, skipIntros, type Locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';

  function selectLanguage(value: Locale) {
    changeLocale(value);
  }

  function toggleSkipIntros() {
    changeSkipIntros(!skipIntros.value);
  }
</script>

<div class="page">
  <a class="back" href="/">← {t[locale.value].back}</a>
  <h1>{t[locale.value].settings}</h1>
  <p class="label">{t[locale.value].language}</p>
  <div class="languages">
    <button class:active={locale.value === 'de'} type="button" onclick={() => selectLanguage('de')}>{t[locale.value].german}</button>
    <button class:active={locale.value === 'en'} type="button" onclick={() => selectLanguage('en')}>{t[locale.value].english}</button>
  </div>
  <div class="option">
    <button class:active={skipIntros.value} type="button" aria-pressed={skipIntros.value} onclick={toggleSkipIntros}>
      {skipIntros.value ? '✓ ' : ''}{t[locale.value].skipIntros}
    </button>
    <p>{t[locale.value].skipIntrosDescription}</p>
  </div>
</div>

<style>
  .page { min-height: 100vh; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; padding: 2rem 1rem; font-family: system-ui, sans-serif; }
  .back { align-self: flex-start; color: #94a3b8; text-decoration: none; }
  h1 { margin-top: 4rem; }
  .label { color: #94a3b8; }
  .languages { display: flex; gap: .75rem; }
  button { border: 1px solid #334155; background: #1e293b; color: #e2e8f0; padding: .8rem 1.2rem; border-radius: 8px; font: inherit; cursor: pointer; }
  button.active { border-color: #38bdf8; background: #164e63; }
  .option { margin-top: 2rem; text-align: center; max-width: 320px; }
  .option p { color: #94a3b8; font-size: .9rem; margin: .75rem 0 0; }
</style>
