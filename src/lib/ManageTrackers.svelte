<script lang='ts'>
  import { showShinyForm, showNormalForm } from '$lib/utilities/HeaderMenu.svelte';
  import { base } from '$app/paths';
  import CreateTracker from '$lib/CreateTracker.svelte';
  import { trackers, hasTrackers, selectedIndex, selectedTracker } from '$lib/Tracker';
  import Counter from '$lib/Counter.svelte';

  function defaultImage(event: any, file: string) {
    if (event?.target) {
      event.target.src = file;
    }
  }

  function deleteTracker(index: number) {
    trackers.update(trackers => [...trackers.slice(0, index), ...trackers.slice(index + 1)]);

    if ($trackers.length > 0) {
      selectedIndex.set(index < $trackers.length ? index : Math.max(index - 1, 0));
    }
    else {
      selectedIndex.set(undefined);
    }
  }
</script>

<!-- Trackers -->
<div id='trackers'>

  <!-- Tabs -->
  {#if $hasTrackers}
    <form id='tabs'>
      {#each $trackers as tracker, index}
        <label class='tab{tracker === $selectedTracker ? ' selected' : ''}'>
          <input class='tab-input' name='tabs' type='radio' value={index} bind:group={$selectedIndex}>
          <img class='icon' src='{tracker.game.iconFolder}/{tracker.pokemon.icon}' alt='The icon for {$trackers[index].pokemon.displayName}' on:error={event => defaultImage(event, `${base}/icons/Default.png`)}/>
          {tracker.pokemon.displayName}
          <button class='close-tab' on:click={() => deleteTracker(index)}>×</button>
        </label>
      {/each}

      {#if $selectedTracker}
        <button id='new-tab' on:click={() => selectedIndex.set(undefined)}>+</button>
      {/if}
    </form>
  {/if}

  <!-- Selected Tracker -->
  <div id='selected-tracker' style='border-top-left-radius: {$hasTrackers ? '0' : '8'}px;'>
    {#if $selectedTracker}
      <h2>{$selectedTracker.pokemon.displayName}</h2>
      <h3>{$selectedTracker.game.displayName} - {$selectedTracker.method.displayName}</h3>
      {#if $selectedTracker.shinyCharm}
        <h4>Shiny Charm</h4>
      {/if}

      <!-- Sprites -->
      {#if $showShinyForm || $showNormalForm}
        <div id='sprites'>
          <!-- Shiny Form -->
          {#if $showShinyForm}
            <img class='sprite'
              src='{$selectedTracker.game.imageFolder}/{$selectedTracker.pokemon.shinyImage}'
              alt='The shiny sprite for {$selectedTracker.pokemon.displayName}'
              on:error={event => defaultImage(event, `${base}/images/Default.png`)}/>
          {/if}

          <!-- Normal Form -->
          {#if $showNormalForm}
            <img class='sprite'
              src='{$selectedTracker.game.imageFolder}/{$selectedTracker.pokemon.image}'
              alt='The sprite for {$selectedTracker.pokemon.displayName}'
              on:error={event => defaultImage(event, `${base}/images/Default.png`)}/>
          {/if}
        </div>
      {/if}

      <!-- Counter -->
      <Counter/>
    {:else}
      <CreateTracker/>
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

  /* Selected Tracker */
  #selected-tracker {
    background-color: var(--background-bright);
    padding: 10px;
    border-radius: 8px;
  }

  #selected-tracker * {
    display: flex;
    justify-content: space-around;
  }

  #sprites {
    justify-content: space-around;
    display: flex;
  }

  .sprite {
    width: 75%;
    padding: 15px;
  }

  .icon, .sprite {
    image-rendering: pixelated;
  }
</style>