<script lang="ts">
  import type { GenerationalSprites, Sprites } from '$lib/api/SpritesResource'
  import { SpritePreference } from '$lib/menu/SpritePreference'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource'
  import { base } from '$app/paths'
  import { formatPokemonName } from '$lib/api/PokemonResource'
  import { getSprites, isPixelated } from '$lib/menu/tracker/view/sprites/SpriteDisplay'

  let {
    huntTracker,
    sprites,
    spritePreference,
    showNormal = false
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
  } = $props()

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
  let imageRendering = $derived(isPixelated(huntTracker, spritePreference) ? 'pixelated' : 'smooth')
  let id = $derived(huntTracker.id)

  function onError(event: Event) {
    const target = event.target as HTMLImageElement
    target.src = `${base}/assets/unknown.gif`
  }
</script>

<div class="sprite-root">
  <div class="sprite-container">
    <img
      onerror={onError}
      id="shiny-sprite-{id}"
      class="sprite"
      src={shinySprite}
      alt={shinyAlt}
      draggable="false"
      style="image-rendering: {imageRendering}"
    />
    {#if showNormal}
      <label for="shiny-sprite-{id}">Shiny {formatPokemonSpeciesName(pokemon)}</label>
    {/if}
  </div>
  {#if showNormal}
    <div class="sprite-container">
      <img
        id="sprite-{id}"
        class="sprite"
        src={normalSprite}
        alt={normalAlt}
        draggable="false"
        style="image-rendering: {imageRendering}"
      />
      <label for="sprite-{id}">Normal {formatPokemonSpeciesName(pokemon)}</label>
    </div>
  {/if}
</div>

<style lang="css">
  .sprite-root {
    display: flex;
    flex-direction: row;
    gap: var(--default-padding);
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .sprite-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--l-gap);
    background-color: #3b4b66;
    color: whitesmoke;
    padding: var(--default-padding);
    border-radius: var(--default-border-radius);
    width: 100%;
  }

  img.sprite {
    max-height: 350px;
    max-width: 350px;
    width: 100%;
    object-fit: contain;
    border-radius: var(--default-border-radius);
  }

  label {
    font-weight: bold;
  }
</style>
