import type { LinkResource } from '$lib/api/LinkResource'
import { titleCase } from '$lib/utilities/Strings'
import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI'
import type { PokemonSpecies } from '$lib/api/PokemonSpeciesResource'
import type { VersionGroup } from '$lib/api/VersionGroupResource'

export const MAX_GENERATION = 7
export const MIN_GENERATION = 2

export const GENERATION_ENDPOINT = 'generation'

export interface GenerationResource {
  name: string
  id: number
  pokemon_species: LinkResource[]
  version_groups: LinkResource[]
}

export interface Generation {
  id: number
  name: string
  versionGroups: VersionGroup[]
  pokemonSpecies: Partial<PokemonSpecies>[]
}

export function formatGenerationName(name: string): string {
  const tokens = name.split('-')
  return titleCase(tokens[0]) + ' ' + tokens[1].toUpperCase()
}

export async function getGenerationResource(
  identifier: Identifier,
  fetchCallback: FetchFunction = fetch
) {
  return getResource<GenerationResource>(GENERATION_ENDPOINT, identifier, fetchCallback)
}
