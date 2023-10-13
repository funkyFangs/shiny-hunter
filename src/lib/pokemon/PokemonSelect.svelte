<script context='module' lang='ts'>
  import { writable } from 'svelte/store'

  export const selectedPokemon = writable<Pokemon | undefined>(undefined);
</script>

<script lang='ts'>
  import { onDestroy } from 'svelte'
  import { selectedGame } from '$lib/games/GameSelect.svelte'
  import { Pokemon } from '$lib/pokemon/Pokemon'

  const pokemon$ = writable<Pokemon[]>([])

  const unsubscribe = selectedGame.subscribe(game => {
    if (game) {
      fetch(game.pokemonFile)
        // Convert to JSON Array
        .then(response => response.json() as Promise<Pokemon[]>)
        // Map JSON values into Pokemon instances
        .then(array => array.map(({displayName, image, shinyImage, icon, variants}) =>
            new Pokemon(displayName, image, shinyImage, icon, variants)))
        // Update writable
        .then(pokemon => pokemon$.set(pokemon))
        // Set to empty array if there's an error
        .catch(() => pokemon$.set([]))
    }
    else {
      pokemon$.set([]);
    }
  })

  onDestroy(unsubscribe)
</script>

<div id='select-pokemon'>
  <label for='pokemon'>Pokemon</label>
  <select bind:value={$selectedPokemon} disabled={$pokemon$.length <= 0} id='pokemon'>
    <option selected style='display:none'/>
    {#each $pokemon$ as pokemon}
      <option value={pokemon}>{pokemon.displayName}</option>
    {/each}
  </select>
</div>

<style>
  select {
    background-color: var(--background);
    margin-bottom: 10px;
  }

  #select-pokemon * {
    display: inline-block;
  }

  label {
    margin-right: 10px;
  }
</style>