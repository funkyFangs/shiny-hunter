<script lang="ts">
  import { flip } from 'svelte/animate'
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource.js'
  import { formatVersionName } from '$lib/api/VersionResource.js'
  import { type CreatedHuntTracker } from '$lib/api/HuntTracker.js'
  import type { HuntTracker } from '$lib/api/HuntTracker.js'
  import type { Generation } from '$lib/api/GenerationResource'
  import CreateTracker from '$lib/menu/tracker/create/CreateTracker.svelte'
  import type { Writable } from 'svelte/store'
  import TrackerCounter from '$lib/menu/tracker/counters/TrackerCounter.svelte'
  import type { SpritePreference } from '$lib/menu/SpritePreference'
  import SpriteDisplay from '$lib/menu/tracker/view/sprites/SpriteDisplay.svelte'
  import Device from 'svelte-device-info'
  import PokemonDetails from '$lib/menu/tracker/view/PokemonDetails.svelte'
  import { focusTab, moveHuntTracker, newHuntTracker } from '$lib/menu/tracker/view/ViewTrackers'
  import { buildSpriteMap, type SpriteMap } from '$lib/menu/tracker/view/sprites/SpriteDisplay'

  export let huntTrackers: Writable<HuntTracker[]>
  export let history: Writable<HuntTracker[]>
  export let selectedTrackerIndex: Writable<number>
  export let nextId: Writable<number>
  export let generations: Generation[] = []
  export let spritePreference: SpritePreference
  export let showNormal: boolean
  export let promptOnClose: boolean
  export let keepHistory: boolean
  export let showFraction: boolean
  export let showPercentage: boolean

  const sprites: SpriteMap = buildSpriteMap(generations)
  let creatingTracker: boolean = false

  function selectTracker(index: number) {
    return () => {
      selectedTrackerIndex.set(index)
      creatingTracker = false
    }
  }

  function closeTracker(index: number, huntTracker: HuntTracker = $huntTrackers[index]) {
    const confirmed = !promptOnClose || confirm('Are you sure you want to close this shiny hunt?')
    if (confirmed) {
      const currentSelectedTrackerIndex = $selectedTrackerIndex
      const currentSelectedTracker = $huntTrackers[currentSelectedTrackerIndex]

      huntTrackers.update((huntTrackers) => [
        ...huntTrackers.slice(0, index),
        ...huntTrackers.slice(index + 1)
      ])

      selectedTrackerIndex.set(
        index === currentSelectedTrackerIndex
          ? Math.max(index - 1, 0)
          : $huntTrackers.indexOf(currentSelectedTracker)
      )

      if (keepHistory) {
        history.update((history) => [
          ...history,
          {
            ...huntTracker,
            endDate: new Date().toISOString()
          }
        ])
      }
    }
    return confirmed
  }

  function closeTrackerFromButton(event: MouseEvent, index: number) {
    event.stopPropagation()
    closeTracker(index)
  }

  function createTracker() {
    creatingTracker = true
    selectedTrackerIndex.set($huntTrackers.length)
  }

  function onTrackerCreated(createdHuntTracker: CreatedHuntTracker) {
    const generation = generations.find((generation) =>
      generation.pokemonSpecies.some(
        (pokemonSpecies) => pokemonSpecies.name === createdHuntTracker.pokemonSpecies.name
      )
    )!
    generation.pokemonSpecies[
      generation.pokemonSpecies.findIndex(
        (pokemonSpecies) => pokemonSpecies.name === createdHuntTracker.pokemonSpecies.name
      )
    ] = createdHuntTracker.pokemonSpecies
    sprites[createdHuntTracker.pokemonSpecies.name] = Object.fromEntries(
      createdHuntTracker.pokemonSpecies.varieties!.map((pokemon) => [
        pokemon.name,
        {
          sprites: pokemon.sprites,
          forms: Object.fromEntries(pokemon.forms.map((form) => [form.name, form.sprites]))
        }
      ])
    )

    huntTrackers.update((huntTrackers) => [
      ...huntTrackers,
      newHuntTracker(createdHuntTracker, nextId)
    ])

    creatingTracker = false
  }

  function onTabKeyPress(event: KeyboardEvent) {
    const currentSelectedTrackerIndex = $selectedTrackerIndex
    switch (event.key) {
      case 'ArrowRight':
        focusTab((currentSelectedTrackerIndex + 1) % tabs.length, selectedTrackerIndex, tabs)
        break
      case 'ArrowLeft': {
        const length = tabs.length
        focusTab(
          (((currentSelectedTrackerIndex - 1) % length) + length) % length,
          selectedTrackerIndex,
          tabs
        )
        break
      }
      case 'Home':
        if (currentSelectedTrackerIndex !== 0) {
          focusTab(0, selectedTrackerIndex, tabs)
        }
        break
      case 'End':
        if (currentSelectedTrackerIndex !== tabs.length - 1) {
          focusTab(tabs.length - 1, selectedTrackerIndex, tabs)
        }
        break
      case 'Delete':
        closeTracker(currentSelectedTrackerIndex)
    }
  }

  function onTabDragStart(event: DragEvent, target: number) {
    const dataTransfer = event.dataTransfer!

    dataTransfer.setData('text/plain', target.toString())
    dataTransfer.dropEffect = 'move'
  }

  function onTabDragOver(event: DragEvent) {
    event.preventDefault()
  }

  function onTabDrop(event: DragEvent) {
    event.preventDefault()

    const clientX = event.x
    const leftIndex = tabs
      .map((tab) => tab.getBoundingClientRect())
      .findLastIndex((box) => box.x + box.width / 2 <= clientX)
    const startIndex = parseInt(event.dataTransfer!.getData('text/plain'))
    const lastIndex = tabs.length - 1

    const selectedHuntTracker = $huntTrackers[$selectedTrackerIndex]

    if (startIndex !== leftIndex && startIndex !== leftIndex + 1) {
      huntTrackers.update((huntTrackers) =>
        moveHuntTracker(huntTrackers, leftIndex, startIndex, lastIndex)
      )
      selectedTrackerIndex.set($huntTrackers.indexOf(selectedHuntTracker))
    }
  }

  let tabs: HTMLElement[] = []
