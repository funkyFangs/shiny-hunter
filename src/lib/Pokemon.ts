import { selectedTracker } from '$lib/Tracker';
import { derived } from 'svelte/store';

export class Pokemon {
  displayName: string
  image?: string
  shinyImage?: string
  icon?: string
  variants?: Variant[]

  constructor(displayName: string, image?: string, shinyImage?: string, icon?: string, variants?: Variant[]) {
    this.displayName = displayName;
    this.image = image;
    this.shinyImage = shinyImage;
    this.icon = icon;
    this.variants = variants ? variants : []
  }
}

export class Variant {
  displayName: string
  image: string
  shinyImage: string
  icon: string

  constructor(displayName: string, image: string, shinyImage: string, icon: string) {
    this.displayName = displayName;
    this.image = image;
    this.shinyImage = shinyImage;
    this.icon = icon;
  }
}

export const hasVariants = derived(selectedTracker, tracker => tracker?.pokemon?.variants?.length);
export const selectedVariant = derived(selectedTracker,
  (tracker) => tracker?.pokemon?.variants?.length && tracker.selectedVariant !== undefined
    ? tracker.pokemon.variants[tracker.selectedVariant]
    : undefined)