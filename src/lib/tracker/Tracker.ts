import type { Game } from '$lib/games/Game'
import type { Pokemon } from '$lib/pokemon/Pokemon'
import type { Method } from '$lib/methods/Method'

export class Tracker {
  game: Game
  pokemon: Pokemon
  method: Method
  count: number = 0

  constructor(game: Game, pokemon: Pokemon, method: Method) {
    this.game = game
    this.pokemon = pokemon
    this.method = method
  }
}