import type { HuntingMethod } from '$lib/api/HuntingMethod'
import type { PokemonSpecies } from '$lib/api/PokemonSpeciesResource'
import type { Pokemon } from '$lib/api/PokemonResource'
import type { PokemonForm } from '$lib/api/PokemonFormResource'

export const HUNT_TRACKERS = 'huntTrackers'
export const HISTORY = 'history'
export const SELECTED_TRACKER_INDEX = 'selectedTrackerIndex'
export const NEXT_ID = 'nextId'

export interface HuntTracker {
  // Tracker Details
  count: number
  id: number
  chain?: {
    current: number
    max: number
  }
  startDate?: string
  endDate?: string

  // Shiny Rates
  method: HuntingMethod
  shinyCharm?: boolean
  lure?: boolean
  researchLevel?: 'Less than 10' | '10' | 'Perfect'
  isMassive?: boolean
  sparklingPowerLevel?: 0 | 1 | 2 | 3

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
  // Tracker Details
  count: number

  // Version Details
  generation: number
  versionGroup?: string
  version: string

  // Shiny Rates
  method: HuntingMethod
  shinyCharm?: boolean
  lure?: boolean
  researchLevel?: 'Less than 10' | '10' | 'Perfect'
  isMassive?: boolean
  sparklingPowerLevel?: 0 | 1 | 2 | 3

  // Pokemon Details
  pokemonSpecies: PokemonSpecies
  pokemon?: Pokemon
  pokemonForm?: PokemonForm
  female?: boolean
}
