<script lang="ts">
	import type { GenerationalSprites, Sprites } from '$lib/api/SpritesResource';
	import { getSpriteVersionGroup } from '$lib/api/SpritesResource';
	import { SpritePreference } from '$lib/menu/SpritePreference';
	import Sprite from '$lib/menu/tracker/sprites/Sprite.svelte';
	import type { HuntTracker } from '$lib/api/HuntTracker';
	import { toRomanNumerals } from '$lib/utilities/Strings';

	export let huntTracker: HuntTracker;
	export let sprites: {
		[pokemonName: string]: {
			sprites: GenerationalSprites,
			forms: {
				[formName: string]: Sprites
			}
		}
	}
	export let spritePreference: SpritePreference
	export let showNormal: boolean = false

	function getSprites(
		sprites: {
			[pokemonName: string]: {
				sprites: GenerationalSprites,
				forms: {
					[formName: string]: Sprites
				}
			}
		},
		huntTracker: HuntTracker,
		spritePreference: SpritePreference,
	): Sprites {
		// Get the selected variety if specified or else the first variety
		const pokemon = huntTracker.pokemon
			? sprites[huntTracker.pokemon]
			: Object.values(sprites)[0]

		switch (spritePreference) {
			case SpritePreference.SHOWDOWN:
				return pokemon.sprites.other.showdown!
			case SpritePreference.HOME:
				return pokemon.sprites.other.home!
			case SpritePreference.GENERATION:
				{
					// Get the selected form if specified or else the generational sprites
					const baseSprites = huntTracker.pokemonForm
						? pokemon.forms[huntTracker.pokemonForm]
						: pokemon.sprites.versions
							[`generation-${toRomanNumerals(huntTracker.generation)}`]
							[getSpriteVersionGroup(huntTracker.version, huntTracker.versionGroup)]

					return 'animated' in baseSprites
						? baseSprites.animated as Sprites
						: baseSprites
				}
		}
	}

	$: selectedSprites = getSprites(sprites, huntTracker, spritePreference)
</script>

<div>
	<Sprite
		sprites={selectedSprites}
		pokemon={huntTracker.pokemonSpecies}
		{showNormal}
		isFemale={huntTracker.female}
	/>
</div>

<style>
	div {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
</style>
