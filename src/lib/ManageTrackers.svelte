<script lang="ts">
  import { base } from "$app/paths";
  import CreateTracker from "$lib/CreateTracker.svelte";
  import {
    trackers,
    hasTrackers,
    selectedTrackerIndex,
    selectedTracker,
  } from "$lib/Tracker";
  import Counter from "$lib/Counter.svelte";
  import Sprites from "$lib/Sprites.svelte";
  import { defaultImage } from "$lib/utilities/SpriteUtilities";
  import Device from "svelte-device-info";

  function deleteTracker(index: number) {
    trackers.update((trackers) => [
      ...trackers.slice(0, index),
      ...trackers.slice(index + 1),
    ]);

    if ($trackers.length > 0) {
      selectedTrackerIndex.set(
        index < $trackers.length ? index : Math.max(index - 1, 0),
      );
    } else {
      selectedTrackerIndex.set(undefined);
    }
  }

  const DEFAULT_ICON = `${base}/icons/Default.gif`;
</script>

<!-- Tabs -->
{#if $hasTrackers}
  <form id="tabs">
    {#each $trackers as tracker, index}
      <label class="tab" class:selected={tracker === $selectedTracker}>
        <input
          class="tab-input"
          name="tabs"
          type="radio"
          value={index}
          bind:group={$selectedTrackerIndex}
        />
        <img
          class="icon"
          src="{tracker.game.iconFolder}/{tracker.pokemon.variants?.length &&
          tracker.selectedVariant !== undefined
            ? tracker.pokemon.variants[tracker.selectedVariant].icon
            : tracker.pokemon.icon}.{tracker.game.imageExtension}"
          alt="The icon for {$trackers[index].pokemon.displayName}"
          on:error={(event) => defaultImage(event, DEFAULT_ICON)}
        />
        {tracker.pokemon.displayName}
        <button
          class="close-tab"
          class:transparent={Device.canHover}
          on:click={() => deleteTracker(index)}>×</button
        >
      </label>
    {/each}
    {#if $selectedTracker}
      <button
        id="new-tab"
        class:transparent={Device.canHover}
        on:click={() => selectedTrackerIndex.set(undefined)}>+</button
      >
    {/if}
  </form>
{/if}

<!-- Selected Tracker -->
<div
  id="selected-tracker"
  style:border-top-left-radius={$hasTrackers ? "0" : "8px"}
>
  {#if $selectedTracker}
    <h2>{$selectedTracker.pokemon.displayName}</h2>
    <h3>
      {$selectedTracker.game.displayName} - {$selectedTracker.method
        .displayName}
    </h3>
    {#if $selectedTracker.shinyCharm}
      <h4>Shiny Charm</h4>
    {/if}
    <Sprites />
    <Counter />
  {:else}
    <CreateTracker />
  {/if}
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

  #tabs {
    overflow: scroll;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    width: calc(100% - 8px);
  }

  .tab-input {
    display: none;
  }

  .close-tab {
    background: none;
    color: var(--main);
    padding: 5px;
    margin: 0;
    transition-duration: 0.125s;
    transition-property: opacity;
  }

  #tabs:hover #new-tab {
    opacity: 100%;
  }

  .tab:hover .close-tab {
    opacity: 100%;
  }

  .transparent {
    opacity: 0%;
  }

  /* Tab Selection */
  .icon {
    margin: 0;
    margin-right: 3px;
    max-height: 14px;
    padding: 0px;
  }

  .tab:first-of-type .icon {
    margin-left: 4.38333px;
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
    transition-property: opacity;
    transition-duration: 0.125s;
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

  .icon {
    image-rendering: pixelated;
  }
</style>
