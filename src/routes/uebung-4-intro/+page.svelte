<script lang="ts">
  import { exercises } from '$lib/exercises';
  import { locale } from '$lib/locale.svelte';
  import { t } from '$lib/i18n';
  import IntroScreen from '$lib/IntroScreen.svelte';

  const exercise = exercises[3];
</script>

<IntroScreen
  title={exercise.title[locale.value]}
  description={exercise.description[locale.value]}
  introKey={exercise.id}
  firstAudioKey="anspannen"
  nextHref="/uebung-4"
/>