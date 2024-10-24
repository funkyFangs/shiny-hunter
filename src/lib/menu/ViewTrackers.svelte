<script lang="ts">
	import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource.js';
	import { formatVersionName } from '$lib/api/VersionResource.js';
	import { type CreatedHuntTracker } from '$lib/api/HuntTracker.js';
	import type { HuntTracker } from '$lib/api/HuntTracker.js';
	import type { Generation } from '$lib/api/GenerationResource';
	import CreateTracker from '$lib/menu/CreateTracker.svelte';
	import type { Readable, Writable } from 'svelte/store';
	import TrackerCounter from '$lib/menu/tracker/counters/TrackerCounter.svelte';
	import type { SpritePreference } from '$lib/menu/SpritePreference';
	import SpriteDisplay from '$lib/menu/tracker/sprites/SpriteDisplay.svelte';
	import { CHAIN_HUNTING_METHODS } from '$lib/api/HuntingMethod';

	export let huntTrackers: Writable<HuntTracker[]>
	export let selectedTrackerIndex: Writable<number>
	export let spritePreference: Readable<SpritePreference>
	export let showNormal: Readable<boolean>
	export let generations: Generation[] = []

	const sprites = Object.fromEntries(
		generations.flatMap(generation => generation.pokemonSpecies)
			.filter(pokemonSpecies => pokemonSpecies.varieties)
			.map(pokemonSpecies => [
				pokemonSpecies.name,
				pokemonSpecies.varieties![0].sprites
			])
	)

	let creatingTracker: boolean = false

	function selectTracker(index: number) {
		return () => {
			selectedTrackerIndex.set(index)
			creatingTracker = false
		}
	}

	function deleteTracker(index: number) {
		return () => {
			huntTrackers.update(huntTrackers => [...huntTrackers.slice(0, index), ...huntTrackers.slice(index + 1)])
			selectedTrackerIndex.update(selectedTrackerIndex => selectedTrackerIndex - 1)
		}
	}

	function createTracker() {
		creatingTracker = true
		selectedTrackerIndex.set($huntTrackers.length)
	}

	function onTrackerCreated(huntTracker: CreatedHuntTracker) {
		const generation = generations.find(generation => generation.pokemonSpecies.some(pokemonSpecies => pokemonSpecies.name === huntTracker.pokemonSpecies.name))!
		generation.pokemonSpecies[generation.pokemonSpecies.findIndex(pokemonSpecies => pokemonSpecies.name === huntTracker.pokemonSpecies.name)] = huntTracker.pokemonSpecies
		sprites[huntTracker.pokemonSpecies.name] = huntTracker.pokemonSpecies.varieties[0].sprites

		console.log(huntTracker)

		huntTrackers.update(huntTrackers => [...huntTrackers, {
			count: 0,
			method: huntTracker.method,
			generation: huntTracker.generation,
			versionGroup: huntTracker.versionGroup,
			version: huntTracker.version,
			pokemonSpecies: huntTracker.pokemonSpecies.name,
			variety: huntTracker.variety?.name,
			form: huntTracker.form?.name,
			female: huntTracker?.female,
			chain: CHAIN_HUNTING_METHODS.has(huntTracker.method)
				? {
					current: 0,
					max: 0
				}
				: undefined
		}])

		creatingTracker = false
	}
</script>

<div id="tabs">
	<div
		role="tablist"
		aria-label="Hunt Tracker Tabs"
	>
		{#each $huntTrackers as huntTracker, index}
			<button
				id="tab-{index + 1}"
				role="tab"
				tabindex={index}
				aria-selected={index === $selectedTrackerIndex}
				aria-controls="tracker-{index + 1}"
				on:click={selectTracker(index)}
			>
				<span>{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}</span>
				<button class="delete-tracker" on:click={deleteTracker(index)}>&times;</button>
			</button>
		{/each}
	</div>
	{#if !creatingTracker}
		<button id="create-tracker" on:click={createTracker}>&plus;</button>
	{/if}
</div>

<div id="tracker-view">
	{#if creatingTracker}
		<CreateTracker
			generations={generations}
			on:created={event => onTrackerCreated(event.detail)}
		/>
	{:else if $huntTrackers.length > 0}
		{#each $huntTrackers as huntTracker, index}
			<div
				id="tracker-{index + 1}"
				role="tabpanel"
				aria-labelledby="tab-{index + 1}"
				tabindex={index}
				class:invisible={index !== $selectedTrackerIndex}
			>
				<span class="pokemon-name">{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}</span>
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
								<th>{huntTracker.shinyCharm ?? false ? 'Yes' : 'No'}</th>
							{/if}
						</tr>
					</tbody>
				</table>

				<SpriteDisplay
					sprites={sprites[huntTracker.pokemonSpecies]}
					generation={generations[huntTracker.generation - 1].name}
					versionGroup={huntTracker.versionGroup ?? huntTracker.version}
					version={huntTracker.version}
					pokemon={huntTracker.pokemonSpecies}
					spritePreference={spritePreference}
					showNormal={$showNormal}
				/>

				<TrackerCounter bind:huntTracker/>
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

  [role=tablist] {
    overflow: scroll;
  }

  #tabs, [role=tablist] {
    display: flex;
    flex-direction: row;
    gap: var(--padding-length);
  }

  [role=tab] {
    width: 130px;
    display: flex;
    flex-direction: row;
    gap: var(--padding-length);
    justify-content: space-between;
    align-items: center;
  }

  [role=tab][aria-selected=true] {
    background-color: var(--primary-medium);
    color: var(--font-color);
  }

  [role=tab][aria-selected=true] > button.delete-tracker:hover {
    background-color: var(--primary-light);
  }

  [role=tab][aria-selected=true] > button.delete-tracker:active:hover {
    background-color: var(--primary-lighter);
  }

  [role=tab][aria-selected=false] {
    background-color: var(--primary-darker);
    color: var(--font-color);
  }

  [role=tab][aria-selected=false]:hover {
    background-color: var(--primary-dark);
    color: var(--font-color);
  }

  [role=tab][aria-selected=false] > button.delete-tracker:hover {
    background-color: var(--primary-medium);
  }

  [role=tab][aria-selected=false] > button.delete-tracker:active:hover {
    background-color: var(--primary-light);
  }

  .delete-tracker {
    background: none;
    color: var(--font-color);
    padding: var(--padding-length) calc(2 * var(--padding-length));
  }

  #create-tracker {
    background: none;
    color: var(--font-color);
    padding: calc(2 * var(--padding-length)) calc(3 * var(--padding-length));
  }

  #create-tracker:hover {
    background-color: var(--primary-dark);
  }

  #create-tracker:active:hover {
    background-color: var(--primary-medium);
  }

  [role=tabpanel] {
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
  }

	[role=tabpanel] > * {
		width: 100%;
		text-align: center;
	}

  .invisible {
    display: none;
  }

	.pokemon-name {
    font-weight: bold;
    font-size: 2em;
  }
</style>