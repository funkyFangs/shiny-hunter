import type { CreatedHuntTracker, HuntTracker } from '$lib/api/HuntTracker'
import { get, type Writable } from 'svelte/store'
import { CHAIN_HUNTING_METHODS } from '$lib/api/HuntingMethod'

export function moveHuntTracker(
  huntTrackers: HuntTracker[],
  leftIndex: number,
  startIndex: number,
  lastIndex: number
) {
  // Moving to beginning
  if (leftIndex === -1) {
    return [
      huntTrackers[startIndex],
      ...huntTrackers.slice(0, startIndex),
      ...huntTrackers.slice(startIndex + 1)
    ]
  }
  // Moving to end
  else if (leftIndex === lastIndex) {
    return [
      ...huntTrackers.slice(0, startIndex),
      ...huntTrackers.slice(startIndex + 1),
      huntTrackers[startIndex]
    ]
  }
  // Moving to the left
  else if (startIndex < leftIndex) {
    return [
      ...huntTrackers.slice(0, startIndex),
      ...huntTrackers.slice(startIndex + 1, leftIndex + 1),
      huntTrackers[startIndex],
      ...huntTrackers.slice(leftIndex + 1)
    ]
  }
  // Moving to the right
  else {
    return [
      ...huntTrackers.slice(0, leftIndex + 1),
      huntTrackers[startIndex],
      ...huntTrackers.slice(leftIndex + 1, startIndex),
      ...huntTrackers.slice(startIndex + 1)
    ]
  }
}

export function focusTab(
  index: number,
  selectedTrackerIndex: Writable<number>,
  tabs: HTMLElement[]
) {
  selectedTrackerIndex.set(index)
  tabs[index]?.focus()
}

export function newHuntTracker(
  createdHuntTracker: CreatedHuntTracker,
  nextId: Writable<number>
): HuntTracker {
  const id = get(nextId)
  nextId.update((id) => id + 1)
  return {
    id,
    count: createdHuntTracker.count,
    chain: CHAIN_HUNTING_METHODS.has(createdHuntTracker.method)
      ? {
          current: 0,
          max: 0
        }
      : undefined,
    startDate: new Date().toISOString(),
    method: createdHuntTracker.method,
    generation: createdHuntTracker.generation,
    versionGroup: createdHuntTracker.versionGroup,
    version: createdHuntTracker.version,
    shinyCharm: createdHuntTracker.shinyCharm,
    lure: createdHuntTracker.lure,
    researchLevel: createdHuntTracker.researchLevel,
    isMassive: createdHuntTracker.isMassive,
    sparklingPowerLevel: createdHuntTracker.sparklingPowerLevel,
    pokemonSpecies: createdHuntTracker.pokemonSpecies.name,
    pokemon:
      createdHuntTracker.pokemon?.name === createdHuntTracker.pokemonSpecies.name
        ? undefined
        : createdHuntTracker.pokemon?.name,
    pokemonForm:
      createdHuntTracker.pokemonForm?.name === createdHuntTracker.pokemon?.name
        ? undefined
        : createdHuntTracker.pokemonForm?.name,
    female: createdHuntTracker.female
  }
}
