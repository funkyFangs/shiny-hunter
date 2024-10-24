<script lang="ts">
	import { derived, type Readable, type Writable, writable } from 'svelte/store';
	import { formatVersionName, type Version } from '$lib/api/VersionResource';
	import { formatGenerationName, type Generation, MIN_GENERATION } from '$lib/api/GenerationResource';
	import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource';
	import { getHuntingMethods, getToolTip, type HuntingMethod } from '$lib/api/HuntingMethod';
	import ToolTip from '$lib/menu/controls/ToolTip.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { CreatedHuntTracker } from '$lib/api/HuntTracker';
	import { getPokemonSpecies, type PokemonSpecies } from '$lib/api/PokemonSpeciesResource';
	import type { Pokemon } from '$lib/api/PokemonResource';
	import type { PokemonForm } from '$lib/api/PokemonFormResource';

	const dispatch = createEventDispatcher<{created: CreatedHuntTracker}>();
	const versionBlacklist = new Set(['xd', 'colosseum', 'lets-go-eevee', 'lets-go-pikachu'])

	export let generations: Generation[] = [];

	const versionToGeneration = Object.fromEntries(
		generations.flatMap(generation => generation.versionGroups
			.flatMap(versionGroup => versionGroup.versions)
			.map(version => [version.name, generation])
		)
	)
	const versionToVersionGroup = Object.fromEntries(
		generations.flatMap(generation => generation.versionGroups)
			.flatMap(versionGroup => versionGroup.versions.map(version => [version.name, versionGroup]))
	)
	const pokemonSpeciesNameToPokemonSpecies: {
		[pokemonSpeciesName: string]: Partial<PokemonSpecies>
	} = Object.fromEntries(
		generations.flatMap(generation => generation.pokemonSpecies.map(pokemonSpecies => [formatPokemonSpeciesName(pokemonSpecies.name), pokemonSpecies]))
	)

	/* ============================================================================================ *\
	 *  Version																																											*
	\* ============================================================================================ */

	const selectedVersion: Writable<Version | null> = writable(null)
	const selectedVersionGroup = derived(
		selectedVersion,
		version => version
			? versionToVersionGroup[version.name] ?? null
			: null
	)

	/* ============================================================================================ *\
	 *  Generation  																																								*
	\* ============================================================================================ */

	const selectedGeneration = derived(
		selectedVersion,
		version => version
			? versionToGeneration[version.name] ?? null
			: null
	)

	/* ============================================================================================ *\
	 *  Pokemon Species																																							*
	\* ============================================================================================ */

	const selectedPokemonSpeciesName: Writable<string | null> = writable(null)
	const selectedPokemonSpecies: Readable<Promise<PokemonSpecies | null>> = derived(
		selectedPokemonSpeciesName,
		async pokemonSpeciesName => {
			if (pokemonSpeciesName) {
				const pokemonSpecies = pokemonSpeciesNameToPokemonSpecies[pokemonSpeciesName];
				if (pokemonSpecies) {
					return pokemonSpecies.varieties
						? pokemonSpecies as PokemonSpecies
						: getPokemonSpecies(pokemonSpecies.name!)
							.then(newPokemonSpecies => {
								pokemonSpeciesNameToPokemonSpecies[newPokemonSpecies.name] = newPokemonSpecies
								if (newPokemonSpecies.varieties.length === 1) {
									selectedPokemonVariety.set(newPokemonSpecies.varieties[0])
								}
								return newPokemonSpecies
							})
				}
			}

			return null
		}
	)

	const selectedPokemonVariety = writable<Pokemon | null>(null)
	const selectedPokemonForm = writable<PokemonForm | null>(null)
	const selectedGender = writable<boolean>(false)

	$: if ($selectedPokemonVariety && $selectedPokemonVariety.forms.length === 1) {
		selectedPokemonForm.set($selectedPokemonVariety.forms[0])
	}

	/* ============================================================================================ *\
	 *  Hunting Method																																							*
	\* ============================================================================================ */

	const huntingMethods = derived(
		[selectedGeneration, selectedVersion, selectedVersionGroup],
		([generation, version, versionGroup]) => {
			if (generation && version) {
				const huntingMethods = getHuntingMethods(generation.id, version, versionGroup!)
				if (!Array.isArray(huntingMethods)) {
					selectedHuntingMethod.set(huntingMethods)
				}
				return huntingMethods
			}
			return null
		}
	)

	const selectedHuntingMethod: Writable<HuntingMethod | null> = writable(null)

	/* ============================================================================================ *\
	 *  Shiny Charm																																									*
	\* ============================================================================================ */

	const shinyCharm = writable<boolean>(false)

	/* ============================================================================================ *\
	 *  Form  																																											*
	\* ============================================================================================ */

	const readyToSubmit = derived(
		[selectedVersion, selectedPokemonSpeciesName, selectedHuntingMethod],
		([version, pokemonSpeciesName, huntingMethod]) =>
			version && pokemonSpeciesName && pokemonSpeciesNameToPokemonSpecies[pokemonSpeciesName] && huntingMethod
	)

	async function onSubmit() {
		const pokemonSpecies = (await $selectedPokemonSpecies)!

		dispatch('created', {
			method: $selectedHuntingMethod!,
			pokemonSpecies: pokemonSpecies,
			variety: $selectedPokemonVariety ?? undefined,
			form: $selectedPokemonForm ?? undefined,
			female: pokemonSpecies.hasGenderDifferences ? $selectedGender : undefined,
			version: $selectedVersion!.name,
			versionGroup: $selectedVersionGroup!.name === $selectedVersion!.name ? undefined : $selectedVersionGroup!.name,
			generation: $selectedGeneration!.id,
			shinyCharm: $selectedGeneration!.id >= 5 ? $shinyCharm : undefined
		})
	}
