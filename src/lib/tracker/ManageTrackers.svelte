<script context='module' lang='ts'>
  import { browser } from '$app/environment';
  import { localWritable } from '$lib/utilities/StoreUtilities';
  import { Tracker } from '$lib/tracker/Tracker';

  export const trackers = localWritable<Tracker[]>('trackers', browser && localStorage['trackers']
    ? JSON.parse(localStorage['trackers']) : []);
</script>

<script lang='ts'>
  import GameSelect, { selectedGame } from '$lib/games/GameSelect.svelte';
  import PokemonSelect, { selectedPokemon } from '$lib/pokemon/PokemonSelect.svelte';
  import MethodSelect, { selectedMethod } from '$lib/methods/MethodSelect.svelte';
  import { derived } from 'svelte/store';

  const hasTrackers = derived(trackers, trackers => trackers.length > 0);

  function createTracker() {
    const tracker = new Tracker($selectedGame!, $selectedPokemon!, $selectedMethod!);
    trackers.update(trackers => [...trackers, tracker]);
    selectedTracker = tracker
    selectedGame.set(undefined);
    selectedPokemon.set(undefined);
    selectedMethod.set(undefined);
  }

  const deleteTracker = (index: number) => () => {
    trackers.update(trackers => [...trackers.slice(0, index), ...trackers.slice(index + 1)]);
    selectedTracker = $trackers.length > 0 ? $trackers[0] : undefined;
  }

  let selectedTracker: Tracker | undefined = $trackers.length > 0 ? $trackers[0] : undefined;
</script>

<div id='trackers'>
  {#if $hasTrackers}
    <form id='tabs'>
      {#each $trackers as tracker, index}
        <label class='tab{tracker === selectedTracker ? ' selected' : ''}'>
          <input class='tab-input' name='tabs' type='radio' value={tracker} bind:group={selectedTracker}>
          {tracker.pokemon.displayName} ({tracker.game.displayName})
          <button class='close-tab' on:click={deleteTracker(index)}>×</button>
        </label>
      {/each}
      {#if selectedTracker}
        <button id='new-tab' on:click={() => selectedTracker = undefined}>+</button>
      {/if}
    </form>
  {/if}

  <div id='selected-tracker' style='border-top-left-radius: {$hasTrackers ? '0' : '8'}px;'>
    {#if selectedTracker}
      <img class='sprite' src={selectedTracker.game.imageFolder + '/' + selectedTracker.pokemon.shinyImage} alt='The shiny sprite for {selectedTracker.pokemon.displayName}'/>
      <div id='counter'>
        <div id='count-label'>
          <input id='count-input' type='number' min={0} bind:value={selectedTracker.count}/>
          <label for='count-input'>{selectedTracker.count == 1 ? selectedTracker.method.singularUnit : selectedTracker.method.pluralUnit}</label>
        </div>
        <button style='margin-right: 5px'>+</button><button>−</button>
      </div>
    {:else}
      <form id='create-tracker'>
        <GameSelect/>
        <PokemonSelect/>
        <MethodSelect/>
        <button disabled={!($selectedGame && $selectedPokemon && $selectedMethod)} on:click={createTracker}>Create Tracker</button>
      </form>
    {/if}
  </div>
</div>

<style>
  #new-tab {
    padding: 5px;
    background: none;
    color: var(--main);
  }

  #counter {
    font-size: 40px;
  }

  #counter button {
    padding: 10px;
    margin: 0px;
    background-color: var(--background);
    color: var(--main);
    display: inline;
  }

  #count-input {
    padding: 0;
    appearance: textfield;
    background: none;
    width: fit-content;
    size-adjust: unset;
    display: inline-block;
  }

  .tab ~ .tab {
    margin-left: 3px;
  }

  .tab {
    background-color: var(--background-dim);
    padding: 5px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .tab.selected {
    background-color: var(--background-bright);
  }

  .tab:hover {
    background-color: var(--background-bright);
    transition: 0.2s;
    cursor: pointer;
  }

  .tab-input {
    opacity: 0;
    height: 0;
    width: 0;
    padding: 0px;
    margin: 0px;
    border: 0px;
  }

  .close-tab {
    background: none;
    color: var(--main);
    margin: 0;
    padding: 5px;
  }

  #selected-tracker {
    background-color: var(--background-bright);
    padding: 10px;
    border-radius: 8px;
  }

  #count-label * {
    width: 50%;
  }

  .sprite {
    image-rendering: pixelated;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%
  }
</style>