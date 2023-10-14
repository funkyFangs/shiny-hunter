<script lang='ts'>
  import { writable } from 'svelte/store';
  import { groupBy } from '$lib/utilities/MapUtilities';
  import loadedGamesJson from '$lib/data/games.json';
  import { Game } from '$lib/Game';
  import { Pokemon } from '$lib/Pokemon';
  import { Method } from '$lib/Method';
  import { Tracker, trackers } from '$lib/Tracker';
  import { onDestroy } from 'svelte';

  const loadedGames = loadedGamesJson.map(loadedGame =>
    new Game(loadedGame.displayName,
             loadedGame.generation,
             loadedGame.imageFolder,
             loadedGame.iconFolder,
             loadedGame.pokemonFile,
             loadedGame.methodsFile));

  // Selected Options
  const selectedGame = writable<Game | undefined>();
  const selectedPokemon = writable<Pokemon | undefined>();
  const selectedMethod = writable<Method | undefined>();
  const shinyCharm = writable(false);

  // Stores for Loaded Values
  const loadedPokemon = writable<Pokemon[]>([]);
  const loadedMethods = writable<Method[]>([]);

  const gameUnsubscribe = selectedGame.subscribe(game => {
    if (game) {
      // Load Pokemon
      fetch(game.pokemonFile)
        .then(response => response.json() as Promise<Pokemon[]>)
        .then(array => array.map(({displayName, image, shinyImage, icon, variants}) =>
          new Pokemon(displayName, image, shinyImage, icon, variants)))
        .then(pokemon => loadedPokemon.set(pokemon));

      // Load Methods
      fetch(game.methodsFile)
        .then(response => response.json() as Promise<Method[]>)
        .then(array => array.map(({displayName, singularUnit, pluralUnit, odds}) =>
          new Method(displayName, singularUnit, pluralUnit, odds)))
        .then(methods => loadedMethods.set(methods));

      if (!game.supportsShinyCharm) {
        shinyCharm.set(false);
      }
    }
    else {
      selectedPokemon.set(undefined);
      selectedMethod.set(undefined);
      shinyCharm.set(false);

      loadedPokemon.set([]);
      loadedMethods.set([]);
    }
  });

  onDestroy(gameUnsubscribe);

  function createTracker() {
    if ($selectedGame && $selectedPokemon && $selectedMethod) {
      $trackers = [...$trackers, new Tracker($selectedGame, $selectedPokemon, $selectedMethod, $shinyCharm)];
      selectedGame.set(undefined);
      selectedPokemon.set(undefined);
      selectedMethod.set(undefined);
      shinyCharm.set(false);
    }
  }
</script>

<!-- Selections -->
<form id='selections'>
  <!-- Game Select -->
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

  <!-- Pokemon Select -->
  <label for='pokemon'>Pokemon</label>
  <select id='pokemon' bind:value={$selectedPokemon} disabled={$loadedPokemon.length <= 0}>
    <option selected style='display:none'/>
    {#each $loadedPokemon as pokemon}
      <option value={pokemon}>{pokemon.displayName}</option>
    {/each}
  </select>

  <!-- Method Select -->
  <label for='method'>Method</label>
  <select id='method' bind:value={$selectedMethod} disabled={$loadedMethods.length <= 0}>
    <option selected style='display:none'/>
    {#each $loadedMethods as method}
      <option value={method}>{method.displayName}</option>
    {/each}
  </select>

  <!-- Shiny Charm Check -->
  <label for='shiny-charm'>Shiny Charm</label>
  <input type='checkbox' id='shiny-charm' bind:checked={$shinyCharm} disabled={!$selectedGame?.supportsShinyCharm}/>
</form>

<button id='create' disabled={!($selectedGame && $selectedPokemon && $selectedMethod)} on:click={createTracker}>Create Tracker</button>

<style>
  #selections {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: fit-content;
    gap: 10px;
    align-items: center;
    text-align: center;
    margin-bottom: 15px;
  }

  #selections label {
    font-weight: bold;
  }

  #create {
    display: block;
  }
</style>