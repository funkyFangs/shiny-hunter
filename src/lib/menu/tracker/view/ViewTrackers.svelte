<script lang="ts">
	import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource.js';
	import { formatVersionName } from '$lib/api/VersionResource.js';
	import { type CreatedHuntTracker } from '$lib/api/HuntTracker.js';
	import type { HuntTracker } from '$lib/api/HuntTracker.js';
	import type { Generation } from '$lib/api/GenerationResource';
	import CreateTracker from '$lib/menu/tracker/create/CreateTracker.svelte';
	import type { Writable } from 'svelte/store';
	import TrackerCounter from '$lib/menu/tracker/counters/TrackerCounter.svelte';
	import type { SpritePreference } from '$lib/menu/SpritePreference';
	import SpriteDisplay from '$lib/menu/tracker/sprites/SpriteDisplay.svelte';
	import { CHAIN_HUNTING_METHODS } from '$lib/api/HuntingMethod';
	import type { GenerationalSprites, Sprites } from '$lib/api/SpritesResource';
	import { delimitedTitleCase } from '$lib/utilities/Strings';
	import { formatPokemonName } from '$lib/api/PokemonResource';
	import Device from 'svelte-device-info';

	export let huntTrackers: Writable<HuntTracker[]>
	export let history: Writable<HuntTracker[]>
	export let selectedTrackerIndex: Writable<number>
	export let spritePreference: SpritePreference
	export let showNormal: boolean
	export let generations: Generation[] = []

	const sprites: {
		[pokemonSpeciesName: string]: {
			[pokemonName: string]: {
				sprites: GenerationalSprites,
				forms: {
					[formName: string]: Sprites
				}
			}
		}
	} = Object.fromEntries(
		generations.flatMap(generation => generation.pokemonSpecies)
			.filter(pokemonSpecies => pokemonSpecies.varieties)
			.map(pokemonSpecies => [
				pokemonSpecies.name,
				Object.fromEntries(
					pokemonSpecies.varieties!.map(pokemon => [
						pokemon.name,
						{
							sprites: pokemon.sprites,
							forms: Object.fromEntries(
								pokemon.forms.map(form => [
									form.name,
									form.sprites
								])
							)
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
		return () => {
			history.update(history => [...history, huntTracker])
			huntTrackers.update(huntTrackers => [...huntTrackers.slice(0, index), ...huntTrackers.slice(index + 1)])
			selectedTrackerIndex.update(selectedTrackerIndex => selectedTrackerIndex - 1)
		}
	}

	function createTracker() {
		creatingTracker = true
		selectedTrackerIndex.set($huntTrackers.length)
	}

	function onTrackerCreated(createdHuntTracker: CreatedHuntTracker) {
		const generation = generations.find(generation => generation.pokemonSpecies.some(pokemonSpecies => pokemonSpecies.name === createdHuntTracker.pokemonSpecies.name))!
		generation.pokemonSpecies[generation.pokemonSpecies.findIndex(pokemonSpecies => pokemonSpecies.name === createdHuntTracker.pokemonSpecies.name)] = createdHuntTracker.pokemonSpecies
		sprites[createdHuntTracker.pokemonSpecies.name] = Object.fromEntries(
			createdHuntTracker.pokemonSpecies.varieties!.map(pokemon => [
				pokemon.name,
				{
					sprites: pokemon.sprites,
					forms: Object.fromEntries(
						pokemon.forms.map(form => [
							form.name,
							form.sprites
						])
					)
				}
			])
		)

		huntTrackers.update(huntTrackers => [...huntTrackers, {
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
		}])

		creatingTracker = false
	}

	function completeHunt(index: number, huntTracker: HuntTracker) {
		return () => {
			huntTracker.complete = true
			deleteTracker(index, huntTracker)()
		}
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
				class:hoverable={Device.canHover}
				on:click={selectTracker(index)}
			>
				<span>{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}</span>
				<button class="delete-tracker" on:click={deleteTracker(index, huntTracker)} class:hoverable={Device.canHover}>&times;</button>
			</button>
		{/each}
	</div>
	{#if !creatingTracker}
		<button id="create-tracker" on:click={createTracker} class:hoverable={Device.canHover}>&plus;</button>
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
				<span class="pokemon-name">
					{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}
				</span>
				{#if huntTracker.pokemon}
					<span>{formatPokemonName(huntTracker.pokemonSpecies, huntTracker.pokemon)}</span>
				{/if}
				{#if huntTracker.pokemonForm}
					<span>{delimitedTitleCase(huntTracker.pokemonForm)}</span>
				{/if}
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
					{huntTracker}
					sprites={sprites[huntTracker.pokemonSpecies]}
					{spritePreference}
					{showNormal}
				/>

				<TrackerCounter bind:huntTracker/>

				<button on:click={completeHunt(index, huntTracker)}>Shiny Found</button>
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
		max-width: 130px;
		width: 100%;
    display: flex;
    flex-direction: row;
    gap: var(--padding-length);
    justify-content: space-between;
    align-items: center;
		color: var(--font-color);
  }

  [role=tab][aria-selected=true] {
    background-color: var(--primary-medium);
  }

  [role=tab][aria-selected=false].hoverable {
		background: none;
  }

  [role=tab][aria-selected=false].hoverable:hover,
	[role=tab][aria-selected=false]:not(.hoverable) {
    background-color: var(--primary-dark);
  }

  button.delete-tracker {
    color: var(--font-color);
    padding: var(--padding-length) calc(2 * var(--padding-length));
  }

  button.delete-tracker.hoverable {
    background: none;
  }

  [role=tab][aria-selected=false] > button.delete-tracker:hover,
  [role=tab][aria-selected=false] > button.delete-tracker:not(.hoverable) {
		background-color: var(--primary-medium);
  }

  [role=tab][aria-selected=true] > button.delete-tracker:not(.hoverable),
  [role=tab][aria-selected=true] > button.delete-tracker:hover {
		background-color: var(--primary-light);
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