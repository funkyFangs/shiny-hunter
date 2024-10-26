import { fetchWithCache } from '$lib/storage/Cache'

export const API_URL = 'https://pokeapi.co/api/v2'

export async function getResourceWithCache<Resource>(
  endpoint: string,
  cacheName: string,
  identifier: Identifier,
  fetchCallback: FetchFunction = fetch
): Promise<Resource> {
  return fetchWithCache(buildUrl(endpoint, identifier), cacheName, fetchCallback).then((response) =>
    response.json()
  )
}

export async function getResource<Resource>(
  endpoint: string,
  identifier: Identifier,
  fetchCallback: FetchFunction = fetch
): Promise<Resource> {
  return fetchCallback(buildUrl(endpoint, identifier)).then((response: Response) => response.json())
}

export function buildUrl(endpoint: string, identifier: Identifier) {
  return `${API_URL}/${endpoint}/${identifier}`
}

export type Identifier = string | number
export type FetchFunction = typeof fetch
