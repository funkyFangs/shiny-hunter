<script lang="ts">
	import type { Sprites } from '$lib/api/SpritesResource';
	import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource.js';

	export let sprites: Sprites
	export let pokemon: string
	export let showNormal: boolean = false
	export let isFemale: boolean = false

	$: shinySprite = isFemale ? sprites.frontShinyFemale : sprites.frontShiny
	$: shinyAlt = isFemale
		? `The sprite for shiny female ${formatPokemonSpeciesName(pokemon)}`
		: `The sprite for shiny ${formatPokemonSpeciesName(pokemon)}`
	$: normalSprite = isFemale ? sprites.frontFemale : sprites.frontDefault
	$: normalAlt = isFemale
		? `The sprite for female ${formatPokemonSpeciesName(pokemon)}`
		: `The sprite for ${formatPokemonSpeciesName(pokemon)}`
</script>

<div class="sprite-root">
	<div class="sprite-container">
		<img id="shiny-{pokemon}-sprite" class="sprite" src={shinySprite} alt={shinyAlt} draggable="false"/>
		{#if showNormal}
			<label for="shiny-{pokemon}-sprite">Shiny {formatPokemonSpeciesName(pokemon)}</label>
		{/if}
	</div>
	{#if showNormal}
		<div class="sprite-container">
			<img id="{pokemon}-sprite" class="sprite" src={normalSprite} alt={normalAlt} draggable="false"/>
			<label for="{pokemon}-sprite">Normal {formatPokemonSpeciesName(pokemon)}</label>
		</div>
	{/if}
</div>

<style>
	.sprite-root {
		display: flex;
		flex-direction: row;
		gap: var(--padding-length);
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.sprite-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--gap-length);
		background: var(--primary-dark);
		padding: var(--padding-length);
		border-radius: var(--border-radius);
    width: 100%;
	}

  img.sprite {
    image-rendering: pixelated;
    max-height: 500px;
		max-width: 500px;
		width: 100%;
    object-fit: contain;
		border-radius: var(--border-radius);
  }

	label {
		font-weight: bold;
	}
</style>