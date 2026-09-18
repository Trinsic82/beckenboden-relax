<script lang="ts">
  import { exercises } from '$lib/exercises';
  import IntroScreen from '$lib/IntroScreen.svelte';

  const exercise = exercises[5];
</script>

<IntroScreen
  title={exercise.title}
  description={exercise.description}
  introKey={exercise.id}
  firstAudioKey="hand-linker-rippenbogen"
  nextHref="/uebung-6"
/>