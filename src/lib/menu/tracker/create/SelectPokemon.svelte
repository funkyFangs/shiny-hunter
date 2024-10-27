<script lang="ts">
  import {
    formatPokemonSpeciesName,
    getPokemonSpecies,
    type PokemonSpecies
  } from '$lib/api/PokemonSpeciesResource'
  import { isVarietySupported } from '$lib/api/VarietyResource'
  import { formatPokemonName, isShinyLocked, type Pokemon } from '$lib/api/PokemonResource'
  import type { PokemonForm } from '$lib/api/PokemonFormResource'
  import type { Generation } from '$lib/api/GenerationResource'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'
  import { formatVersionName, type Version } from '$lib/api/VersionResource'
  import ToolTip from '$lib/menu/controls/ToolTip.svelte'
  import { writable } from 'svelte/store'
  import { onDestroy } from 'svelte'
  import SliderToggle from '$lib/menu/controls/SliderToggle.svelte'
  import { delimitedTitleCase } from '$lib/utilities/Strings'

  /* ============================================================================================ *\
	 *  Inputs																																											*
	\* ============================================================================================ */

  export let generations: Generation[]
  export let selectedGeneration: Generation | undefined
  export let selectedVersionGroup: VersionGroup | undefined
  export let selectedVersion: Version | undefined

  /* ============================================================================================ *\
	 *  Outputs																																											*
	\* ============================================================================================ */

  export let selectedPokemonSpecies: PokemonSpecies | undefined
  export let selectedPokemon: Pokemon | undefined
  export let selectedPokemonForm: PokemonForm | undefined
  export let isFemale: boolean = false

  /* ============================================================================================ *\
	 *  Behavior																																										*
	\* ============================================================================================ */

  /* -------------------------------------------------------------------------------------------- *\
	 *  Fetch Pokemon species when name is valid																										*
	\* -------------------------------------------------------------------------------------------- */

  const pokemonSpeciesNameToPokemonSpecies: {
    [pokemonSpeciesName: string]: PokemonSpecies | { name: string }
  } = Object.fromEntries(
    generations.flatMap((generation) =>
      generation.pokemonSpecies.map((pokemonSpecies) => [
        formatPokemonSpeciesName(pokemonSpecies.name),
        pokemonSpecies
      ])
    )
  )

  const selectedPokemonSpeciesName = writable('')
  const unsubscribe = selectedPokemonSpeciesName.subscribe(async (pokemonSpeciesName) => {
    const pokemonSpecies = pokemonSpeciesNameToPokemonSpecies[pokemonSpeciesName]
    selectedPokemonSpecies = pokemonSpecies
      ? 'varieties' in pokemonSpecies
        ? pokemonSpecies
        : await getPokemonSpecies(pokemonSpecies.name)
      : undefined
  })

  onDestroy(() => {
    unsubscribe()
  })

  /* -------------------------------------------------------------------------------------------- *\
	 *  Set Pokemon when only 1 Pokemon is present																									*
	\* -------------------------------------------------------------------------------------------- */

  $: {
    if (selectedPokemonSpecies && selectedPokemonSpecies.varieties.length === 1) {
      selectedPokemon = selectedPokemonSpecies.varieties[0]
    }
    isFemale = selectedPokemonSpecies?.hasGenderDifferences ? isFemale : false
  }

  /* -------------------------------------------------------------------------------------------- *\
	 *  Set Pokemon form when only 1 Pokemon form is present																				*
	\* -------------------------------------------------------------------------------------------- */

  $: if (selectedPokemon && selectedPokemon.forms.length === 1) {
    selectedPokemonForm = selectedPokemon.forms[0]
  }

  /* -------------------------------------------------------------------------------------------- *\
	 *  Filter Pokemon varieties based on supported generation & version groups											*
	\* -------------------------------------------------------------------------------------------- */

  $: filteredVarieties = selectedPokemonSpecies
    ? selectedGeneration && selectedVersionGroup
      ? selectedPokemonSpecies.varieties.filter((pokemon) =>
          isVarietySupported(pokemon.name, selectedGeneration.id, selectedVersionGroup.name)
        )
      : selectedPokemonSpecies.varieties
    : undefined
</script>

<datalist id="pokemon-species">
  {#each generations.flatMap((generation) => generation.pokemonSpecies) as pokemonSpecies}
    <option>{formatPokemonSpeciesName(pokemonSpecies.name)}</option>
  {/each}
</datalist>

<label for="pokemon">Pokémon</label>
<div id="pokemon-entry">
  <input
    id="pokemon"
    required
    type="search"
    list="pokemon-species"
    bind:value={$selectedPokemonSpeciesName}
  />

  {#if selectedPokemonSpecies && selectedVersionGroup && isShinyLocked(selectedPokemonSpecies.name, selectedVersionGroup.name) && selectedVersion}
    <ToolTip
      id="shiny-lock-warning"
      title="This Pokemon is shiny-locked in Pokemon {formatVersionName(selectedVersion.name)}."
    >
      <span class="warning"></span>
    </ToolTip>
  {/if}
</div>

{#if selectedPokemonSpecies}
  {#if selectedGeneration && selectedVersionGroup && filteredVarieties && filteredVarieties.length > 1}
    <label for="variety">Variety</label>
    <select bind:value={selectedPokemon} id="variety">
      {#each filteredVarieties as variety}
        <option value={variety}
          >{formatPokemonName(selectedPokemonSpecies.name, variety.name)}</option
        >
      {/each}
    </select>
  {/if}

  {#if selectedPokemonSpecies.hasGenderDifferences}
    <label for="gender">Gender</label>
    <SliderToggle
      id="gender"
      offText="♂"
      offColor="#5BCEFA"
      onText="♀"
      onColor="#F5A9B8"
      bind:checked={isFemale}
    />
  {/if}
{/if}

{#if selectedPokemon && selectedPokemon.forms.length > 1}
  <label for="form">Form</label>
  <select bind:value={selectedPokemonForm} id="form">
    {#each selectedPokemon.forms as pokemonForm}
      <option value={pokemonForm}>{delimitedTitleCase(pokemonForm.name)}</option>
    {/each}
  </select>
{/if}

<style>
  select,
  input {
    height: 36px;
    text-align: center;
  }

  label {
    font-weight: bold;
    font-size: 15pt;
  }
</style>
