<script lang="ts">
  import Fraction from '$lib/menu/tracker/counters/Odds.svelte'
  import { sanitizeInteger } from '$lib/utilities/Strings'

  export let chains: number = 0
  export let currentChainLength: number = 0
  export let maxChainLength: number = 0
  export let shinyCharm: boolean = false
  export let isSunOrMoon: boolean = false

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
    const length = isSunOrMoon ? chainLength % 256 : chainLength
    if (length <= 10) {
      return shinyCharm ? 1366 : 4096
    } else if (length <= 20) {
      return shinyCharm ? 585 : 820
    } else if (length <= 30) {
      return shinyCharm ? 373 : 455
    } else {
      return shinyCharm ? 273 : 315
    }
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
        <td><input id="chain-length" bind:value={currentChainLength} /></td>
        <td><input id="chains" bind:value={chains} /></td>
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
</style>
