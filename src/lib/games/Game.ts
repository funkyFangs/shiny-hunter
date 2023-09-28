export class Game {
  displayName: string
  generation: number
  imageFolder: string
  iconFolder: string
  pokemonFile: string
  methodsFile: string
  supportsShinyCharm: boolean

  constructor(name: string,
              generation: number,
              imageFolder: string,
              iconFolder: string,
              pokemonFile: string,
              methodsFile: string,
              supportsShinyCharm: boolean) {
    this.displayName = name
    this.generation = generation
    this.imageFolder = `/images/${imageFolder}`
    this.iconFolder = `/icons/${iconFolder}`
    this.pokemonFile = `/pokemon/${pokemonFile}.pokemon.json`
    this.methodsFile = `/methods/${methodsFile}.json`
    this.supportsShinyCharm = supportsShinyCharm
  }
}