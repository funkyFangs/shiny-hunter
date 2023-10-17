import type { Game } from '$lib/Game';
import type { Pokemon } from '$lib/Pokemon';
import type { Method } from '$lib/Method';
import { localWritable } from '$lib/utilities/StoreUtilities';
import { derived } from 'svelte/store';

export class Tracker {
  game: Game;
  pokemon: Pokemon;
  method: Method;
  shinyCharm: boolean;
  count: number = 0;
  selectedVariant?: number;

  constructor(game: Game, pokemon: Pokemon, method: Method, shinyCharm: boolean) {
    this.game = game;
    this.pokemon = pokemon;
    this.method = method;
    this.shinyCharm = shinyCharm;
    
    if (pokemon.variants.length) {
      this.selectedVariant = 0;
    }
  }
}

export const trackers = localWritable<Tracker[]>('trackers', []);
export const hasTrackers = derived(trackers, trackers => trackers.length > 0);
export const selectedTrackerIndex = localWritable<number | undefined>('tracker', undefined);
export const selectedTracker = derived([trackers, selectedTrackerIndex],
  ([trackers, selectedIndex]) => selectedIndex !== undefined ? trackers[selectedIndex] : undefined,
  undefined);