import type { Game } from '$lib/games/Game'
import type { Pokemon } from '$lib/pokemon/Pokemon'
import type { Method } from '$lib/methods/Method'

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