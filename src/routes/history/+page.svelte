<script lang="ts">
  import { flip } from 'svelte/animate'
  import { formatVersionName } from '$lib/api/VersionResource'
  import { formatPokemonName } from '$lib/api/PokemonResource'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { delimitedTitleCase } from '$lib/utilities/Strings'
  import { formatPokemonSpeciesName } from '$lib/api/PokemonSpeciesResource'
  import PokemonDetails from '$lib/menu/tracker/view/PokemonDetails.svelte'
  import { fade } from 'svelte/transition'
  import { HuntingMethod } from '$lib/api/HuntingMethod'
  import Device from 'svelte-device-info'

  let { data } = $props()
  const { history, keepHistory } = data
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
  }
</script>

<h1>History</h1>

<div id="history">
  {#if !$keepHistory}
    <p>History is currently disabled. Enable it in the settings menu to view your history.</p>
  {:else if $history.length}
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
        {#each $history as record, index (record.id)}
          <tr
            onclick={() => selectRecord(index)}
            aria-selected={index === selectedRecordIndex}
            animate:flip={{ duration: 200 }}
          >
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
        <button id="delete-record" class:hoverable={Device.canHover} onclick={deleteRecord}
          >&times;</button
        >

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

  #delete-record {
    grid-column: 3 / 4;
    z-index: 1;
    align-self: start;
    font-size: 20.5px;
    min-width: 38px;
    min-height: 38px;
    background: none;
    color: contrast(@shark);

    &:hover:not(:active),
    &:not(.hoverable) {
      background-color: @darker-indigo;
      color: contrast($background-color);
    }

    &:active {
      background-color: @dark-indigo;
      color: contrast($background-color);
    }
  }

  #pokemon-details,
  #record-table {
    grid-column: 1 / 4;
  }

  #delete-record,
  #pokemon-details {
    grid-row: 1;
  }
</style>
