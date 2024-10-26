<script lang="ts">
	import ViewTrackers from '$lib/menu/tracker/view/ViewTrackers.svelte';

	export let data

	const {generations, huntTrackers, history, selectedTrackerIndex, spritePreference, showNormal} = data
</script>

<ViewTrackers
	{generations}
	{huntTrackers}
	{history}
	{selectedTrackerIndex}
	spritePreference={$spritePreference}
	showNormal={$showNormal}
/>