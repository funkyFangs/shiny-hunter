export class Game {
  displayName: string
  generation: number
  imageFolder: string
  iconFolder: string
  pokemonFile: string

  constructor(name: string, generation: number, imageFolder: string, iconFolder: string, pokemonFile: string) {
    this.displayName = name
    this.generation = generation
    this.imageFolder = `/images/${imageFolder}`
    this.iconFolder = `/icons/${iconFolder}`
    this.pokemonFile = `/pokemon/${pokemonFile}.pokemon.json`
  }
}

/**
 * An enumeration of available games, grouped by generation
 */
export const Games = new Map<string, Game>([
  ['GOLD', new Game('Gold', 2, 'gold', '2', 'gold_silver_crystal')],
  ['SILVER', new Game('Silver', 2, 'silver', '2', 'gold_silver_crystal')],
  ['CRYSTAL', new Game('Crystal', 2, 'crystal', '2', 'gold_silver_crystal')],
  ['RUBY', new Game('Ruby', 3, 'ruby_sapphire', '3_4_5', 'ruby_sapphire')],
  ['SAPPHIRE', new Game('Sapphire', 3, 'ruby_sapphire', '3_4_5', 'ruby_sapphire')],
  ['EMERALD', new Game('Emerald', 3, 'emerald', '3_4_5', 'emerald')],
  ['FIRE_RED', new Game('Fire Red', 3, 'fire-red_leaf-green', '3_4_5', 'fire-red_leaf-green')],
  ['LEAF_GREEN', new Game('Leaf Green', 3, 'fire-red_leaf-green', '3_4_5', 'fire-red_leaf-green')],
  ['DIAMOND', new Game('Diamond', 4, 'diamond_pearl', '3_4_5', 'diamond_peal')],
  ['PEARL', new Game('Pearl', 4, 'diamond_pearl', '3_4_5', 'diamond_pearl')],
  ['PLATINUM', new Game('Platinum', 4, 'platinum', '3_4_5', 'platinum')],
  ['HEART_GOLD', new Game('Heart Gold', 4, 'heart-gold_soul-silver', '3_4_5', 'heart-gold_soul-silver')],
  ['SOUL_SILVER', new Game('Soul Silver', 4, 'heart-gold_soul-silver', '3_4_5', 'heart-gold_soul-silver')],
  ['BLACK', new Game('Black', 5, 'black_white', '3_4_5', 'black_white')],
  ['WHITE', new Game('White', 5, 'black_white', '3_4_5', 'black_white')],
  ['BLACK_2', new Game('Black 2', 5, 'black-2_white-2', '3_4_5', 'black-2_white-2')],
  ['WHITE_2', new Game('White 2', 5, 'black-2_white-2', '3_4_5', 'black-2_white-2')]
])