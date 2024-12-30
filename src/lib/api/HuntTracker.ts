import type { HuntingMethod } from '$lib/api/HuntingMethod'
import type { PokemonSpecies } from '$lib/api/PokemonSpeciesResource'
import type { Pokemon } from '$lib/api/PokemonResource'
import type { PokemonForm } from '$lib/api/PokemonFormResource'

export const HUNT_TRACKERS = 'huntTrackers'
export const HISTORY = 'history'
export const SELECTED_TRACKER_INDEX = 'selectedTrackerIndex'

export interface HuntTracker {
  // Tracker Details
  count: number
  chain?: {
    current: number
    max: number
  }
  complete: boolean
  startDate?: string
  endDate?: string

  // Shiny Rates
  method: HuntingMethod
  shinyCharm?: boolean

  // Version Details
  generation: number
  versionGroup?: string
  version: string

  // Pokémon Details
  pokemonSpecies: string
  pokemon?: string
  pokemonForm?: string
  female?: boolean
}

export interface CreatedHuntTracker {
  // Version Details
  generation: number
  versionGroup?: string
  version: string

  // Shiny Rates
  method: HuntingMethod
  shinyCharm?: boolean

  // Pokemon Details
  pokemonSpecies: PokemonSpecies
  pokemon?: Pokemon
  pokemonForm?: PokemonForm
  female?: boolean
}
