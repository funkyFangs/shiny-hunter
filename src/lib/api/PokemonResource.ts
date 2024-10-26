import type { LinkResource } from '$lib/api/LinkResource';
import type {
	GenerationalSprites,
	GenerationalSpritesResource,
} from '$lib/api/SpritesResource';
import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI';
import { getPokemonForm, type PokemonForm } from '$lib/api/PokemonFormResource';
import { delimitedTitleCase } from '$lib/utilities/Strings';
import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource';

export interface PokemonResource {
	id: number
	name: string
	forms: LinkResource[]
	species: LinkResource
	sprites: GenerationalSpritesResource
}

export interface Pokemon {
	id: number
	name: string
	forms: PokemonForm[]
	sprites: GenerationalSprites
}

export const POKEMON_ENDPOINT = 'pokemon'

export async function getPokemon(identifier: Identifier, fetchCallback: FetchFunction = fetch): Promise<Pokemon> {
	return getResource<PokemonResource>(POKEMON_ENDPOINT, identifier, fetchCallback)
		.then(async pokemonResource => ({
			id: pokemonResource.id,
			name: pokemonResource.name,
			sprites: {
				frontDefault: pokemonResource.sprites.front_default,
				frontFemale: pokemonResource.sprites.front_female,
				frontShiny: pokemonResource.sprites.front_shiny,
				frontShinyFemale: pokemonResource.sprites.front_shiny_female,
				versions: Object.fromEntries(
					Object.entries(pokemonResource.sprites.versions)
						.map(([generation, next]) => [
							generation,
							Object.fromEntries(
								Object.entries(next)
									.map(([versionGroup, spritesResource]) => [
										versionGroup,
										'animated' in spritesResource
											? {
												frontDefault: spritesResource.front_default,
												frontFemale: spritesResource.front_female,
												frontShiny: spritesResource.front_shiny,
												frontShinyFemale: spritesResource.front_shiny_female,
												animated: {
													frontDefault: spritesResource.animated.front_default,
													frontFemale: spritesResource.animated.front_female,
													frontShiny: spritesResource.animated.front_shiny,
													frontShinyFemale: spritesResource.animated.front_shiny_female
												}
											}
											: {
												frontDefault: spritesResource.front_default,
												frontFemale: spritesResource.front_female,
												frontShiny: spritesResource.front_shiny,
												frontShinyFemale: spritesResource.front_shiny_female,
											}
									])
							)
						])
				),
				other: {
					home: pokemonResource.sprites.other.home
						? {
							frontDefault: pokemonResource.sprites.other.home.front_default,
							frontShiny: pokemonResource.sprites.other.home.front_shiny,
							frontFemale: pokemonResource.sprites.other.home.front_female,
							frontShinyFemale: pokemonResource.sprites.other.home.front_shiny_female
						}
						: null,
					showdown: pokemonResource.sprites.other.showdown
						? {
							frontDefault: pokemonResource.sprites.other.showdown.front_default,
							frontShiny: pokemonResource.sprites.other.showdown.front_shiny,
							frontFemale: pokemonResource.sprites.other.showdown.front_female,
							frontShinyFemale: pokemonResource.sprites.other.showdown.front_shiny_female
						}
						: null
				}
			},
			forms: await Promise.all(
				pokemonResource.forms.map(formLinkResource => getPokemonForm(formLinkResource.name, fetchCallback))
			)
		}))
}

export function formatPokemonName(pokemonSpecies: string, pokemon: string) {
	if (!pokemon.includes('-')) {
		return formatPokemonSpeciesName(pokemon)
	}
	else if (pokemon.match(/-alola(-\w+)*/)) {
		return `Alolan ${formatPokemonSpeciesName(pokemonSpecies)}`
	}
	else if (pokemon.match(/-galar(-\w+)*/)) {
		return `Galarian ${formatPokemonSpeciesName(pokemonSpecies)}`
	}
	else if (pokemon.match(/-hisui(-\w+)*/)) {
		return `Hisuian ${formatPokemonSpeciesName(pokemonSpecies)}`
	}
	else if (pokemon.match(/-paldea(-\w+)*/)) {
		return `Paldean ${formatPokemonSpeciesName(pokemonSpecies)}`
	}
	else {
		return delimitedTitleCase(pokemon)
	}
}

//https://www.serebii.net/games/shiny.shtml
function getShinyLockPattern(versionGroup: string) {
	switch (versionGroup) {
		case 'black-white':
			return /victini|reshiram|zekrom/
		case 'black-2-white-2':
			return /reshiram|zekrom/
		case 'x-y':
			return /articuno|zapdos|moltres|mewtwo|xerneas|yveltal|zygarde/
		case 'omega-ruby-alpha-sapphire':
			return /kyogre|groudon|rayquaza|deoxys/
		case 'sun-moon':
			return /tapu-koko|tapu-lele|tapu-bulu|tapu-fini|cosmog|solgaleo|lunala|nihilego|buzzwole|pheromosa|xurkitree|celesteela|kartana|guzzlord|necrozma/
		case 'ultra-sun-ultra-moon':
			return /zygarde|tapu-koko|tapu-lele|tapu-bulu|tapu-fini|cosmog|solgaleo|lunala|necrozma/
	}
}

export function isShinyLocked(pokemon: string, versionGroup: string): boolean {
	const shinyLockPattern = getShinyLockPattern(versionGroup)
	return shinyLockPattern !== undefined && pokemon.match(shinyLockPattern) !== null
}
