import type { HuntTracker } from '$lib/api/HuntTracker'
import type { Writable } from 'svelte/store'

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
