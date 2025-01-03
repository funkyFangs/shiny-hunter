import type { LinkResource } from '$lib/api/LinkResource'
import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI'
import type { Version } from '$lib/api/VersionResource'
import { getPokedex, hasNationalDex, type Pokedex } from '$lib/api/PokedexResource'

export interface VersionGroupResource {
  name: string
  versions: LinkResource[]
  pokedexes: LinkResource[]
}

export interface VersionGroup {
  name: string
  versions: Version[]
  pokedexes: Pokedex[]
}

export const VERSION_GROUP_ENDPOINT = 'version-group'

export async function getVersionGroup(
  identifier: Identifier,
  generationNumber: number,
  fetchCallback: FetchFunction = fetch
) {
  return getResource<VersionGroupResource>(VERSION_GROUP_ENDPOINT, identifier, fetchCallback).then(
    (versionGroupResource) => toVersionGroup(versionGroupResource, generationNumber, fetchCallback)
  )
}

export async function toVersionGroup(
  versionGroupResource: VersionGroupResource,
  generationNumber: number,
  fetchCallback: FetchFunction = fetch
): Promise<VersionGroup> {
  return {
    name: versionGroupResource.name,
    versions: versionGroupResource.versions.map((version) => ({
      name: version.name
    })),
    pokedexes: hasNationalDex(generationNumber, versionGroupResource.name)
      ? []
      : await Promise.all(
          versionGroupResource.pokedexes.map((pokedex) => getPokedex(pokedex.name, fetchCallback))
        )
  }
}
