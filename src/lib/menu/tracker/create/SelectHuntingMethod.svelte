<script lang="ts">
  import { getSupportedHuntingMethods, getToolTip, HuntingMethod } from '$lib/api/HuntingMethod.js'
  import ToolTip from '$lib/menu/controls/ToolTip.svelte'
  import type { Generation } from '$lib/api/GenerationResource'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'
  import type { Version } from '$lib/api/VersionResource'

  /* ============================================================================================ *\
	 *  Inputs																																											*
	\* ============================================================================================ */

  export let selectedGeneration: Generation | undefined
  export let selectedVersionGroup: VersionGroup | undefined
  export let selectedVersion: Version | undefined

  /* ============================================================================================ *\
	 *  Outputs																																											*
	\* ============================================================================================ */

  export let selectedHuntingMethod: HuntingMethod | undefined

  /* ============================================================================================ *\
	 *  Behavior																																										*
	\* ============================================================================================ */

  function getHuntingMethods(
    generation?: Generation,
    versionGroup?: VersionGroup,
    version?: Version
  ): HuntingMethod[] | undefined {
    return generation && versionGroup && version
      ? getSupportedHuntingMethods(generation.id, versionGroup.name, version.name)
      : undefined
  }

  $: huntingMethods = getHuntingMethods(selectedGeneration, selectedVersionGroup, selectedVersion)
  $: if (
    huntingMethods &&
    selectedHuntingMethod &&
    !huntingMethods.includes(selectedHuntingMethod)
  ) {
    selectedHuntingMethod = huntingMethods[0]
  }
</script>

<label for="hunting-method">Hunting Method</label>
<div id="hunting-method-entry">
  {#if huntingMethods}
    <select
      id="hunting-method"
      bind:value={selectedHuntingMethod}
      disabled={huntingMethods.length === 1}
      required
    >
      {#each huntingMethods as huntingMethod}
        <option value={huntingMethod}>{huntingMethod}</option>
      {/each}
    </select>
  {/if}

  {#if selectedHuntingMethod}
    <ToolTip title={getToolTip(selectedHuntingMethod)}>
      <span class="info"></span>
    </ToolTip>
  {/if}
</div>

<style>
  #hunting-method-entry {
    display: flex;
    flex-direction: row;
    gap: var(--padding-length);
    align-items: center;
  }

  select {
    height: 36px;
    text-align: center;
  }

  label {
    font-weight: bold;
    font-size: 15pt;
  }
</style>
