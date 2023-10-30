<script lang='ts'>
  import { writable } from 'svelte/store';
  import { groupBy } from '$lib/utilities/MapUtilities';
  import loadedGamesJson from '$lib/data/games.json';
  import { Game } from '$lib/Game';
  import { Pokemon, Variant } from '$lib/Pokemon';
  import { Method } from '$lib/Method';
  import { Tracker, selectedTrackerIndex, trackers } from '$lib/Tracker';
  import { onDestroy } from 'svelte';

  const loadedGames = loadedGamesJson.map(loadedGame =>
    new Game(loadedGame.displayName,
             loadedGame.generation,
             loadedGame.imageFolder,
             loadedGame.iconFolder,
             loadedGame.pokemonFile,
             loadedGame.methodsFile,
             loadedGame.imageExtension,
             loadedGame.iconExtension));

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
        .then(array => array.map(({ displayName, image, shinyImage, icon, variants }) =>
          new Pokemon(displayName,
            variants?.length ? undefined : `${image || displayName}`.replace(' ', '_'),
            variants?.length ? undefined : `${shinyImage || displayName}.shiny`.replace(' ', '_'),
            variants?.length ? undefined : `${icon || displayName}`.replace(' ', '_'),
            variants?.length
              ? variants.map(variant =>
                  new Variant(variant.displayName,
                    `${variant.image || `${displayName}.${variant.displayName}`}`.replace(' ', '_'),
                    `${variant.shinyImage || `${displayName}.${variant.displayName}`}.shiny`.replace(' ', '_'),
                    `${variant.icon || displayName}`.replace(' ', '_')))
              : undefined)))
        .then(pokemon => loadedPokemon.set(pokemon));

      // Load Methods
      fetch(game.methodsFile)
        .then(response => response.json() as Promise<Method[]>)
        .then(array => array.map(({displayName, singularUnit, pluralUnit, odds}) =>
          new Method(displayName, singularUnit, pluralUnit, odds)))
        .then(methods => loadedMethods.set(methods));

      // Reset Shiny Charm if Unsupported
      if (!game.supportsShinyCharm) {
        shinyCharm.set(false);
      }
    }
    else {
      //  Clear Dependent Selections
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
      // Update Trackers & Selected Index
      const index = $trackers.length;
      $trackers = [...$trackers, new Tracker($selectedGame, $selectedPokemon, $selectedMethod, $shinyCharm)];
      selectedTrackerIndex.set(index);

      console.log($selectedGame);
      console.log($selectedPokemon);

      // Clear Selections
      selectedGame.set(undefined);
      selectedPokemon.set(undefined);
      selectedMethod.set(undefined);
      shinyCharm.set(false);
    }
  }
</script>

<!-- Selections -->
<div id='create-tracker'>
  <form id='selections'>
    <!-- Game Select -->
    <label for='game'>Game</label>
    <select class='selection' bind:value={$selectedGame} id='game'>
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
    <select class='selection' id='pokemon' bind:value={$selectedPokemon} disabled={$loadedPokemon.length <= 0}>
      <option selected style='display:none'/>
      {#each $loadedPokemon as pokemon}
        <option value={pokemon}>{pokemon.displayName}</option>
      {/each}
    </select>

    <!-- Method Select -->
    <label for='method'>Method</label>
    <select class='selection' id='method' bind:value={$selectedMethod} disabled={$loadedMethods.length <= 0}>
      <option selected style='display:none'/>
      {#each $loadedMethods as method}
        <option value={method}>{method.displayName}</option>
      {/each}
    </select>

    <!-- Shiny Charm Check -->
    <label for='shiny-charm'>Shiny Charm</label>
    <input class='selection' type='checkbox' id='shiny-charm' bind:checked={$shinyCharm} disabled={!$selectedGame?.supportsShinyCharm}/>
  </form>

  <button id='create' disabled={!($selectedGame && $selectedPokemon && $selectedMethod)} on:click={createTracker}>Create Tracker</button>
</div>

<style>
  #create-tracker {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    justify-items: center;
    align-items: center;
  }

  #selections {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    align-items: center;
    margin-bottom: 15px;
    width: fit-content;
  }

  #selections label {
    font-weight: bold;
  }

  #create {
    display: block;
  }

  .selection {
    justify-self: right;
  }
</style>