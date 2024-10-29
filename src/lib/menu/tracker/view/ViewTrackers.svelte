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
  import SpriteDisplay from '$lib/menu/tracker/sprites/SpriteDisplay.svelte'
  import { CHAIN_HUNTING_METHODS } from '$lib/api/HuntingMethod'
  import type { GenerationalSprites, Sprites } from '$lib/api/SpritesResource'
  import Device from 'svelte-device-info'
  import PokemonDetails from '$lib/menu/tracker/view/PokemonDetails.svelte'

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
    history.update((history) => [...history, huntTracker])
    huntTrackers.update((huntTrackers) => [
      ...huntTrackers.slice(0, index),
      ...huntTrackers.slice(index + 1)
    ])
    selectedTrackerIndex.update((selectedTrackerIndex) => Math.max(selectedTrackerIndex - 1, 0))
  }

  function closeTracker(index: number, huntTracker: HuntTracker = $huntTrackers[index]) {
    if (confirm('Are you sure you want to close this shiny hunt?')) {
      deleteTracker(index, huntTracker)
    }
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
        method: createdHuntTracker.method,
        generation: createdHuntTracker.generation,
        versionGroup: createdHuntTracker.versionGroup,
        version: createdHuntTracker.version,
        pokemonSpecies: createdHuntTracker.pokemonSpecies.name,
        pokemon: createdHuntTracker.pokemon?.name,
        pokemonForm: createdHuntTracker.pokemonForm?.name,
        female: createdHuntTracker.female,
        complete: false
      }
    ])

    creatingTracker = false
  }

  function completeHunt(index: number, huntTracker: HuntTracker) {
    return () => {
      if (confirm('Are you sure you want to finish your shiny hunt?')) {
        huntTracker.complete = true
        deleteTracker(index, huntTracker)
      }
    }
  }

  function onTabKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
        selectedTrackerIndex.update((index) => (index + 1) % $huntTrackers.length)
        tabs[$selectedTrackerIndex]?.focus()
        break
      case 'ArrowLeft': {
        const length = $huntTrackers.length
        selectedTrackerIndex.update((index) => (((index - 1) % length) + length) % length)
        tabs[$selectedTrackerIndex]?.focus()
        break
      }
      case 'Delete': {
        const index = $selectedTrackerIndex
        closeTracker(index, $huntTrackers[index])
      }
    }
  }

  let tabs: HTMLElement[] = []
</script>

<div id="tabs">
  <div role="tablist" aria-label="Hunt Tracker Tabs">
    {#each $huntTrackers as huntTracker, index}
      <button
        id="tab-{index + 1}"
        role="tab"
        tabindex={index === $selectedTrackerIndex ? 0 : -1}
        aria-selected={index === $selectedTrackerIndex}
        aria-controls="tracker-{index + 1}"
        class:hoverable={Device.canHover}
        on:click={selectTracker(index)}
        on:keydown={(event) => onTabKeyPress(event)}
        bind:this={tabs[index]}
      >
        <span>{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}</span>
      </button>
    {/each}
  </div>
  {#if !creatingTracker}
    <button id="create-tracker" on:click={createTracker} class:hoverable={Device.canHover}
      >&plus;</button
    >
  {/if}
</div>

<div id="tracker-view">
  {#if creatingTracker}
    <CreateTracker {generations} created={onTrackerCreated} />
  {:else if $huntTrackers.length > 0}
    <button
      id="delete-tracker"
      on:click={() => closeTracker($selectedTrackerIndex)}
      class:hoverable={Device.canHover}>🗑</button
    >
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
              <th>Game</th>
              <th>Method</th>
              {#if huntTracker.generation >= 5}
                <th>Shiny Charm</th>
              {/if}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span>{formatVersionName(huntTracker.version)}</span></td>
              <td><span>{huntTracker.method}</span></td>
              {#if huntTracker.generation >= 5}
                <th>{(huntTracker.shinyCharm ?? false) ? 'Yes' : 'No'}</th>
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

        <TrackerCounter bind:huntTracker />

        <div>
          <button class="primary-button" on:click={completeHunt(index, huntTracker)}
            >Shiny Found</button
          >
        </div>
      </div>
    {/each}
  {:else}
    <span>You aren't tracking anything! Create a tracker to get started.</span>
  {/if}
</div>

<style>
  #tracker-view {
    background-color: var(--primary-medium);
    padding: var(--gap-length);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    height: 100%;
  }

  #tabs {
    background-color: var(--primary-darker);
    padding: var(--padding-length);
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    height: 38px;
  }

  [role='tablist'] {
    overflow: scroll;
  }

  #tabs,
  [role='tablist'] {
    display: flex;
    flex-direction: row;
    gap: var(--padding-length);
  }

  [role='tab'] {
    max-width: 130px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: var(--padding-length);
    justify-content: space-between;
    align-items: center;
    color: var(--font-color);
    border-radius: var(--border-radius);
    padding: var(--padding-length);
    cursor: pointer;
  }

  [role='tab'][aria-selected='true'] {
    background-color: var(--primary-medium);
  }

  [role='tab'][aria-selected='false'].hoverable {
    background: none;
  }

  [role='tab'][aria-selected='false'].hoverable:hover,
  [role='tab'][aria-selected='false']:not(.hoverable) {
    background-color: var(--primary-dark);
  }

  #create-tracker {
    color: var(--font-color);
    padding: calc(2 * var(--padding-length)) calc(3 * var(--padding-length));
  }

  #create-tracker.hoverable {
    background: none;
  }

  #create-tracker.hoverable:hover,
  #create-tracker:not(.hoverable) {
    background-color: var(--primary-dark);
  }

  #create-tracker:active:hover {
    background-color: var(--primary-medium);
  }

  [role='tabpanel'] {
    display: flex;
    flex-direction: column;
    gap: var(--padding-length);
  }

  [role='tabpanel'] > * {
    width: 100%;
    text-align: center;
  }

  .invisible {
    display: none;
  }

  .primary-button {
    font-size: 1.5em;
    font-weight: bold;
  }

  #delete-tracker {
    background: none;
    position: fixed;
    padding: 0;
    color: var(--font-color);
    font-size: 1.5em;
    width: 34px;
    text-align: center;
    @media (width > 1530px) {
      right: calc((100vw - 1500px) / 2 + var(--gap-length));
    }
    @media (width <= 1530px) {
      right: calc(2 * var(--gap-length));
    }
  }

  #delete-tracker.hoverable:hover,
  #delete-tracker:not(.hoverable) {
    background-color: var(--primary-dark);
  }
</style>
