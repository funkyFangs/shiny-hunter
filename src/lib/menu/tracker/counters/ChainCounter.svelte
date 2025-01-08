<script lang="ts">
  import Odds from '$lib/menu/tracker/counters/odds/Odds.svelte'
  import type { OddsFunction } from '$lib/menu/tracker/counters/odds/Odds'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { fade } from 'svelte/transition'

  let {
    huntTracker,
    currentChain = $bindable(),
    maxChain = $bindable(),
    count = $bindable(),
    currentChainLabel = 'Chain Length',
    chainLabel = 'Chains',
    getOdds,
    showFraction,
    showPercentage
  }: {
    huntTracker: HuntTracker
    currentChain: number
    maxChain: number
    count: number
    currentChainLabel?: string
    chainLabel?: string
    getOdds: OddsFunction
    showFraction: boolean
    showPercentage: boolean
  } = $props()

  function incrementChain() {
    maxChain = Math.max(++currentChain, maxChain)
  }

  function resetChain() {
    currentChain = 0
    count += 1
  }

  let odds = $derived(getOdds(huntTracker))
  let id = $derived(huntTracker.id)
  let showOdds = $derived(showFraction || showPercentage)
</script>

{#if huntTracker.chain}
  <div class="counter-container">
    <button
      onclick={resetChain}
      disabled={currentChain === 0}
      aria-label="Reset {currentChainLabel}">&#10227;</button
    >
    <table>
      <thead>
        <tr>
          <th scope="col"><label for="chain-length-{id}">{currentChainLabel}</label></th>
          <th scope="col"><label for="chains-{id}">{chainLabel}</label></th>
          {#if showOdds}
            <th transition:fade={{ duration: 200 }} scope="col"
              ><label for="odds-{id}">Odds</label></th
            >
          {/if}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input type="number" min="0" id="chain-length-{id}" bind:value={currentChain} />
          </td>
          <td>
            <input type="number" min="0" id="chains-{id}" bind:value={count} />
          </td>
          {#if showOdds}
            <td transition:fade={{ duration: 200 }}>
              <Odds
                id="odds-{id}"
                inputs="chain-length"
                numerator={odds.numerator}
                denominator={odds.denominator}
                {showFraction}
                {showPercentage}
              />
            </td>
          {/if}
        </tr>
      </tbody>
    </table>
    <button onclick={() => incrementChain()} aria-label="Increment {currentChainLabel}"
      >&plus;</button
    >
  </div>
{/if}

<style lang="less">
  @import '../../../../style/palette';
  @import '../../../../style/positioning';

  input {
    text-align: center;
    background: none;
    font-weight: bold;
    font-size: 1.1em;
    padding: 0;
    max-width: 60px;
    color: contrast(@darkest-indigo);
  }

  input:hover {
    background-color: @darker-indigo;
    color: contrast($background-color);
  }

  input:focus-visible {
    background-color: @indigo;
    color: contrast($background-color);
  }

  .counter-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: center;
    max-width: calc(100vw - 4 * @gap-length);
  }

  button {
    font-size: 1.5em;
    background-color: @indigo;
    color: contrast($background-color);
  }

  button:hover {
    background-color: lighten(@indigo, 5%);
    color: contrast($background-color);
  }

  button:active {
    background-color: lighten(@indigo, 10%);
    color: contrast($background-color);
  }

  button:disabled {
    background-color: desaturate(@indigo, 25%);
    color: contrast($background-color);
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
</style>
