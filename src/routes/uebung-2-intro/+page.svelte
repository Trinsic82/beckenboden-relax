<script lang="ts">
  import { exercises } from '$lib/exercises';
  import IntroScreen from '$lib/IntroScreen.svelte';

  const exercise = exercises[1];
</script>

<IntroScreen
  title={exercise.title}
  description={exercise.description}
  introKey={exercise.id}
  nextHref="/uebung-2"
/>