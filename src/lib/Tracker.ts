import type { Game } from '$lib/Game';
import type { Pokemon } from '$lib/Pokemon';
import type { Method } from '$lib/Method';
import { localWritable } from '$lib/utilities/StoreUtilities';
import { writable } from 'svelte/store';

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
export const selectedTracker = writable<Tracker | undefined>(undefined);