<script lang="ts">
  import ViewTrackers from '$lib/menu/tracker/view/ViewTrackers.svelte'

  export let data

  const {
    generations,
    huntTrackers,
    history,
    selectedTrackerIndex,
    spritePreference,
    showNormal,
    promptOnClose,
    keepHistory,
    showFraction,
    showPercentage,
    nextId
  } = data
</script>

<ViewTrackers
  {generations}
  {huntTrackers}
  {history}
  {selectedTrackerIndex}
  {nextId}
  spritePreference={$spritePreference}
  showNormal={$showNormal}
  promptOnClose={$promptOnClose}
  keepHistory={$keepHistory}
  showFraction={$showFraction}
  showPercentage={$showPercentage}
/>
