<script lang="ts">
	import type { GenerationalSprites } from '$lib/api/SpritesResource';
	import { getSpriteVersionGroup } from '$lib/api/SpritesResource';
	import { SpritePreference } from '$lib/menu/SpritePreference';
	import type { Readable } from 'svelte/store';
	import Sprite from '$lib/menu/tracker/sprites/Sprite.svelte';

	export let sprites: GenerationalSprites
	export let generation: string
	export let versionGroup: string
	export let version: string
	export let pokemon: string
	export let spritePreference: Readable<SpritePreference>
	export let showNormal: boolean = false
	export let isFemale: boolean = false

	function getSprites(
		sprites: GenerationalSprites,
		generation: string,
		versionGroup: string,
		version: string,
		spritePreference: SpritePreference,
	) {
		switch (spritePreference) {
			case SpritePreference.SHOWDOWN:
				return sprites.other.showdown
			case SpritePreference.HOME:
				return sprites.other.home
			case SpritePreference.GENERATION:
				{
					const baseSprites = sprites.versions[generation][getSpriteVersionGroup(version, versionGroup)]
					return 'animated' in baseSprites ? baseSprites.animated : baseSprites
				}
		}
	}

	$: selectedSprites = getSprites(sprites, generation, versionGroup, version, $spritePreference)!
</script>

<div>
	<Sprite
		sprites={selectedSprites}
		{pokemon}
		{showNormal}
		{isFemale}
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
