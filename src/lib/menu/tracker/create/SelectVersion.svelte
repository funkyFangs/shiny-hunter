<script lang="ts">
  import {
    formatGenerationName,
    type Generation,
    MIN_GENERATION
  } from '$lib/api/GenerationResource'
  import { formatVersionName, type Version, VERSION_BLACKLIST } from '$lib/api/VersionResource'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'

  /* ============================================================================================ *\
	 *  Inputs																																											*
	\* ============================================================================================ */

  export let generations: Generation[]

  /* ============================================================================================ *\
	 *  Outputs																																											*
	\* ============================================================================================ */

  export let selectedVersion: Version | undefined
  export let selectedVersionGroup: VersionGroup | undefined
  export let selectedGeneration: Generation | undefined

  /* ============================================================================================ *\
	 *  Behavior																																										*
	\* ============================================================================================ */

  const versionToGeneration = Object.fromEntries(
    generations.flatMap((generation) =>
      generation.versionGroups
        .flatMap((versionGroup) => versionGroup.versions)
        .map((version) => [version.name, generation])
    )
  )
  const versionToVersionGroup = Object.fromEntries(
    generations
      .flatMap((generation) => generation.versionGroups)
      .flatMap((versionGroup) =>
        versionGroup.versions.map((version) => [version.name, versionGroup])
      )
  )

  $: if (selectedVersion) {
    selectedVersionGroup = versionToVersionGroup[selectedVersion.name]
    selectedGeneration = versionToGeneration[selectedVersion.name]
  }
</script>

<label for="version">Version</label>
<div class="entry">
  <select id="version" required bind:value={selectedVersion}>
    {#each generations.filter((generation) => generation.id >= MIN_GENERATION) as generation}
      <optgroup label={formatGenerationName(generation.name)}>
        {#each generation.versionGroups
          .flatMap((versionGroup) => versionGroup.versions)
          .filter((version) => !VERSION_BLACKLIST.has(version.name)) as version}
          <option value={version}>{formatVersionName(version.name)}</option>
        {/each}
      </optgroup>
    {/each}
  </select>
</div>

<style>
  select {
    height: 36px;
    text-align: center;
  }

  label {
    font-weight: bold;
    font-size: 15pt;
  }
</style>
