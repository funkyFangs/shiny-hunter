import type { LinkResource } from '$lib/api/LinkResource';
import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI';
import type { Sprites, SpritesResource } from '$lib/api/SpritesResource';

export interface PokemonFormResource {
	form_name: string
	form_order: number
	name: string
	pokemon: LinkResource
	sprites: SpritesResource
}

export interface PokemonForm {
	formName: string
	name: string
	formOrder: number
	sprites: Sprites
}

export const POKEMON_FORM_ENDPOINT = 'pokemon-form'

export async function getPokemonForm(identifier: Identifier, fetchCallback: FetchFunction = fetch): Promise<PokemonForm> {
	return getResource<PokemonFormResource>(POKEMON_FORM_ENDPOINT, identifier, fetchCallback)
		.then(pokemonFormResource => ({
			formName: pokemonFormResource.name,
			name: pokemonFormResource.name,
			formOrder: pokemonFormResource.form_order,
			sprites: {
				frontDefault: pokemonFormResource.sprites.front_default,
				frontFemale: pokemonFormResource.sprites.front_female,
				frontShiny: pokemonFormResource.sprites.front_shiny,
				frontShinyFemale: pokemonFormResource.sprites.front_shiny
			}
		}))
}