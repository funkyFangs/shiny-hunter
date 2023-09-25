<script context='module' lang='ts'>
  import { readonly, writable } from 'svelte/store'

  const writableSelectedPokemon = writable<Pokemon>(undefined)
  export const selectedPokemon = readonly(writableSelectedPokemon)
</script>

<script lang='ts'>
  import { onDestroy } from 'svelte'
  import { selectedGame } from '../games/GamesSelect.svelte'
  import type { Game } from '../games/Games'

  let game: Game
  const unsubscribe = selectedGame.subscribe(value => {
    game = value
  })
  onDestroy(unsubscribe)

  function getPokemonFile(game: Game): Promise<Pokemon[]> {
    return fetch(/* @vite-ignore */ game.pokemonFile)
      .then(response => response.json())
  }
</script>

<label for='pokemon'>Pokemon</label>

<select bind:value={$writableSelectedPokemon} disabled={game == undefined}>
  {#if game != undefined}
    {#await getPokemonFile(game) then selections}
      {#each selections as selection}
        <option value={selection}>{selection.displayName}</option>
      {/each}
    {/await}
  {/if}
</select>

{#if $selectedPokemon == undefined}
<p>Choose a pokemon!</p>
{:else}
<p>You've chosen {$selectedPokemon?.displayName}!</p>
{/if}

<!-- React to selection of game -->
  <!-- Await pokemon from file -->
  <!-- Enable selection -->
  <!-- Add pokemon to selection -->