</script>

<div id="tabs-container">
  <div
    role="tablist"
    aria-label="Hunt Tracker Tabs"
    tabindex={-1}
    ondragover={onTabDragOver}
    ondrop={onTabDrop}
  >
    {#each $huntTrackers as huntTracker, index (huntTracker.id)}
      {@const id = huntTracker.id}

      <div
        id="tab-{id}"
        tabindex={index === $selectedTrackerIndex ? 0 : -1}
        role="tab"
        aria-selected={index === $selectedTrackerIndex}
        aria-controls="tracker-{id}"
        draggable="true"
        animate:flip={{ duration: 200 }}
        class:hoverable={Device.canHover}
        onclick={selectTracker(index)}
        onkeydown={onTabKeyPress}
        ondragstart={(event) => onTabDragStart(event, index)}
        bind:this={tabs[index]}
      >
        <span class="unselectable">{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}</span>
        <button
          class="close-tracker-button"
          class:hoverable={Device.canHover}
          onclick={(event) => closeTrackerFromButton(event, index)}>&times;</button
        >
      </div>
    {/each}
  </div>
  {#if !creatingTracker}
    <button
      id="create-tracker"
      onclick={createTracker}
      class:hoverable={Device.canHover}
      aria-label="Create New Tracker"
      class="unselectable">&plus;</button
    >
  {/if}
</div>

<div id="tracker-view" class:creating={creatingTracker}>
  {#if creatingTracker}
    <div>
      <CreateTracker {generations} created={onTrackerCreated} />
    </div>
  {:else if $huntTrackers.length > 0}
    {#each $huntTrackers as huntTracker, index (huntTracker.id)}
      {@const id = huntTracker.id}

      <div
        id="tracker-{id}"
        role="tabpanel"
        aria-labelledby="tab-{id}"
        class:invisible={index !== $selectedTrackerIndex}
      >
        <PokemonDetails {huntTracker} />

        <table>
          <thead>
            <tr>
              <th scope="col"><label for="game-{id}">Game</label></th>
              <th scope="col"><label for="method-{id}">Method</label></th>
              {#if huntTracker.generation >= 5}
                <th scope="col"><label for="shiny-charm-{id}">Shiny Charm</label></th>
              {/if}
              {#if huntTracker.lure !== undefined}
                <th scope="col"><label for="lure-{id}">Lure</label></th>
              {/if}
              {#if huntTracker.isMassive !== undefined}
                <th scope="col"><label for="lure-{id}">Is Massive</label></th>
              {/if}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span id="game-{id}">{formatVersionName(huntTracker.version)}</span></td>
              <td><span id="method-{id}">{huntTracker.method}</span></td>
              {#if huntTracker.generation >= 5}
                <td
                  ><span id="shiny-charm-{id}"
                    >{(huntTracker.shinyCharm ?? false) ? 'Yes' : 'No'}</span
                  ></td
                >
              {/if}
              {#if huntTracker.lure !== undefined}
                <td><span id="lure={id}">{huntTracker.lure ? 'Yes' : 'No'}</span></td>
              {/if}
              {#if huntTracker.isMassive !== undefined}
                <td>
                  <span id="is-massive-{id}">{huntTracker.isMassive ? 'Yes' : 'No'}</span>
                </td>
              {/if}
            </tr>
          </tbody>
        </table>

        <SpriteDisplay
          {huntTracker}
          sprites={sprites[huntTracker.pokemonSpecies]}
          {spritePreference}
          {showNormal}
        />

        <TrackerCounter bind:huntTracker {showFraction} {showPercentage} />
      </div>
    {/each}
  {:else}
    <span id="notice">You aren't tracking anything! Create a tracker to get started.</span>
  {/if}
</div>

<style lang="css">
  #tracker-view {
    background-color: var(--color-indigo-600);
    padding: var(--l-gap);
    border-radius: 0 0 var(--default-border-radius) var(--default-border-radius);
    display: grid;
    grid-auto-columns: min-content auto min-content;

    > * {
      grid-column: 1 / 4;
      grid-row: 1;
    }
  }

  #tabs-container {
    background-color: var(--color-shark);
    padding: var(--default-padding);
    border-radius: var(--default-border-radius) var(--default-border-radius) 0 0;
    min-height: 38px;
  }

  [role='tablist'] {
    flex: 1;
    overflow: scroll;
  }

  #tabs-container,
  [role='tablist'] {
    display: flex;
    flex-direction: row;
    gap: var(--default-padding);
  }

  [role='tabpanel'] {
    display: flex;
    flex-direction: column;
    gap: var(--default-padding);

    > * {
      width: 100%;
      text-align: center;
    }
  }

  [role='tab'] {
    max-width: 130px;
    min-width: 90px;
    color: whitesmoke;
    border-radius: var(--default-border-radius);
    padding: var(--default-padding);
    cursor: pointer;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    flex: 1 28px;
    gap: var(--default-padding);
    transition-property: background-color;
    transition-duration: var(--default-transition-duration);
    transition-timing-function: var(--default-transition-timing-function);

    > span {
      overflow: hidden;
      text-wrap: nowrap;
    }

    &[aria-selected='false'] {
      /* Display tab background on hover or if the device cannot hover */
      &.hoverable {
        background: none;
      }

      &.hoverable:hover,
      &:not(.hoverable) {
        background-color: var(--color-asparagus-800);
        color: whitesmoke;
      }

      /* Display close tab button background on hover or if the device cannot hover */
      > .close-tracker-button {
        color: whitesmoke;

        &.hoverable:hover:not(:active),
        &:not(.hoverable) {
          background-color: var(--color-asparagus-700);
        }

        &:active {
          background-color: var(--color-asparagus-600);
        }
      }
    }

    &[aria-selected='true'] {
      background-color: var(--color-asparagus-600);
      color: whitesmoke;

      > .close-tracker-button {
        color: whitesmoke;

        &.hoverable:hover:not(:active),
        &:not(.hoverable) {
          background-color: var(--color-asparagus-600);
        }

        &:active {
          background-color: var(--color-asparagus-500);
        }
      }
    }
  }

  #create-tracker {
    font-size: 25px;
    min-width: 38px;
    min-height: 38px;

    &.hoverable:hover:not(:active),
    &:not(.hoverable) {
      background-color: var(--color-asparagus-700);
      color: whitesmoke;
    }

    &:active {
      background-color: var(--color-asparagus-600);
    }
  }

  .close-tracker-button {
    font-size: 20.5px;
    min-width: 28px;
    min-height: 28px;
  }

  #create-tracker,
  .close-tracker-button {
    background: none;
    color: whitesmoke;
    text-align: center;
    border-radius: var(--default-border-radius);
    padding: 0;
  }

  .invisible {
    display: none;
  }

  #notice {
    color: whitesmoke;
  }
</style>
