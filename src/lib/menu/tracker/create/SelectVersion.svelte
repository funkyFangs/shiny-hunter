<script lang="ts">
  import {
    formatGenerationName,
    type Generation,
    MIN_GENERATION
  } from '$lib/api/GenerationResource'
  import { formatVersionName, type Version, VERSION_BLACKLIST } from '$lib/api/VersionResource'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'

  let {
    generations,
    id = 'version',
    selectedVersion = $bindable<Version | undefined>(),
    selectVersionGroup,
    selectGeneration
  }: {
    generations: Generation[]
    id?: string
    selectedVersion?: Version
    selectVersionGroup: (versionGroup: VersionGroup | undefined) => void
    selectGeneration: (generation: Generation | undefined) => void
  } = $props()

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

  $effect(() => {
    selectVersionGroup(selectedVersion ? versionToVersionGroup[selectedVersion.name] : undefined)
    selectGeneration(selectedVersion ? versionToGeneration[selectedVersion.name] : undefined)
  })
</script>

<select {id} required bind:value={selectedVersion}>
  {#each generations.filter((generation) => generation.id >= MIN_GENERATION) as generation (generation.id)}
    <optgroup label={formatGenerationName(generation.name)}>
      {#each generation.versionGroups
        .flatMap((versionGroup) => versionGroup.versions)
        .filter((version) => !VERSION_BLACKLIST.has(version.name)) as version (version.name)}
        <option value={version}>{formatVersionName(version.name)}</option>
      {/each}
    </optgroup>
  {/each}
</select>

<style lang="css">
  select {
    height: 36px;
    text-align: center;
    width: fit-content;
    background-color: var(--color-indigo-500);
    color: whitesmoke;

    &:hover,
    &:active {
      color: black;
    }

    &:hover {
      background-color: var(--color-indigo-400);
    }

    &:active {
      background-color: var(--color-indigo-300);
    }
  }
</style>
