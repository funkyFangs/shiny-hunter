<script lang="ts">
  import { formatPokemonName, type Pokemon } from '$lib/api/PokemonResource'
  import type { PokemonSpecies } from '$lib/api/PokemonSpeciesResource'
  import { getSupportedPokemon } from '$lib/api/VarietyResource'
  import type { Generation } from '$lib/api/GenerationResource'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'

  let {
    pokemonSpecies,
    generation,
    versionGroup,
    id = 'pokemon',
    selectedPokemon = $bindable()
  }: {
    pokemonSpecies: PokemonSpecies
    generation: Generation
    versionGroup: VersionGroup
    id?: string
    selectedPokemon?: Pokemon
  } = $props()

  const supportedPokemon = getSupportedPokemon(pokemonSpecies, generation, versionGroup)
</script>

<select {id} bind:value={selectedPokemon} disabled={supportedPokemon.length === 1}>
  {#each supportedPokemon as pokemon}
    <option value={pokemon}>{formatPokemonName(pokemonSpecies.name, pokemon.name)}</option>
  {/each}
</select>

<style>
  select {
    height: 36px;
    text-align: center;
    width: fit-content;
  }
</style>
