<script>
  import { Games } from './Games';
  import { groupBy } from './Utilities';

  const groupedGames = groupBy(Games, ([, game]) => game.generation)
</script>

<label for='game'>Game</label>
<select name='game' id='game'>
  {#each groupedGames as [generation, namedGames]}
    <optgroup label="Generation {generation}">
      {#each namedGames as [name, game]}
        <option value={name}>{game.displayName}</option>
      {/each}
    </optgroup>
  {/each}
</select>