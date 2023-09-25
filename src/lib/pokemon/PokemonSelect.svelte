<script context='module' lang='ts'>
  import { readonly, writable } from 'svelte/store'

  const writableSelectedPokemon = writable<Pokemon>(undefined)
  export const selectedPokemon = readonly(writableSelectedPokemon)
</script>

<script lang='ts'>
  import { onDestroy } from 'svelte'
  import { selectedGame } from '../games/GamesSelect.svelte'
  import { Pokemon } from './Pokemon'

  let loadedPokemonPromise: Promise<Pokemon[]>

  const unsubscribe = selectedGame.subscribe(game => {
    if (game) {
      loadedPokemonPromise = fetch(game?.pokemonFile)
        // Convert to JSON Array
        .then(response => response.json() as Promise<Array<any>>)
        // Map JSON values into Pokemon instances
        .then(array => array.map(pokemon => new Pokemon(pokemon.displayName, pokemon?.image, pokemon?.shinyImage, pokemon?.icon, pokemon?.variants)))
    }
  })

  onDestroy(unsubscribe)
</script>

<label for='pokemon'>Pokemon</label>

<select bind:value={$writableSelectedPokemon} disabled={loadedPokemonPromise == undefined} id='pokemon'>
  {#if loadedPokemonPromise}
    {#await loadedPokemonPromise then loadedPokemon}
      <option selected style='display:none'/>
      {#each loadedPokemon as pokemon}
        <option value={pokemon}>{pokemon.displayName}</option>
      {/each}
    {/await}
  {/if}
</select>