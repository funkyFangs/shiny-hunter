<script lang="ts">
  import type { Generation } from '$lib/api/GenerationResource'
  import {
    formatPokemonSpeciesName,
    getPokemonSpecies,
    getPokemonSpeciesList,
    type PokemonSpecies
  } from '$lib/api/PokemonSpeciesResource'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'

  let {
    generations,
    selectedGeneration,
    selectedVersionGroup,
    id = 'pokemon-species',
    selectPokemonSpecies
  }: {
    generations: Generation[]
    selectedGeneration: Generation
    selectedVersionGroup: VersionGroup
    id: string
    selectPokemonSpecies: (pokemonSpecies: PokemonSpecies | undefined) => void
  } = $props()

  let selectedPokemonSpeciesName = $state('')
  let pokemonSpeciesList = $derived(
    getPokemonSpeciesList(generations, selectedGeneration, selectedVersionGroup)
  )
  let pokemonSpeciesNameToPokemonSpecies: {
    [pokemonSpeciesName: string]: PokemonSpecies | { name: string }
  } = $derived(
    Object.fromEntries(
      generations.flatMap((generation) =>
        generation.pokemonSpecies.map((pokemonSpecies) => [
          formatPokemonSpeciesName(pokemonSpecies.name),
          pokemonSpecies
        ])
      )
    )
  )

  $effect(() => {
    if (pokemonSpeciesList.includes(selectedPokemonSpeciesName)) {
      const pokemonSpecies = pokemonSpeciesNameToPokemonSpecies[selectedPokemonSpeciesName]

      // Simple heuristic to determine if the full Pokemon species object is present
      if ('varieties' in pokemonSpecies) {
        selectPokemonSpecies(pokemonSpecies)
      }
      // Otherwise, fetch the Pokemon and load it
      else {
        getPokemonSpecies(pokemonSpecies.name).then((pokemonSpecies) =>
          selectPokemonSpecies(pokemonSpecies)
        )
      }
    }
  })
</script>

<datalist id="pokemon-species-list">
  {#each pokemonSpeciesList as pokemonSpecies (pokemonSpecies)}
    <option>{formatPokemonSpeciesName(pokemonSpecies)}</option>
  {/each}
</datalist>

<input
  {id}
  required
  type="search"
  list="pokemon-species-list"
  aria-autocomplete="list"
  bind:value={selectedPokemonSpeciesName}
/>

<style lang="css">
  input {
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
