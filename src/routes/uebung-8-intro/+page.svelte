<script lang="ts">
  import { exercises } from '$lib/exercises';
  import IntroScreen from '$lib/IntroScreen.svelte';

  const exercise = exercises[7];
</script>

<IntroScreen
  title={exercise.title}
  description={exercise.description}
  introKey={exercise.id}
  firstAudioKey="tick"
  nextHref="/uebung-8"
/>