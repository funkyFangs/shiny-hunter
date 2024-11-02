<script lang="ts">
  import type { Generation } from '$lib/api/GenerationResource'
  import {
    formatPokemonSpeciesName,
    getPokemonSpecies,
    type PokemonSpecies
  } from '$lib/api/PokemonSpeciesResource'
  import { onDestroy } from 'svelte'
  import { writable } from 'svelte/store'

  export let generations: Generation[]
  export let generation: Generation
  export let id: string = 'pokemon-species'
  export let selectedPokemonSpecies: PokemonSpecies | undefined

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
</script>

<datalist id="pokemon-species-list">
  {#each generations
    .filter((_, index) => index < generation.id)
    .flatMap((generation) => generation.pokemonSpecies) as pokemonSpecies}
    <option>{formatPokemonSpeciesName(pokemonSpecies.name)}</option>
  {/each}
</datalist>

<input
  {id}
  required
  type="search"
  list="pokemon-species-list"
  bind:value={$selectedPokemonSpeciesName}
/>

<style>
  input {
    height: 36px;
    text-align: center;
    width: fit-content;
  }
</style>
