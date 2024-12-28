<script lang="ts">
  import { getSupportedHuntingMethods, getToolTip, HuntingMethod } from '$lib/api/HuntingMethod.js'
  import ToolTip from '$lib/menu/controls/ToolTip.svelte'
  import type { Generation } from '$lib/api/GenerationResource'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'
  import type { Version } from '$lib/api/VersionResource'

  /* ============================================================================================ *\
	 *  Inputs																																											*
	\* ============================================================================================ */

  export let selectedGeneration: Generation
  export let selectedVersionGroup: VersionGroup
  export let selectedVersion: Version
  export let id: string = 'hunting-method'

  /* ============================================================================================ *\
	 *  Outputs																																											*
	\* ============================================================================================ */

  export let selectedHuntingMethod: HuntingMethod | undefined

  /* ============================================================================================ *\
	 *  Behavior																																										*
	\* ============================================================================================ */

  $: huntingMethods = getSupportedHuntingMethods(
    selectedGeneration.id,
    selectedVersionGroup.name,
    selectedVersion.name
  )
  $: if (
    huntingMethods &&
    selectedHuntingMethod &&
    !huntingMethods.includes(selectedHuntingMethod)
  ) {
    selectedHuntingMethod = huntingMethods[0]
  }
</script>

<div id="hunting-method-entry">
  {#if huntingMethods}
    <select {id} bind:value={selectedHuntingMethod} disabled={huntingMethods.length === 1} required>
      {#each huntingMethods as huntingMethod}
        <option value={huntingMethod}>{huntingMethod}</option>
      {/each}
    </select>
  {/if}

  {#if selectedHuntingMethod}
    <ToolTip title={getToolTip(selectedHuntingMethod)}>
      <span class="info">i</span>
    </ToolTip>
  {/if}
</div>

<style lang="less">
  @import '../../../../style/palette';
  @import '../../../../style/positioning';

  #hunting-method-entry {
    display: flex;
    flex-direction: row;
    gap: @padding-length;
    justify-content: left;
    align-items: center;
  }

  select {
    height: 36px;
    text-align: center;
    background-color: @indigo;
    color: contrast($background-color);
  }

  select:hover {
    background-color: lighten(@indigo, 5%);
    color: contrast($background-color);
  }

  select:active {
    background-color: lighten(@indigo, 10%);
    color: contrast($background-color);
  }
</style>
