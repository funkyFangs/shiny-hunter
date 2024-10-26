<script lang="ts">
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource'
  import { formatVersionName } from '$lib/api/VersionResource'
  import { formatPokemonName } from '$lib/api/PokemonResource'
  import { HuntingMethod } from '$lib/api/HuntingMethod'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { delimitedTitleCase } from '$lib/utilities/Strings'

  export let data

  const history = data.history

  function getUnit(method: HuntingMethod) {
    switch (method) {
      case HuntingMethod.POKE_RADAR:
        return 'Encounters'
      case HuntingMethod.CONSECUTIVE_FISHING:
        return 'Reels'
      case HuntingMethod.SOS_BATTLE:
        return 'Allies'
      case HuntingMethod.ULTRA_WARP_RIDE:
        return 'Light Years'
    }
  }

  function getPokemon(record: HuntTracker) {
    return record.pokemon ? formatPokemonName(record.pokemonSpecies, record.pokemon) : '-'
  }

  function getPokemonForm(record: HuntTracker) {
    return record.pokemonForm ? delimitedTitleCase(record.pokemonForm) : '-'
  }

  function getGender(record: HuntTracker) {
    return record.female === undefined ? '-' : record.female ? 'Female' : 'Male'
  }

  function getMaximum(record: HuntTracker) {
    return record.chain ? `${record.chain.max} ${getUnit(record.method)}` : '-'
  }
</script>

<h1>History</h1>

{#if $history.length}
  <table>
    <thead>
      <tr>
        <th>Version</th>
        <th>Method</th>
        <th>Pokemon</th>
        <th>Variety</th>
        <th>Form</th>
        <th>Gender</th>
        <th>Count</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each $history as record}
        <tr>
          <td><span>{formatVersionName(record.version)}</span></td>
          <td><span>{record.method}</span></td>
          <td><span>{formatPokemonSpeciesName(record.pokemonSpecies)}</span></td>
          <td><span>{getPokemon(record)}</span></td>
          <td><span>{getPokemonForm(record)}</span></td>
          <td><span>{getGender(record)}</span></td>
          <td><span>{record.count}</span></td>
          <td><span>{getMaximum(record)}</span></td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>You don't have any shiny hunts in your history! Complete a shiny hunt to view your history.</p>
{/if}

<style>
  table {
    margin-right: var(--gap-length);
  }
</style>
