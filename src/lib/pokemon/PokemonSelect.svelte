<script context='module' lang='ts'>
  import { readonly, writable } from 'svelte/store'

  const writableSelectedPokemon = writable<Pokemon>(undefined)
  export const selectedPokemon = readonly(writableSelectedPokemon)
</script>

<script lang='ts'>
  import { onDestroy } from 'svelte'
  import { selectedGame } from '../games/GamesSelect.svelte'
  import { Pokemon } from './Pokemon'

  const pokemon$ = writable<Array<Pokemon>>([])

  const unsubscribe = selectedGame.subscribe(game => {
    if (game) {
      fetch(game.pokemonFile)
        // Convert to JSON Array
        .then(response => response.json() as Promise<Array<Pokemon>>)
        // Map JSON values into Pokemon instances
        .then(array => array.map(pokemon =>
            new Pokemon(pokemon?.displayName,
                        pokemon?.image,
                        pokemon?.shinyImage,
                        pokemon?.icon,
                        pokemon?.variants)))
        // Update writable
        .then(pokemon => pokemon$.set(pokemon))
        // Set to empty array if there's an error
        .catch(() => pokemon$.set([]))
    }
  })

  onDestroy(unsubscribe)
</script>

<label for='pokemon'>Pokemon</label>

<select bind:value={$writableSelectedPokemon} disabled={$pokemon$.length <= 0} id='pokemon'>
  <option selected style='display:none'/>
  {#each $pokemon$ as pokemon}
    <option value={pokemon}>{pokemon.displayName}</option>
  {/each}
</select>