</script>

<div class="create-tracker-container">
	<div class="grid">
		<label for="version">Version</label>
		<select id="version" required bind:value={$selectedVersion}>
			<option selected value={null} class="blank-option"></option>

			{#each generations.filter(generation => generation.id >= MIN_GENERATION) as generation}
				<optgroup label="{formatGenerationName(generation.name)}">
					{#each generation.versionGroups.flatMap(versionGroup => versionGroup.versions)
						.filter(version => !versionBlacklist.has(version.name)) as version}
						<option value={version}>{formatVersionName(version.name)}</option>
					{/each}
				</optgroup>
			{/each}
		</select>

		<label for="hunting-method">Hunting Method</label>
		<div id="hunting-method-entry">
			{#if Array.isArray($huntingMethods)}
				<select
					id="hunting-method"
					bind:value={$selectedHuntingMethod}
					aria-describedby={$selectedHuntingMethod}
					required
				>
					<option selected value={null} class="blank-option"></option>
					{#each $huntingMethods as huntingMethod}
						<option value={huntingMethod}>{huntingMethod}</option>
					{/each}
				</select>
			{:else if $huntingMethods}
				<span id="hunting-method" aria-describedby={$selectedHuntingMethod}>{$huntingMethods}</span>
			{/if}

			{#if $selectedHuntingMethod}
				<ToolTip id={$selectedHuntingMethod} title={getToolTip($selectedHuntingMethod)}>
					<span class="help">&#9432;</span>
				</ToolTip>
			{/if}
		</div>

		{#if $selectedGeneration?.id && $selectedGeneration.id >= 5}
			<label for="shiny-charm">Shiny Charm</label>
			<input id="shiny-charm" bind:value={$shinyCharm} type="checkbox"/>
		{/if}

		<datalist id="pokemon-species">
			{#each generations.flatMap(generation => generation.pokemonSpecies) as pokemonSpecies}
				<option>{formatPokemonSpeciesName(pokemonSpecies.name)}</option>
			{/each}
		</datalist>

		<label for="pokemon">Pokémon</label>
		<input
			id="pokemon"
			required
			type="search"
			list="pokemon-species"
			bind:value={$selectedPokemonSpeciesName}
		/>

		{#await $selectedPokemonSpecies then pokemonSpecies}
			{#if pokemonSpecies}
				{#if pokemonSpecies.varieties.length > 1}
					<label for="variety">Variety</label>
					<select bind:value={$selectedPokemonVariety} id="variety">
						{#each pokemonSpecies.varieties as variety}
							<option value={variety}>{variety.name}</option>
						{/each}
					</select>
				{/if}

				{#if pokemonSpecies.hasGenderDifferences}
					<label for="gender">Gender</label>
					<input type="checkbox" id="gender"/>
				{/if}
			{/if}
		{/await}

		{#if $selectedPokemonVariety && $selectedPokemonVariety.forms.length > 1}
			<label for="form">Form</label>
			<select bind:value={$selectedPokemonForm} id="form">
				{#each $selectedPokemonVariety.forms as pokemonForm}
					<option value={pokemonForm}>{pokemonForm.name}</option>
				{/each}
			</select>
		{/if}
	</div>

	<button
		id="submit"
		class="primary-button"
		disabled={!$readyToSubmit}
		on:click={onSubmit}
	>Create Hunt Tracker</button>
</div>

<style>
  /* TODO - Clean up */
  .create-tracker-container {
    /* Positioning */
    display: flex;
    padding: var(--gap-length);
    justify-content: center;
    gap: var(--gap-length);

    /* Decoration */
    border-radius: var(--border-radius);

    /* Palette */
    background-color: var(--primary-medium);
    flex-direction: column;
  }

  #pokemon, #version, #hunting-method {
    width: fit-content;
  }

  #hunting-method-entry {
    display: flex;
    flex-direction: row;
    gap: var(--gap-length);
    align-content: center;
  }

  .grid {
    /* Positioning */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-length);
    justify-content: center;
    align-items: center;
    width: fit-content;
    margin: auto;
  }

  #submit {
    width: fit-content;
    margin: auto;
  }
</style>