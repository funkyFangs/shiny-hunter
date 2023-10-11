<script context='module' lang='ts'>
  import { Game } from './Game'
  import { writable } from 'svelte/store'

  export const selectedGame = writable<Game | undefined>(undefined)
</script>

<script lang='ts'>
  import { groupBy } from '$lib/utilities/MapUtilities'
  import loadedGamesJson from '$lib/data/games.json'

  const loadedGames = loadedGamesJson.map(({displayName, generation, imageFolder, iconFolder, pokemonFile, methodsFile, supportsShinyCharm}) =>
    new Game(displayName, generation, imageFolder, iconFolder, pokemonFile, methodsFile, supportsShinyCharm));
</script>

<div id='select-game'>
  <label for='game'>Game</label>
  <select bind:value={$selectedGame} id='game'>
    {#each groupBy(loadedGames, game => game.generation) as [generation, games]}
      <optgroup label="Generation {generation}">
        <option selected style='display:none'/>
        {#each games as game}
          <option value={game}>{game.displayName}</option>
        {/each}
      </optgroup>
    {/each}
  </select>
</div>

<style>
  select {
    background-color: var(--background);
    margin-bottom: 10px;
  }

  #select-game * {
    display: inline-block;
  }

  label {
    margin-right: 10px;
  }
</style>