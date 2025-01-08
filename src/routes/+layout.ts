import type { PageLoad } from '../../.svelte-kit/types/src/routes/$types'
import { localStorageWritable } from '$lib/storage/StorageWritable'
import { SPRITE_PREFERENCE_STORE, SpritePreference } from '$lib/menu/SpritePreference'

export const prerender = true
export const ssr = false

export const load: PageLoad = () => {
  return {
    spritePreference: localStorageWritable(SPRITE_PREFERENCE_STORE, SpritePreference.SHOWDOWN),
    showNormal: localStorageWritable('showNormal', false),
    promptOnClose: localStorageWritable('promptOnClose', true),
    keepHistory: localStorageWritable('keepHistory', true),
    showFraction: localStorageWritable('showFraction', true),
    showPercentage: localStorageWritable('showPercentage', true)
  }
}
