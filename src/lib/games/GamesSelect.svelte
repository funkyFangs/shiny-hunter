<script context='module' lang='ts'>
  import { readonly, writable } from 'svelte/store'

  const writableSelectedGame = writable<Game>(undefined)
  export const selectedGame = readonly(writableSelectedGame)
</script>

<script lang='ts'>
  import { Game, Games } from './Games'
  import { groupBy } from '../Utilities'

  // Group games by generation to build a grouped dropdown menu
  const groupedGames = groupBy(Games, ([, game]) => game.generation)
</script>

<label for='gameSelect'>Game</label>

<select bind:value={$writableSelectedGame} id='gameSelect'>
  {#each groupedGames as [generation, namedGames]}
    <optgroup label="Generation {generation}">
      <option selected style='display:none'/>
      {#each namedGames as [, game]}
        <option value={game}>{game.displayName}</option>
      {/each}
    </optgroup>
  {/each}
</select>