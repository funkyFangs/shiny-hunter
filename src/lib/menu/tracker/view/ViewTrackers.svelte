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
  import Kebab from '$lib/menu/controls/Kebab.svelte'

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
    const confirmed = confirm('Are you sure you want to close this shiny hunt?')
    if (confirmed) {
      deleteTracker(index, huntTracker)
    }
    return confirmed
  }

  function closeTrackerFromMenu() {
    if (closeTracker($selectedTrackerIndex)) {
      kebabMenuOpen = false
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
        complete: false,
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
  let kebabMenuOpen = false
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

<div id="tracker-view" class:creating={creatingTracker}>
  {#if creatingTracker}
    <div>
      <CreateTracker {generations} created={onTrackerCreated} />
    </div>
  {:else if $huntTrackers.length > 0}
    {#snippet closeTrackerSnippet()}
      <button class="tracker-menu-control" on:click={closeTrackerFromMenu}>Close Tracker</button>
    {/snippet}
    {#snippet completeHuntSnippet()}
      <button class="tracker-menu-control" on:click={completeHunt}>Complete Hunt</button>
    {/snippet}

    <div id="tracker-menu">
      <Kebab
        bind:open={kebabMenuOpen}
        title="Tracker Menu"
        ariaControls="tracker-menu"
        menuControls={[closeTrackerSnippet, completeHuntSnippet]}
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
              <th scope="col">Game</th>
              <th scope="col">Method</th>
              {#if huntTracker.generation >= 5}
                <th scope="col">Shiny Charm</th>
              {/if}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span>{formatVersionName(huntTracker.version)}</span></td>
              <td><span>{huntTracker.method}</span></td>
              {#if huntTracker.generation >= 5}
                <td>{(huntTracker.shinyCharm ?? false) ? 'Yes' : 'No'}</td>
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
    display: grid;
    grid-auto-columns: min-content auto min-content;
  }

  #tracker-view > * {
    grid-column: 1 / 4;
    grid-row: 1;
  }

  #tabs {
    background-color: var(--primary-darker);
    padding: var(--padding-length);
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    min-height: 28px;
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

  #tracker-menu {
    grid-column: 3 / 4;
    height: 37px;
    z-index: 1;
  }

  .tracker-menu-control {
    background: none;
    width: 100%;
    padding: var(--gap-length);
    text-align: left;
  }
</style>
