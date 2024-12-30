<script lang="ts">
  import { formatVersionName } from '$lib/api/VersionResource'
  import { formatPokemonName } from '$lib/api/PokemonResource'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { delimitedTitleCase } from '$lib/utilities/Strings'
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource'
  import PokemonDetails from '$lib/menu/tracker/view/PokemonDetails.svelte'
  import { fade } from 'svelte/transition'
  import { HuntingMethod } from '$lib/api/HuntingMethod'
  import Kebab from '$lib/menu/controls/Kebab.svelte'

  let { data } = $props()
  const history = data.history
  const emptyField = '-'

  function getPokemon(record: HuntTracker) {
    return record.pokemon
      ? formatPokemonName(record.pokemonSpecies, record.pokemon)
      : formatPokemonSpeciesName(record.pokemonSpecies)
  }

  function getPokemonForm(record: HuntTracker) {
    return record.pokemonForm ? delimitedTitleCase(record.pokemonForm) : emptyField
  }

  function getMaxChainHeader(record: HuntTracker) {
    switch (record.method) {
      case HuntingMethod.POKE_RADAR:
      case HuntingMethod.CONSECUTIVE_FISHING:
      case HuntingMethod.SOS_BATTLE:
        return 'Longest Chain'
      case HuntingMethod.ULTRA_WARP_RIDE:
        return 'Furthest Distance'
      default:
        return emptyField
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
      default:
        return emptyField
    }
  }

  function getElapsedTime(startDate: Date, endDate: Date) {
    const startDateUTC = Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds()
    )
    const endDateUTC = Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes(),
      endDate.getSeconds()
    )

    const difference = endDateUTC - startDateUTC

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor(difference / (1000 * 60 * 60)) % 24
    const minutes = Math.floor(difference / (1000 * 60)) % 60
    const seconds = Math.floor(difference / 1000) % 60

    return `${days} days, ${hours} hours, ${minutes} minutes, & ${seconds} seconds`
  }

  let selectedRecordIndex = $state(-1)
  let selectedRecord = $derived($history[selectedRecordIndex])
  let menuOpen = $state(false)

  function selectRecord(index: number) {
    selectedRecordIndex = index === selectedRecordIndex ? -1 : index
  }

  function deleteRecord() {
    if (confirm('Are you sure you want to delete this record? This action is permanent.')) {
      history.update((records) => [
        ...records.slice(0, selectedRecordIndex),
        ...records.slice(selectedRecordIndex + 1)
      ])
      selectedRecordIndex = -1
    }
    menuOpen = false
  }
</script>

<h1>History</h1>

<div id="history">
  {#if $history.length}
    <p>Click a record to view its details.</p>
    <table id="records">
      <thead>
        <tr>
          <th scope="col">Version</th>
          <th scope="col">Method</th>
          <th scope="col">Pokemon</th>
          <th scope="col">Form</th>
          <th scope="col">Count</th>
        </tr>
      </thead>
      <tbody>
        {#each $history as record, index}
          <tr onclick={() => selectRecord(index)} aria-selected={index === selectedRecordIndex}>
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
        {#snippet deleteRecordSnippet()}
          <button class="record-menu-control" onclick={deleteRecord}>Delete Record</button>
        {/snippet}

        <div id="record-menu">
          <Kebab bind:open={menuOpen} menuControls={[deleteRecordSnippet]} />
        </div>

        <div id="pokemon-details">
          <PokemonDetails huntTracker={selectedRecord} />
        </div>

        <table id="record-table">
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
            <tr>
              <th scope="row">Count</th>
              <td>{selectedRecord.count}</td>
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
            {#if selectedRecord.startDate !== undefined && selectedRecord.endDate !== undefined}
              {@const startDate = new Date(selectedRecord.startDate)}
              {@const endDate = new Date(selectedRecord.endDate)}

              <tr>
                <th scope="row">Start Date</th>
                <td>{startDate.toLocaleString()}</td>
              </tr>
              <tr>
                <th scope="row">End Date</th>
                <td>{endDate.toLocaleString()}</td>
              </tr>
              <tr>
                <th scope="row">Elapsed Time</th>
                <td>{getElapsedTime(startDate, endDate)}</td>
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

<style lang="less">
  @import '../../style/positioning';
  @import '../../style/palette';

  h1,
  p {
    color: contrast(@indigo);
  }

  #history {
    display: flex;
    flex-direction: column;
    gap: @padding-length;
  }

  #records {
    width: 100%;
  }

  #records > tbody > tr {
    transition: background-color 0.125s;
    cursor: pointer;
  }

  #records > tbody > tr:hover,
  tr[aria-selected='true'] {
    background-color: @asparagus;
    color: contrast($background-color);
  }

  #record-details {
    padding: @gap-length;
    background-color: @shark;
    border-radius: @border-radius;
    display: grid;
    grid-template-columns: min-content auto min-content;
    row-gap: @gap-length;
    align-items: center;
  }

  #record-menu {
    grid-column: 3 / 4;
  }

  #pokemon-details,
  #record-table {
    grid-column: 1 / 4;
  }

  #record-menu,
  #pokemon-details {
    grid-row: 1;
  }

  #record-menu {
    z-index: 1;
  }

  #record-menu {
    grid-row: 1;
  }

  .record-menu-control {
    background: none;
    width: 100%;
    padding: @gap-length;
    text-align: left;
  }
</style>
