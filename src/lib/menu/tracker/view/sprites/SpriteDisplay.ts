import {
  type GenerationalSprites,
  getSpriteVersionGroup,
  type Sprites
} from '$lib/api/SpritesResource'
import type { HuntTracker } from '$lib/api/HuntTracker'
import { SpritePreference } from '$lib/menu/SpritePreference'
import { toRomanNumerals } from '$lib/utilities/Strings'
import type { Generation } from '$lib/api/GenerationResource'

export type SpriteMap = {
  [pokemonSpeciesName: string]: {
    [pokemonName: string]: {
      sprites: GenerationalSprites
      forms: {
        [formName: string]: Sprites
      }
    }
  }
}

export function buildSpriteMap(generations: Generation[]): SpriteMap {
  return Object.fromEntries(
    generations
      .flatMap((generation) => generation.pokemonSpecies)
      .filter((pokemonSpecies) => pokemonSpecies.varieties)
      .map((pokemonSpecies) => [
        pokemonSpecies.name,
        Object.fromEntries(
          pokemonSpecies.varieties!.map((pokemon) => [
            pokemon.name,
            {
              sprites: pokemon.sprites,
              forms: Object.fromEntries(pokemon.forms.map((form) => [form.name, form.sprites]))
            }
          ])
        )
      ])
  )
}

function defaultsToHome(generation: number, versionGroup: string) {
  return generation > 7 || versionGroup == 'lets-go-pikachu-lets-go-eevee'
}

export function getSprites(
  sprites: {
    [pokemonName: string]: {
      sprites: GenerationalSprites
      forms: {
        [formName: string]: Sprites
      }
    }
  },
  huntTracker: HuntTracker,
  spritePreference: SpritePreference
): Sprites {
  // Get the selected variety if specified or else the first variety
  const pokemon = huntTracker.pokemon ? sprites[huntTracker.pokemon] : Object.values(sprites)[0]

  switch (spritePreference) {
    case SpritePreference.SHOWDOWN:
      return pokemon.sprites.other.showdown!
    case SpritePreference.HOME:
      return pokemon.sprites.other.home!
    case SpritePreference.GENERATION: {
      const { versionGroup, generation } = huntTracker
      if (defaultsToHome(generation, versionGroup!)) {
        return pokemon.sprites.other.home!
      }

      // Get the selected form if specified or else the generational sprites
      const baseSprites = huntTracker.pokemonForm
        ? pokemon.forms[huntTracker.pokemonForm]
        : pokemon.sprites.versions[`generation-${toRomanNumerals(huntTracker.generation)}`][
            getSpriteVersionGroup(huntTracker.version, huntTracker.versionGroup)
          ]

      return 'animated' in baseSprites ? (baseSprites.animated as Sprites) : baseSprites
    }
  }
}

export function isPixelated(huntTracker: HuntTracker, spritePreference: SpritePreference) {
  return (
    spritePreference === SpritePreference.SHOWDOWN ||
    !defaultsToHome(huntTracker.generation, huntTracker.versionGroup!)
  )
}
