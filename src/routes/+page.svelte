<script lang="ts">
	import ViewTrackers from '$lib/menu/ViewTrackers.svelte';

	export let data

	const {generations, huntTrackers, selectedTrackerIndex, spritePreference, showNormal} = data
</script>

<ViewTrackers
	{generations}
	{huntTrackers}
	{selectedTrackerIndex}
	spritePreference={$spritePreference}
	showNormal={$showNormal}
/>