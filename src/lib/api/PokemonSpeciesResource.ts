import type { LinkResource } from '$lib/api/LinkResource'
import type { PokedexNumberResource } from '$lib/api/PokedexNumberResource'
import type { VarietyResource } from '$lib/api/VarietyResource'
import { type FetchFunction, getResourceWithCache, type Identifier } from '$lib/api/PokeAPI'
import { getPokemon, type Pokemon } from '$lib/api/PokemonResource'
import { delimitedTitleCase } from '$lib/utilities/Strings'

export interface PokemonSpeciesResource {
  generation: LinkResource
  id: number
  name: string
  pokedex_numbers: [PokedexNumberResource]
  has_gender_differences: boolean
  varieties: VarietyResource[]
}

export interface PokemonSpecies {
  id: number
  name: string
  pokedexNumber: number
  hasGenderDifferences: boolean
  varieties: Pokemon[]
}

export const POKEMON_SPECIES_ENDPOINT = 'pokemon-species'
export const POKEMON_SPECIES_CACHE = 'pokemonSpecies'

export async function getPokemonSpecies(
  identifier: Identifier,
  fetchCallback: FetchFunction = fetch
): Promise<PokemonSpecies> {
  return getResourceWithCache<PokemonSpeciesResource>(
    POKEMON_SPECIES_ENDPOINT,
    POKEMON_SPECIES_CACHE,
    identifier,
    fetchCallback
  ).then(async (pokemonSpeciesResource) => ({
    id: pokemonSpeciesResource.id,
    name: pokemonSpeciesResource.name,
    pokedexNumber: pokemonSpeciesResource.pokedex_numbers[0].entry_number,
    hasGenderDifferences: pokemonSpeciesResource.has_gender_differences,
    varieties: await Promise.all(
      pokemonSpeciesResource.varieties.map((pokemonLinkResource) =>
        getPokemon(pokemonLinkResource.pokemon.name, fetchCallback)
      )
    )
  }))
}

export function formatPokemonSpeciesName(name?: string) {
  switch (name) {
    case 'nidoran-m':
      return 'Nidoran♀'
    case 'nidoran-f':
      return 'Nidoran♂'
    case 'farfetchd':
      return "Farfetch'd"
    case 'mr-mime':
      return 'Mr. Mime'
    case 'ho-oh':
      return 'Ho-Oh'
    case 'mime-jr':
      return 'Mime Jr.'
    case 'porygon-z':
      return 'Porygon-Z'
    case 'flabebe':
      return 'Flabébé'
    case 'type-null':
      return 'Type: Null'
    case 'jangmo-o':
      return 'Jangmo-o'
    case 'hakamo-o':
      return 'Hakamo-o'
    case 'kommo-o':
      return 'Kommo-o'
    default:
      return name ? delimitedTitleCase(name) : undefined
  }
}
