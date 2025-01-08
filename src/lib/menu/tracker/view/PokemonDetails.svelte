<script lang="ts">
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource.js'
  import { formatPokemonName } from '$lib/api/PokemonResource.js'
  import { delimitedTitleCase } from '$lib/utilities/Strings.js'
  import type { HuntTracker } from '$lib/api/HuntTracker'

  let {
    huntTracker = $bindable()
  }: {
    huntTracker: HuntTracker
    id?: string
  } = $props()
</script>

<div id="pokemon-details-{huntTracker.id}">
  <span class="pokemon-species">{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}</span>
  {#if huntTracker.pokemon}
    <span class="pokemon">{formatPokemonName(huntTracker.pokemonSpecies, huntTracker.pokemon)}</span
    >
  {/if}
  {#if huntTracker.pokemonForm}
    <span class="pokemon-form">{delimitedTitleCase(huntTracker.pokemonForm)}</span>
  {/if}
</div>

<style lang="less">
  @import '../../../../style/positioning';

  div {
    display: flex;
    flex-direction: column;
    gap: @gap-length;
    align-items: center;
    justify-content: center;
  }

  span {
    color: white;
  }

  .pokemon-species {
    font-size: 32px;
    font-weight: bold;
  }

  .pokemon,
  .pokemon-form {
    font-size: 20px;
  }
</style>
