import type { LinkResource } from '$lib/api/LinkResource'
import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI'

export interface PokedexResource {
  name: string
  id: number
  pokemon_entries: PokemonEntryResource[]
}

export interface Pokedex {
  name: string
  id: number
  pokemonEntries: PokemonEntry[]
}

export interface PokemonEntryResource {
  entry_number: number
  pokemon_species: LinkResource
}

export interface PokemonEntry {
  entryNumber: number
  pokemonSpecies: string
}

export const POKEDEX_ENDPOINT = 'pokedex'

export function hasNationalDex(generationNumber: number, versionGroupName: string): boolean {
  return generationNumber < 8 || versionGroupName === 'brilliant-diamond-shining-pearl'
}

export async function getPokedex(
  identifier: Identifier,
  fetchCallback: FetchFunction = fetch
): Promise<Pokedex> {
  return getResource<PokedexResource>(POKEDEX_ENDPOINT, identifier, fetchCallback).then(
    (pokedexResource) => toPokedex(pokedexResource)
  )
}

export async function toPokedex(pokedexResource: PokedexResource): Promise<Pokedex> {
  return {
    name: pokedexResource.name,
    id: pokedexResource.id,
    pokemonEntries: await Promise.all(
      pokedexResource.pokemon_entries.map(async (pokemonEntryResource) => ({
        entryNumber: pokemonEntryResource.entry_number,
        pokemonSpecies: pokemonEntryResource.pokemon_species.name
      }))
    )
  }
}
