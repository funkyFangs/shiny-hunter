<script lang="ts">
  import { formatVersionName } from '$lib/api/VersionResource'
  import { formatPokemonName } from '$lib/api/PokemonResource'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { delimitedTitleCase } from '$lib/utilities/Strings'
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource'
  import PokemonDetails from '$lib/menu/tracker/view/PokemonDetails.svelte'
  import { fade } from 'svelte/transition'
  import { HuntingMethod } from '$lib/api/HuntingMethod'

  let { data } = $props()
  const history = data.history

  function getPokemon(record: HuntTracker) {
    return record.pokemon
      ? formatPokemonName(record.pokemonSpecies, record.pokemon)
      : formatPokemonSpeciesName(record.pokemonSpecies)
  }

  function getPokemonForm(record: HuntTracker) {
    return record.pokemonForm ? delimitedTitleCase(record.pokemonForm) : '-'
  }

  function getMaxChainHeader(record: HuntTracker) {
    switch (record.method) {
      case HuntingMethod.POKE_RADAR:
      case HuntingMethod.CONSECUTIVE_FISHING:
      case HuntingMethod.SOS_BATTLE:
        return 'Longest Chain'
      case HuntingMethod.ULTRA_WARP_RIDE:
        return 'Furthest Distance'
    }
  }

  function getMaxChain(record: HuntTracker) {
    const max = record.chain!.max
    switch (record.method) {
      case HuntingMethod.POKE_RADAR:
        return max === 1 ? '1 Encounter' : `${max} Encounters`
      case HuntingMethod.CONSECUTIVE_FISHING:
        return max === 1 ? '1 Reel' : `${max} Reels`
      case HuntingMethod.SOS_BATTLE:
        return max === 1 ? '1 Ally' : `${max} Allies`
      case HuntingMethod.ULTRA_WARP_RIDE:
        return max === 1 ? '1 Light Year' : `${max} Light Years`
    }
  }

  let selectedRecord = $state<HuntTracker>()
</script>

<h1>History</h1>

<div id="history">
  {#if $history.length}
    <p>Click a record to view its details.</p>
    <table id="records">
      <thead>
        <tr>
          <th>Version</th>
          <th>Method</th>
          <th>Pokemon</th>
          <th>Form</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {#each $history as record}
          <tr onclick={() => (selectedRecord = record)}>
            <td>
              <span>{formatVersionName(record.version)}</span>
            </td>
            <td>
              <span>{record.method}</span>
            </td>
            <td>
              <span>{getPokemon(record)}</span>
            </td>
            <td>
              <span>{getPokemonForm(record)}</span>
            </td>
            <td>
              <span>{record.count}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if selectedRecord}
      <div id="record-details" transition:fade={{ duration: 250 }}>
        <PokemonDetails huntTracker={selectedRecord} />
        <table>
          <tbody>
            <tr>
              <th scope="row">Generation</th>
              <td>{selectedRecord.generation}</td>
            </tr>
            <tr>
              <th scope="row">Version</th>
              <td>{formatVersionName(selectedRecord.version)}</td>
            </tr>
            <tr>
              <th scope="row">Method</th>
              <td>{selectedRecord.method}</td>
            </tr>
            <tr>
              <th scope="row">Status</th>
              <td>{selectedRecord.complete ? 'Found' : 'Not Found'}</td>
            </tr>
            {#if selectedRecord.shinyCharm !== undefined}
              <tr>
                <th scope="row">Shiny Charm</th>
                <td>{selectedRecord.shinyCharm ? 'Yes' : 'No'}</td>
              </tr>
            {/if}
            {#if selectedRecord.chain}
              <tr>
                <th scope="row">{getMaxChainHeader(selectedRecord)}</th>
                <td>{getMaxChain(selectedRecord)}</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    {/if}
  {:else}
    <p>
      You don't have any shiny hunts in your history! Complete a shiny hunt to view your history.
    </p>
  {/if}
</div>

<style>
  #history {
    display: flex;
    flex-direction: column;
    gap: var(--padding-length);
  }

  #records {
    width: 100%;
  }

  #records > tbody > tr {
    transition: background-color 0.125s;
  }

  #records > tbody > tr:hover {
    background-color: var(--primary-light);
  }

  #record-details {
    padding: var(--gap-length);
    background-color: var(--primary-darker);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--padding-length);
  }
</style>
