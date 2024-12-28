<script lang="ts">
  import type { GenerationalSprites, Sprites } from '$lib/api/SpritesResource'
  import { getSpriteVersionGroup } from '$lib/api/SpritesResource'
  import { SpritePreference } from '$lib/menu/SpritePreference'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { toRomanNumerals } from '$lib/utilities/Strings'
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource'
  import { base } from '$app/paths'
  import { formatPokemonName } from '$lib/api/PokemonResource'

  let {
    huntTracker,
    sprites,
    spritePreference,
    showNormal = false,
    index
  }: {
    huntTracker: HuntTracker
    sprites: {
      [pokemonName: string]: {
        sprites: GenerationalSprites
        forms: {
          [formName: string]: Sprites
        }
      }
    }
    spritePreference: SpritePreference
    showNormal: boolean
    index: number
  } = $props()

  function getSprites(
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

  const selectedSprites = $derived(getSprites(sprites, huntTracker, spritePreference))
  const { female, pokemon, pokemonSpecies } = huntTracker

  const shinySprite = $derived(
    female ? selectedSprites.frontShinyFemale : selectedSprites.frontShiny
  )
  const shinyAlt = $derived(
    female
      ? `The sprite for shiny female ${formatPokemonName(pokemonSpecies, pokemon ?? pokemonSpecies)}`
      : `The sprite for shiny ${formatPokemonName(pokemonSpecies, pokemon ?? pokemonSpecies)}`
  )
  const normalSprite = $derived(female ? selectedSprites.frontFemale : selectedSprites.frontDefault)
  const normalAlt = $derived(
    female
      ? `The sprite for female ${formatPokemonName(pokemonSpecies, pokemon ?? pokemonSpecies)}`
      : `The sprite for ${formatPokemonName(pokemonSpecies, pokemon ?? pokemonSpecies)}`
  )

  function onError(event: Event) {
    const target = event.target as HTMLImageElement
    target.src = `${base}/assets/unknown.gif`
  }
</script>

<div class="sprite-root">
  <div class="sprite-container">
    <img
      onerror={onError}
      id="shiny-sprite-{index}"
      class="sprite"
      src={shinySprite}
      alt={shinyAlt}
      draggable="false"
    />
    {#if showNormal}
      <label for="shiny-sprite-{index}">Shiny {formatPokemonSpeciesName(pokemon)}</label>
    {/if}
  </div>
  {#if showNormal}
    <div class="sprite-container">
      <img
        id="sprite-{index}"
        class="sprite"
        src={normalSprite}
        alt={normalAlt}
        draggable="false"
      />
      <label for="sprite-{index}">Normal {formatPokemonSpeciesName(pokemon)}</label>
    </div>
  {/if}
</div>

<style lang="less">
  @import '../../../../style/palette';
  @import '../../../../style/positioning';

  .sprite-root {
    display: flex;
    flex-direction: row;
    gap: @padding-length;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .sprite-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: @gap-length;
    background-color: desaturate(@darker-indigo, 25%);
    color: contrast($background-color);
    padding: @padding-length;
    border-radius: @border-radius;
    width: 100%;
  }

  img.sprite {
    image-rendering: pixelated;
    max-height: 350px;
    max-width: 350px;
    width: 100%;
    object-fit: contain;
    border-radius: @border-radius;
  }

  label {
    font-weight: bold;
  }
</style>
