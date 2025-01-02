import type { LinkResource } from '$lib/api/LinkResource'
import type { PokedexNumberResource } from '$lib/api/PokedexNumberResource'
import type { VarietyResource } from '$lib/api/VarietyResource'
import { type FetchFunction, getResource, type Identifier } from '$lib/api/PokeAPI'
import { getPokemon, type Pokemon } from '$lib/api/PokemonResource'
import { delimitedTitleCase } from '$lib/utilities/Strings'
import type { Generation } from '$lib/api/GenerationResource'
import type { VersionGroup } from '$lib/api/VersionGroupResource'
import { distinct } from '$lib/utilities/Arrays'

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

export async function getPokemonSpecies(
  identifier: Identifier,
  fetchCallback: FetchFunction = fetch
): Promise<PokemonSpecies> {
  return getResource<PokemonSpeciesResource>(
    POKEMON_SPECIES_ENDPOINT,
    identifier,
    fetchCallback
  ).then((resource) => toPokemonSpecies(resource, fetchCallback))
}

export async function toPokemonSpecies(
  pokemonSpeciesResource: PokemonSpeciesResource,
  fetchCallback: FetchFunction = fetch
): Promise<PokemonSpecies> {
  return {
    id: pokemonSpeciesResource.id,
    name: pokemonSpeciesResource.name,
    pokedexNumber: pokemonSpeciesResource.pokedex_numbers[0].entry_number,
    hasGenderDifferences: pokemonSpeciesResource.has_gender_differences,
    varieties: await Promise.all(
      pokemonSpeciesResource.varieties.map((pokemonLinkResource) =>
        getPokemon(pokemonLinkResource.pokemon.name, fetchCallback)
      )
    )
  }
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

export function getPokemonSpeciesList(
  generations: Generation[],
  selectedGeneration: Generation,
  selectedVersionGroup: VersionGroup
): string[] {
  if (selectedVersionGroup.name == 'brilliant-diamond-and-shining-pearl') {
    return getAllPokemonSpeciesUpTo(4, generations)
  } else if (selectedVersionGroup.name == 'lets-go-pikachu-lets-go-eevee') {
    return getAllPokemonSpeciesUpTo(1, generations)
  } else if (selectedGeneration.id < 8) {
    return getAllPokemonSpeciesUpTo(selectedGeneration.id, generations)
  } else if (selectedVersionGroup.name == 'scarlet-violet') {
    return distinct(
      selectedGeneration.versionGroups
        .flatMap((versionGroup) => versionGroup.pokedexes)
        .flatMap((pokedex) => pokedex.pokemonEntries)
        .map((pokemonEntry) => formatPokemonSpeciesName(pokemonEntry.pokemonSpecies)!)
    )
  } else {
    return selectedVersionGroup.pokedexes
      .flatMap((pokedex) => pokedex.pokemonEntries)
      .map((pokemonEntry) => formatPokemonSpeciesName(pokemonEntry.pokemonSpecies)!)
  }
}

function getAllPokemonSpeciesUpTo(generationNumber: number, generations: Generation[]) {
  return generations
    .filter((generation) => generation.id <= generationNumber)
    .flatMap((generation) => generation.pokemonSpecies)
    .map((pokemonSpecies) => formatPokemonSpeciesName(pokemonSpecies.name)!)
}
