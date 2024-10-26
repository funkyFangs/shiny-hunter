import {
  HISTORY,
  HUNT_TRACKERS,
  type HuntTracker,
  SELECTED_TRACKER_INDEX
} from '$lib/api/HuntTracker'
import { localStorageWritable } from '$lib/storage/StorageWritable'
import { range } from '$lib/utilities/Arrays'
import { type Generation, getGenerationResource, MAX_GENERATION } from '$lib/api/GenerationResource'
import { getVersionGroup } from '$lib/api/VersionGroupResource'
import { getPokemonSpecies } from '$lib/api/PokemonSpeciesResource'
import { get } from 'svelte/store'

const GENERATION_NUMBERS = range(1, MAX_GENERATION, true)

export async function load({ fetch }) {
  const huntTrackers = localStorageWritable<HuntTracker[]>(HUNT_TRACKERS, [])
  const currentHuntTrackers = get(huntTrackers)
  const currentTrackedPokemon = new Set(
    currentHuntTrackers.map((huntTracker) => huntTracker!.pokemonSpecies)
  )

  const generations: Generation[] = await Promise.all(
    GENERATION_NUMBERS.map(async (generationNumber) =>
      getGenerationResource(generationNumber, fetch).then(async (generationResource) => ({
        name: generationResource.name,
        id: generationResource.id,
        versionGroups: await Promise.all(
          generationResource.version_groups.map((versionGroupLinkResource) =>
            getVersionGroup(versionGroupLinkResource.name, fetch)
          )
        ),
        pokemonSpecies: await Promise.all(
          generationResource.pokemon_species.map(async (pokemonSpeciesLinkResource) =>
            // Only fetch full Pokémon details if it is currently being tracked to reduce load time
            currentTrackedPokemon.has(pokemonSpeciesLinkResource.name)
              ? await getPokemonSpecies(pokemonSpeciesLinkResource.name, fetch)
              : {
                  name: pokemonSpeciesLinkResource.name
                }
          )
        )
      }))
    )
  )

  const selectedTrackerIndex = localStorageWritable<number>(SELECTED_TRACKER_INDEX, -1)
  const currentSelectedTrackerIndex = get(selectedTrackerIndex)

  // If selected tracker index starts out of bounds when there are trackers (such as when reloading while creating a new tracker), set it to 0
  if (
    (currentSelectedTrackerIndex < 0 ||
      currentSelectedTrackerIndex >= currentHuntTrackers.length) &&
    currentHuntTrackers.length > 0
  ) {
    selectedTrackerIndex.set(0)
  }

  return {
    huntTrackers,
    selectedTrackerIndex,
    generations,
    history: localStorageWritable<HuntTracker[]>(HISTORY, [])
  }
}
