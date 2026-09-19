<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { stopAllAudio } from '$lib/audio';
	import { cancelSpeech } from '$lib/speech';

	let { children } = $props();

	beforeNavigate(({ from, to }) => {
		if (!from || !to) return;
		if (from.url.pathname !== to.url.pathname) {
			stopAllAudio();
			cancelSpeech();
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
