import type { LinkResource } from '$lib/api/LinkResource'
import { titleCase } from '$lib/utilities/Strings'
import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI'
import { getPokemonSpecies, type PokemonSpecies } from '$lib/api/PokemonSpeciesResource'
import { getVersionGroup, type VersionGroup } from '$lib/api/VersionGroupResource'

export const MAX_GENERATION = 9
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
  fetchCallback: FetchFunction = fetch,
  pokemonSpecies: Set<string> = new Set([])
) {
  return getResource<GenerationResource>(GENERATION_ENDPOINT, identifier, fetchCallback).then(
    (generationResource) => toGeneration(generationResource, fetchCallback, pokemonSpecies)
  )
}

export async function toGeneration(
  generationResource: GenerationResource,
  fetchCallback: FetchFunction = fetch,
  pokemonSpecies: Set<string> = new Set([])
): Promise<Generation> {
  return {
    name: generationResource.name,
    id: generationResource.id,
    versionGroups: await Promise.all(
      generationResource.version_groups.map((versionGroupLinkResource) =>
        getVersionGroup(versionGroupLinkResource.name, generationResource.id, fetchCallback)
      )
    ),
    pokemonSpecies: await Promise.all(
      generationResource.pokemon_species.map(async (pokemonSpeciesLinkResource) =>
        pokemonSpecies.has(pokemonSpeciesLinkResource.name)
          ? await getPokemonSpecies(pokemonSpeciesLinkResource.name, fetchCallback)
          : {
              name: pokemonSpeciesLinkResource.name
            }
      )
    )
  }
}
