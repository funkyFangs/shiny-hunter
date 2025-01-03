import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI'
import type { LinkResource } from '$lib/api/LinkResource'
import { delimitedTitleCase } from '$lib/utilities/Strings'

export const VERSION_ENDPOINT = 'version'

export interface VersionResource {
  name: string
  version_group: LinkResource
}

export async function getVersionResource(identifier: Identifier, fetchCallback: FetchFunction) {
  return getResource<VersionResource>(VERSION_ENDPOINT, identifier, fetchCallback)
}

export interface Version {
  name: string
}

export function formatVersionName(name: string): string {
  switch (name) {
    case 'firered':
      return 'FireRed'
    case 'leafgreen':
      return 'LeafGreen'
    case 'heartgold':
      return 'HeartGold'
    case 'soulsilver':
      return 'SoulSilver'
    case 'lets-go-pikachu':
      return "Let's Go Pikachu!"
    case 'lets-go-eevee':
      return "Let's Go Eevee!"
    default:
      return delimitedTitleCase(name)
  }
}

export const VERSION_BLACKLIST = new Set([
  'xd',
  'colosseum',
  'the-isle-of-armor',
  'the-crown-tundra',
  'the-teal-mask',
  'the-indigo-disk'
])
