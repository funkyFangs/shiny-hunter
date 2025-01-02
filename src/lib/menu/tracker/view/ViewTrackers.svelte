<script lang="ts">
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
  import { CHAIN_HUNTING_METHODS } from '$lib/api/HuntingMethod'
  import type { GenerationalSprites, Sprites } from '$lib/api/SpritesResource'
  import Device from 'svelte-device-info'
  import PokemonDetails from '$lib/menu/tracker/view/PokemonDetails.svelte'
  import Kebab from '$lib/menu/controls/Kebab.svelte'
  import { focusTab, moveHuntTracker } from '$lib/menu/tracker/view/ViewTrackers'

  export let huntTrackers: Writable<HuntTracker[]>
  export let history: Writable<HuntTracker[]>
  export let selectedTrackerIndex: Writable<number>
  export let spritePreference: SpritePreference
  export let showNormal: boolean
  export let generations: Generation[] = []

  const sprites: {
    [pokemonSpeciesName: string]: {
      [pokemonName: string]: {
        sprites: GenerationalSprites
        forms: {
          [formName: string]: Sprites
        }
      }
    }
  } = Object.fromEntries(
    generations
      .flatMap((generation) => generation.pokemonSpecies)
      .filter((pokemonSpecies) => pokemonSpecies.varieties)
      .map((pokemonSpecies) => [
        pokemonSpecies.name,
        Object.fromEntries(
          pokemonSpecies.varieties!.map((pokemon) => [
            pokemon.name,
            {
              sprites: pokemon.sprites,
              forms: Object.fromEntries(pokemon.forms.map((form) => [form.name, form.sprites]))
            }
          ])
        )
      ])
  )

  let creatingTracker: boolean = false

  function selectTracker(index: number) {
    return () => {
      selectedTrackerIndex.set(index)
      creatingTracker = false
    }
  }

  function deleteTracker(index: number, huntTracker: HuntTracker) {
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

    history.update((history) => [
      ...history,
      {
        ...huntTracker,
        endDate: new Date().toISOString()
      }
    ])
  }

  function closeTracker(index: number, huntTracker: HuntTracker = $huntTrackers[index]) {
    const confirmed = confirm('Are you sure you want to close this shiny hunt?')
    if (confirmed) {
      deleteTracker(index, huntTracker)
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
      {
        count: 0,
        chain: CHAIN_HUNTING_METHODS.has(createdHuntTracker.method)
          ? {
              current: 0,
              max: 0
            }
          : undefined,
        complete: false,
        startDate: new Date().toISOString(),
        method: createdHuntTracker.method,
        generation: createdHuntTracker.generation,
        versionGroup: createdHuntTracker.versionGroup,
        version: createdHuntTracker.version,
        shinyCharm: createdHuntTracker.shinyCharm,
        pokemonSpecies: createdHuntTracker.pokemonSpecies.name,
        pokemon:
          createdHuntTracker.pokemon?.name === createdHuntTracker.pokemonSpecies.name
            ? undefined
            : createdHuntTracker.pokemon?.name,
        pokemonForm:
          createdHuntTracker.pokemonForm?.name === createdHuntTracker.pokemon?.name
            ? undefined
            : createdHuntTracker.pokemonForm?.name,
        female: createdHuntTracker.female
      }
    ])

    creatingTracker = false
  }

  function completeHunt() {
    if (confirm('Are you sure you want to finish your shiny hunt?')) {
      const index = $selectedTrackerIndex
      const huntTracker = $huntTrackers[index]
      huntTracker.complete = true
      deleteTracker(index, huntTracker)
      kebabMenuOpen = false
    }
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
  let kebabMenuOpen = false
</script>

<div id="tabs-container">
  <div
    role="tablist"
    aria-label="Hunt Tracker Tabs"
    tabindex={-1}
    on:dragover={onTabDragOver}
    on:drop={onTabDrop}
  >
    {#each $huntTrackers as huntTracker, index}
      <div
        id="tab-{index + 1}"
        tabindex={index === $selectedTrackerIndex ? 0 : -1}
        role="tab"
        aria-selected={index === $selectedTrackerIndex}
        aria-controls="tracker-{index + 1}"
        draggable="true"
        class:hoverable={Device.canHover}
        on:click={selectTracker(index)}
        on:keydown={onTabKeyPress}
        on:dragstart={(event) => onTabDragStart(event, index)}
        bind:this={tabs[index]}
      >
        <span class="unselectable">{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}</span>
        <button
          class="close-tracker-button"
          class:hoverable={Device.canHover}
          on:click={(event) => closeTrackerFromButton(event, index)}>&times;</button
        >
      </div>
    {/each}
  </div>
  {#if !creatingTracker}
    <button
      id="create-tracker"
      on:click={createTracker}
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
    {#snippet completeHuntSnippet()}
      <button class="tracker-menu-control" on:click={completeHunt}>Complete Hunt</button>
    {/snippet}

    <div id="tracker-menu">
      <Kebab
        bind:open={kebabMenuOpen}
        title="Tracker Menu"
        ariaLabel="The button to open a menu of controls for managing this hunt tracker"
        ariaControls="tracker-menu"
        menuControls={[completeHuntSnippet]}
      />
    </div>

    {#each $huntTrackers as huntTracker, index}
      <div
        id="tracker-{index + 1}"
        role="tabpanel"
        aria-labelledby="tab-{index + 1}"
        class:invisible={index !== $selectedTrackerIndex}
      >
        <PokemonDetails {huntTracker} />

        <table>
          <thead>
            <tr>
              <th scope="col"><label for="game-{index}">Game</label></th>
              <th scope="col"><label for="method-{index}">Method</label></th>
              {#if huntTracker.generation >= 5}
                <th scope="col"><label for="shiny-charm-{index}">Shiny Charm</label></th>
              {/if}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span id="game-{index}">{formatVersionName(huntTracker.version)}</span></td>
              <td><span id="method-{index}">{huntTracker.method}</span></td>
              {#if huntTracker.generation >= 5}
                <td
                  ><span id="shiny-charm-{index}"
                    >{(huntTracker.shinyCharm ?? false) ? 'Yes' : 'No'}</span
                  ></td
                >
              {/if}
            </tr>
          </tbody>
        </table>

        <SpriteDisplay
          {index}
          {huntTracker}
          sprites={sprites[huntTracker.pokemonSpecies]}
          {spritePreference}
          {showNormal}
        />

        <TrackerCounter {index} bind:huntTracker />
      </div>
    {/each}
  {:else}
    <span id="notice">You aren't tracking anything! Create a tracker to get started.</span>
  {/if}
</div>

<style lang="less">
  @import '../../../../style/animation';
  @import '../../../../style/palette';
  @import '../../../../style/positioning';

  #tracker-view {
    background-color: @dark-indigo;
    padding: @gap-length;
    border-radius: 0 0 @border-radius @border-radius;
    display: grid;
    grid-auto-columns: min-content auto min-content;

    > * {
      grid-column: 1 / 4;
      grid-row: 1;
    }
  }

  #tabs-container {
    background-color: @shark;
    padding: @padding-length;
    border-radius: @border-radius @border-radius 0 0;
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
    gap: @padding-length;
  }

  [role='tabpanel'] {
    display: flex;
    flex-direction: column;
    gap: @padding-length;

    > * {
      width: 100%;
      text-align: center;
    }
  }

  #tracker-menu {
    grid-column: 3 / 4;
    height: 37px;
    z-index: 1;
  }

  .tracker-menu-control {
    background: none;
    width: 100%;
    padding: @gap-length;
    text-align: left;
  }

  [role='tab'] {
    max-width: 130px;
    min-width: 90px;
    color: white;
    border-radius: @border-radius;
    padding: @padding-length;
    cursor: pointer;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    flex: 1 28px;
    gap: @padding-length;
    transition-property: background-color;
    transition-duration: @transition-duration;
    transition-timing-function: @transition-timing-function;

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
        background-color: @darkest-asparagus;
        color: contrast($background-color);
      }

      /* Display close tab button background on hover or if the device cannot hover */
      > .close-tracker-button {
        &.hoverable:hover:not(:active),
        &:not(.hoverable) {
          background-color: @darker-asparagus;
          color: contrast($background-color);
        }

        &:active {
          background-color: @dark-asparagus;
          color: contrast($background-color);
        }
      }
    }

    &[aria-selected='true'] {
      background-color: @dark-asparagus;
      color: contrast($background-color);

      > .close-tracker-button {
        &.hoverable:hover:not(:active),
        &:not(.hoverable) {
          background-color: darken(@asparagus, 5%);
          color: contrast($background-color);
        }

        &:active {
          background-color: @asparagus;
          color: contrast($background-color);
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
      background-color: @darker-asparagus;
      color: contrast($background-color);
    }

    &:active {
      background-color: @dark-asparagus;
      color: contrast($background-color);
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
    color: white;
    text-align: center;
    border-radius: @border-radius;
    padding: 0;
  }

  .invisible {
    display: none;
  }

  #notice {
    color: white;
  }
</style>
