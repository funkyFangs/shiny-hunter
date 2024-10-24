import type { LinkResource } from '$lib/api/LinkResource';

export interface PokedexNumberResource {
	entry_number: number
	pokedex: LinkResource
}
