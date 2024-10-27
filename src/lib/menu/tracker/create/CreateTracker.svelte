<script lang="ts">
  import { type Version } from '$lib/api/VersionResource'
  import { type Generation } from '$lib/api/GenerationResource'
  import { type HuntingMethod } from '$lib/api/HuntingMethod'
  import { type PokemonSpecies } from '$lib/api/PokemonSpeciesResource'
  import { type Pokemon } from '$lib/api/PokemonResource'
  import type { PokemonForm } from '$lib/api/PokemonFormResource'
  import SelectVersion from '$lib/menu/tracker/create/SelectVersion.svelte'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'
  import SelectPokemon from '$lib/menu/tracker/create/SelectPokemon.svelte'
  import SelectHuntingMethod from '$lib/menu/tracker/create/SelectHuntingMethod.svelte'
  import SliderToggle from '$lib/menu/controls/SliderToggle.svelte'
  import type { CreatedHuntTracker } from '$lib/api/HuntTracker'

  /* ============================================================================================ *\
	 *  Inputs																																											*
	\* ============================================================================================ */

  let {
    generations,
    created
  }: {
    generations: Generation[]
    created: (tracker: CreatedHuntTracker) => void
  } = $props()

  /* ============================================================================================ *\
	 *  Version																																											*
	\* ============================================================================================ */

  let selectedVersion: Version | undefined = $state()
  let selectedVersionGroup: VersionGroup | undefined = $state()
  let selectedGeneration: Generation | undefined = $state()

  /* ============================================================================================ *\
	 *  Pokemon       																																							*
	\* ============================================================================================ */

  let selectedPokemonSpecies: PokemonSpecies | undefined = $state()
  let selectedPokemon: Pokemon | undefined = $state()
  let selectedPokemonForm: PokemonForm | undefined = $state()
  let isFemale: boolean = $state(false)

  /* ============================================================================================ *\
	 *  Hunting Method																																							*
	\* ============================================================================================ */

  let selectedHuntingMethod: HuntingMethod | undefined = $state()

  /* ============================================================================================ *\
	 *  Shiny Charm																																									*
	\* ============================================================================================ */

  let shinyCharm: boolean = $state(false)

  /* ============================================================================================ *\
	 *  Form  																																											*
	\* ============================================================================================ */

  const readyToSubmit = $derived(
    selectedVersion &&
      selectedPokemonSpecies &&
      selectedPokemon &&
      selectedPokemonForm &&
      selectedHuntingMethod
  )

  function onSubmit() {
    created({
      method: selectedHuntingMethod!,
      pokemonSpecies: selectedPokemonSpecies!,
      pokemon:
        selectedPokemonSpecies!.varieties.length === 1 ? undefined : (selectedPokemon ?? undefined),
      pokemonForm:
        selectedPokemon!.forms!.length === 1 ? undefined : (selectedPokemonForm ?? undefined),
      female: selectedPokemonSpecies!.hasGenderDifferences ? isFemale : undefined,
      version: selectedVersion!.name,
      versionGroup:
        selectedVersionGroup!.name === selectedVersion!.name
          ? undefined
          : selectedVersionGroup!.name,
      generation: selectedGeneration!.id,
      shinyCharm: selectedGeneration!.id >= 5 ? shinyCharm : undefined
    })
  }
</script>

<div class="create-tracker-container">
  <div class="grid">
    <SelectVersion
      {generations}
      bind:selectedVersion
      selectVersionGroup={(versionGroup) => (selectedVersionGroup = versionGroup)}
      selectGeneration={(generation) => (selectedGeneration = generation)}
    />

    {#if selectedGeneration && selectedGeneration.id >= 5}
      <label for="shiny-charm">Shiny Charm</label>
      <SliderToggle id="shiny-charm" bind:checked={shinyCharm} />
    {/if}

    <SelectHuntingMethod
      {selectedVersion}
      {selectedVersionGroup}
      {selectedGeneration}
      bind:selectedHuntingMethod
    />

    <SelectPokemon
      {generations}
      {selectedVersion}
      {selectedVersionGroup}
      {selectedGeneration}
      bind:selectedPokemonSpecies
      bind:selectedPokemon
      bind:selectedPokemonForm
      bind:isFemale
    />
  </div>

  <button id="submit" class="primary-button" disabled={!readyToSubmit} onclick={onSubmit}
    >Create Hunt Tracker</button
  >
</div>

<style>
  /* TODO - Clean up */
  .create-tracker-container {
    /* Positioning */
    display: flex;
    padding: var(--gap-length);
    justify-content: center;
    align-content: center;
    gap: var(--gap-length);

    /* Decoration */
    border-radius: var(--border-radius);

    /* Palette */
    background-color: var(--primary-medium);
    flex-direction: column;
  }

  .grid {
    /* Positioning */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-length);
    justify-content: center;
    align-items: center;
    width: fit-content;
    margin: auto;
  }

  #submit {
    width: fit-content;
    margin: auto;
    height: 38px;
  }

  #submit,
  label {
    font-weight: bold;
    font-size: 15pt;
  }
</style>
