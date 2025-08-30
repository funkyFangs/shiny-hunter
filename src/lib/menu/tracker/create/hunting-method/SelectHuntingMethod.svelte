<script lang="ts">
  import { getSupportedHuntingMethods, HuntingMethod } from '$lib/api/HuntingMethod.js'
  import type { Generation } from '$lib/api/GenerationResource'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'
  import type { Version } from '$lib/api/VersionResource'

  let {
    selectedGeneration,
    selectedVersionGroup,
    selectedVersion,
    id = 'hunting-method',
    selectedHuntingMethod = $bindable()
  }: {
    selectedGeneration: Generation
    selectedVersionGroup: VersionGroup
    selectedVersion: Version
    id: string
    selectedHuntingMethod?: HuntingMethod
  } = $props()

  let huntingMethods = $derived(
    getSupportedHuntingMethods(
      selectedGeneration.id,
      selectedVersionGroup.name,
      selectedVersion.name
    )
  )

  $effect(() => {
    if (
      huntingMethods &&
      selectedHuntingMethod &&
      !huntingMethods.includes(selectedHuntingMethod)
    ) {
      selectedHuntingMethod = huntingMethods[0]
    }
  })
</script>

<div id="hunting-method-entry">
  {#if huntingMethods}
    <select {id} bind:value={selectedHuntingMethod} disabled={huntingMethods.length === 1} required>
      {#each huntingMethods as huntingMethod (huntingMethod)}
        <option value={huntingMethod}>{huntingMethod}</option>
      {/each}
    </select>
  {/if}
</div>

<style lang="css">
  #hunting-method-entry {
    display: flex;
    flex-direction: row;
    gap: var(--default-padding);
    justify-content: left;
    align-items: center;
  }

  select {
    height: 36px;
    text-align: center;
    background-color: var(--color-indigo-500);
    color: whitesmoke;

    &:hover {
      background-color: var(--color-indigo-400);
      color: black;
    }

    &:active {
      background-color: var(--color-indigo-300);
      color: black;
    }

    &:disabled {
      background-color: #677ea6;
      color: black;
    }
  }
</style>
