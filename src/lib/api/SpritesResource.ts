export interface SpritesResource {
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface AnimatedSpritesResource extends SpritesResource {
  animated: SpritesResource
}

export interface GenerationalSpritesResource extends SpritesResource {
  versions: {
    [generationName: string]: {
      [versionGroup: string]: SpritesResource | AnimatedSpritesResource
    }
  }
  other: {
    showdown: SpritesResource | null
    home: SpritesResource | null
  }
}

export interface Sprites {
  frontDefault: string
  frontFemale: string
  frontShiny: string
  frontShinyFemale: string
}

export interface AnimatedSprites extends Sprites {
  animated: Sprites
}

export type GenerationalSprites = {
  versions: {
    [generationName: string]: {
      [game: string]: Sprites | AnimatedSprites
    }
  }
  other: {
    showdown: Sprites | null
    home: Sprites | null
  }
}

export function getSpriteVersionGroup(versionName: string, versionGroupName?: string) {
  switch (versionName) {
    case 'gold':
    case 'silver':
      return versionName
    case 'black-2':
    case 'white-2':
      return 'black-white'
    case 'omega-ruby':
    case 'alpha-sapphire':
      return 'omegaruby-alphasapphire'
    case 'sun':
    case 'moon':
      return 'ultra-sun-ultra-moon'
    default:
      return versionGroupName ?? versionName
  }
}
