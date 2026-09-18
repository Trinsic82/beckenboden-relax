<script lang="ts">
  import { exercises } from '$lib/exercises';
  import IntroScreen from '$lib/IntroScreen.svelte';

  const exercise = exercises[3];
</script>

<IntroScreen
  title={exercise.title}
  description={exercise.description}
  introKey={exercise.id}
  nextHref="/uebung-4"
/>