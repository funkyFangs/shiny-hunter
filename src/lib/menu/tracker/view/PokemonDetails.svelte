<script lang="ts">
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource.js'
  import { formatPokemonName } from '$lib/api/PokemonResource.js'
  import { delimitedTitleCase } from '$lib/utilities/Strings.js'
  import type { HuntTracker } from '$lib/api/HuntTracker'

  let { huntTracker = $bindable() }: { huntTracker: HuntTracker } = $props()
</script>

<section>
  <h1 class="pokemon-species">{formatPokemonSpeciesName(huntTracker.pokemonSpecies)}</h1>
  {#if huntTracker.pokemon}
    <h2 class="pokemon">{formatPokemonName(huntTracker.pokemonSpecies, huntTracker.pokemon)}</h2>
  {/if}
  {#if huntTracker.pokemonForm}
    <h2 class="pokemon-form">{delimitedTitleCase(huntTracker.pokemonForm)}</h2>
  {/if}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-length);
    align-items: center;
    justify-content: center;
  }
</style>
