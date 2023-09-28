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

  increment() {
    this.count += 1
  }

  decrement() {
    this.count = Math.max(this.count - 1, 0)
  }

  reset() {
    this.count = 0
  }

  set(count: number) {
    this.count = Math.max(count, 0)
  }

  getOdds(): number {
    return this.method.odds[Math.min(Math.max(this.count, 0), this.method.odds.length)]
  }
}