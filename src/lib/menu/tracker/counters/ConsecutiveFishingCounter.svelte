<script lang="ts">
  import Fraction from '$lib/menu/tracker/counters/Odds.svelte'
  import { sanitizeInteger } from '$lib/utilities/Strings'

  export let chains: number = 0
  export let currentChainLength: number = 0
  export let maxChainLength: number = 0
  export let shinyCharm: boolean = false

  $: chains = sanitizeInteger(chains)
  $: currentChainLength = sanitizeInteger(currentChainLength)

  function incrementChain() {
    currentChainLength += 1
    maxChainLength = Math.max(currentChainLength, maxChainLength)
  }

  function resetChain() {
    currentChainLength = 0
    chains += 1
  }

  /**
   * Computes the probability of finding a shiny Pokémon given a chain length
   * @param chainLength the length of the chain
   * @see https://mrnbayoh.github.io/pkmn6gen/shiny_calculator/
   */
  function getOdds(chainLength: number) {
    const recompute = 1 + (shinyCharm ? 2 : 0) + Math.min(chainLength, 20) * 2
    const odds = 1 - Math.pow(4095 / 4096, recompute)
    return Math.round(1 / odds)
  }

  $: odds = getOdds(currentChainLength)
</script>

<div id="counter">
  <button on:click={resetChain} disabled={currentChainLength === 0}>&#10227;</button>
  <table>
    <thead>
      <tr>
        <th><label for="chain-length">Chain Length</label></th>
        <th><label for="chains">Number of Chains</label></th>
        <th><label for="odds">Odds</label></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input id="chain-length" type="number" min="0" bind:value={currentChainLength} /></td>
        <td><input id="chains" type="number" min="0" bind:value={chains} /></td>
        <td><Fraction id="odds" numerator={1} denominator={odds} /></td>
      </tr>
    </tbody>
  </table>
  <button on:click={incrementChain}>&plus;</button>
</div>

<style>
  input {
    text-align: center;
    border: none;
    background: none;
    font-weight: bold;
    color: var(--font-color);
    font-size: 1.1em;
    padding: 0;
    max-width: 60px;
  }

  input:focus {
    background-color: var(--primary-light);
  }

  #counter {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    justify-content: center;
  }

  #counter > button {
    height: 87px;
    font-size: 1.5em;
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
