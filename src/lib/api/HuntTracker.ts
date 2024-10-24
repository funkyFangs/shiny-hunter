import type { HuntingMethod } from '$lib/api/HuntingMethod'
import type { PokemonSpecies } from '$lib/api/PokemonSpeciesResource';
import type { Pokemon } from '$lib/api/PokemonResource';
import type { PokemonForm } from '$lib/api/PokemonFormResource';

export const HUNT_TRACKERS = 'huntTrackers';
export const SELECTED_TRACKER_INDEX = 'selectedTrackerIndex';

export interface HuntTracker {
	// Tracker Details
	count: number
	chain?: {
		current: number
		max: number
	}

	// Shiny Rates
	method: HuntingMethod
	shinyCharm?: boolean

	// Version Details
	generation: number
	versionGroup?: string
	version: string

	// Pokemon Details
	pokemonSpecies: string
	variety?: string
	form?: string
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
	variety?: Pokemon
	form?: PokemonForm
	female?: boolean
}