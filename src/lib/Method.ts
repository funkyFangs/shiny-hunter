export class Method {
  displayName: string
  singularUnit: string
  pluralUnit: string
  odds: number[]

  constructor(displayName: string, singularUnit: string, pluralUnit: string, odds: number[]) {
    this.displayName = displayName
    this.singularUnit = singularUnit
    this.pluralUnit = pluralUnit
    this.odds = odds
  }
}

// https://mrnbayoh.github.io/pkmn6gen/shiny_calculator/ Consecutive Fishing
// https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9_Radar#Chain_Bonuses Gen 6 Poke Radar