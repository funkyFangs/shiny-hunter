import type { LinkResource } from '$lib/api/LinkResource'
import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI'
import type { Version } from '$lib/api/VersionResource'

export interface VersionGroupResource {
  name: string
  versions: LinkResource[]
}

export interface VersionGroup {
  name: string
  versions: Version[]
}

export const VERSION_GROUP_ENDPOINT = 'version-group'

export async function getVersionGroup(
  identifier: Identifier,
  fetchCallback: FetchFunction = fetch
): Promise<VersionGroup> {
  return getResource<VersionGroupResource>(VERSION_GROUP_ENDPOINT, identifier, fetchCallback).then(
    (versionGroupResource) => ({
      name: versionGroupResource.name,
      versions: versionGroupResource.versions.map((version) => ({
        name: version.name
      }))
    })
  )
}
