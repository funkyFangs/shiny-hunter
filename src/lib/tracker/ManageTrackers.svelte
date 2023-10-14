<script context='module' lang='ts'>
  import { localWritable } from '$lib/utilities/StoreUtilities';
  import { Tracker } from '$lib/tracker/Tracker';

  export const trackers = localWritable<Tracker[]>('trackers', []);
</script>

<script lang='ts'>
  import GameSelect, { selectedGame } from '$lib/games/GameSelect.svelte';
  import PokemonSelect, { selectedPokemon } from '$lib/pokemon/PokemonSelect.svelte';
  import MethodSelect, { selectedMethod } from '$lib/methods/MethodSelect.svelte';
  import ShinyCharmCheck, { shinyCharm } from '$lib/tracker/ShinyCharmCheck.svelte';
  import { showShinyForm, showNormalForm } from '$lib/utilities/HeaderMenu.svelte';
  import { derived } from 'svelte/store';
  import { base } from '$app/paths';

  const hasTrackers = derived(trackers, trackers => trackers.length > 0);

  let selectedTracker: Tracker | undefined = $hasTrackers ? $trackers[0] : undefined;

  function createTracker() {
    const tracker = new Tracker($selectedGame!, $selectedPokemon!, $selectedMethod!, $shinyCharm);
    trackers.update(trackers => [...trackers, tracker]);
    selectedTracker = tracker
    selectedGame.set(undefined);
    selectedPokemon.set(undefined);
    selectedMethod.set(undefined);
  }

  const deleteTracker = (index: number) => () => {
    trackers.update(trackers => [...trackers.slice(0, index), ...trackers.slice(index + 1)]);
    selectedTracker = $hasTrackers ? $trackers[index - 1] : undefined;
  }

  function increment() {
    selectedTracker!.count += 1;
    trackers.set($trackers);
  }

  function decrement() {
    selectedTracker!.count = Math.max(selectedTracker!.count - 1, 0);
    trackers.set($trackers);
  }

  function set(value: number) {
    selectedTracker!.count = value;
    trackers.set($trackers);
  }

  const defaultImage = (file: string) => (event: any) => {
    if (event?.target) {
      event.target.src = file;
    }
  }
</script>

<div id='trackers'>
  {#if $hasTrackers}
    <form id='tabs'>
      {#each $trackers as tracker, index}
        <label class='tab{tracker === selectedTracker ? ' selected' : ''}'>
          <input class='tab-input' name='tabs' type='radio' value={tracker} bind:group={selectedTracker}>
          <img class='icon' src='{tracker.game.iconFolder}/{tracker.pokemon.icon}' on:error={defaultImage(`${base}/icons/Default.png`)}/>
          {tracker.pokemon.displayName}
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
      {#if $showShinyForm || $showNormalForm}
      <div id='sprites'>
        {#if $showShinyForm}
          <img class='sprite' src='{selectedTracker.game.imageFolder}/{selectedTracker.pokemon.shinyImage}' alt='The shiny sprite for {selectedTracker.pokemon.displayName}' on:error={defaultImage(`${base}/images/Default.png`)}/>
        {/if}
        {#if $showNormalForm}
          <img class='sprite' src='{selectedTracker.game.imageFolder}/{selectedTracker.pokemon.image}' alt='The sprite for {selectedTracker.pokemon.displayName}' on:error={defaultImage(`${base}/images/Default.png`)}/>
        {/if}
      </div>
      {/if}
      <div id='counter'>
        <div id='count'>
          <label id='count'>
            <input id='count-input' type='number' min={0} value={selectedTracker.count} on:change={event => set(Number(event.currentTarget.value))}/>
            {selectedTracker.count == 1 ? selectedTracker.method.singularUnit : selectedTracker.method.pluralUnit}
          </label>
        </div>
        <div id='odds'>
          {(selectedTracker.method.odds[Math.max(0, Math.min(selectedTracker.count, selectedTracker.method.odds.length - 1))] * (selectedTracker.shinyCharm ? 3 : 1)).toFixed(3)}% Chance
        </div>
        <div id='controls'>
          <button id='increment' on:click={increment}>+</button>
          <button id='reset' on:click={() => set(0)}>Reset</button>
          <button id='decrement' on:click={decrement}>−</button>
        </div>
      </div>
    {:else}
      <form id='create-tracker'>
        <GameSelect/>
        <PokemonSelect/>
        <MethodSelect/>
        <ShinyCharmCheck/>
        <button disabled={!($selectedGame && $selectedPokemon && $selectedMethod)} on:click={createTracker}>Create Tracker</button>
      </form>
    {/if}
  </div>
</div>

<style>
  /* Tabs */
  .tab {
    background-color: var(--background-dim);
    padding: 5px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    justify-content: space-evenly;
  }

  .tab * {
    display: inline-flex;
  }

  .tab-input {
    display: none;
  }

  .close-tab {
    background: none;
    color: var(--main);
    margin: 0;
    padding: 5px;
  }

  /* Tab Selection */
  .icon {
    margin-right: 5px;
    max-height: 14px;
    padding: 0px;
  }

  .tab:first-of-type .icon {
    margin-left: 3px;
  }

  .tab.selected {
    background-color: var(--background-bright);
  }

  .tab:hover {
    background-color: var(--background-bright);
    transition: 0.2s;
    cursor: pointer;
  }

  /* Tab Separation */
  .tab ~ .tab {
    margin-left: 3px;
  }

  /* New Tab */
  #new-tab {
    padding: 5px;
    background: none;
    color: var(--main);
  }

  #create-tracker button {
    display: block;
    margin-top: 10px;
  }

  /* Selected Tracker */
  #selected-tracker {
    background-color: var(--background-bright);
    padding: 10px;
    border-radius: 8px;
  }

  #sprites {
    justify-content: space-around;
    display: flex;
  }

  .sprite {
    width: 75%;
  }

  .icon, .sprite {
    image-rendering: pixelated;
  }

  /* Tracker Counter */
  #counter {
    font-size: 40px;
  }

  #counter * ~ * {
    margin-top: 10px;
  }

  #count {
    display: flex;
    justify-content: space-around;
  }

  #count input {
    padding: 0;
    appearance: textfield;
    background: none;
    text-align: center;
    width: 150px;
    font-weight: 600;
    margin-right: 10px;
  }
  
  #count input:focus {
    background-color: var(--background);
  }

  #odds {
    text-align: center;
  }

  #controls {
    display: flex;
  }

  #controls button {
    padding: 10px;
    margin: 0px;
    background-color: var(--background-dim);
    color: var(--main);
    display: inline;
  }

  #controls button:hover {
    background-color: var(--background);
  }

  #controls button ~ button {
    margin-left: 10px;
  }

  #increment, #decrement {
    width: 42.5%;
  }

  #reset {
    width: 15%;
  }
</style>