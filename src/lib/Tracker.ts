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

  constructor(game: Game, pokemon: Pokemon, method: Method, shinyCharm: boolean) {
    this.game = game;
    this.pokemon = pokemon;
    this.method = method;
    this.shinyCharm = shinyCharm;
  }
}

export const trackers = localWritable<Tracker[]>('trackers', []);
export const hasTrackers = derived(trackers, trackers => trackers.length > 0);
export const selectedIndex = localWritable<number | undefined>('selected', undefined);
export const selectedTracker = derived([trackers, selectedIndex],
  ([trackers, selectedIndex]) => selectedIndex !== undefined ? trackers[selectedIndex] : undefined,
  undefined);