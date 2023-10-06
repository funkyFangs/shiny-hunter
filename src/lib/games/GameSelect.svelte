<script context='module' lang='ts'>
  import { Game } from './Game'
  import { readonly, writable } from 'svelte/store'

  const writableSelectedGame = writable<Game>(undefined)
  export const selectedGame = readonly(writableSelectedGame)
</script>

<script lang='ts'>
  import { groupBy } from '$lib/utilities/MapUtilities'
  import loadedGamesJson from '$lib/data/games.json'

  const loadedGames = loadedGamesJson.map(game =>
      new Game(game.displayName,
               game.generation,
               game.imageFolder,
               game.iconFolder,
               game.pokemonFile,
               game.methodsFile,
               game.supportsShinyCharm))
</script>


<select bind:value={$writableSelectedGame} id='game'>
  {#each groupBy(loadedGames, game => game.generation) as [generation, games]}
    <optgroup label="Generation {generation}">
      <option selected style='display:none'/>
      {#each games as game}
        <option value={game}>{game.displayName}</option>
      {/each}
    </optgroup>
  {/each}
</select>