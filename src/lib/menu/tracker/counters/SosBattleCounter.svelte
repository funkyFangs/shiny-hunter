<script lang="ts">
  import Odds from '$lib/menu/tracker/counters/Odds.svelte'
  import { sanitizeInteger } from '$lib/utilities/Strings'

  export let index: number
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

<div class="counter">
  <button on:click={resetChain} disabled={currentChainLength === 0} aria-label="Reset Chain"
    >&#10227;</button
  >
  <table>
    <thead>
      <tr>
        <th scope="col"><label for="chain-length-{index}">Chain Length</label></th>
        <th scope="col"><label for="chains-{index}">Chains</label></th>
        <th scope="col"><label for="odds-{index}">Odds</label></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          ><input
            id="chain-length-{index}"
            type="number"
            min="0"
            bind:value={currentChainLength}
          /></td
        >
        <td><input id="chains-{index}" type="number" min="0" bind:value={chains} /></td>
        <td
          ><Odds
            id="odds-{index}"
            inputs="chain-length-{index}"
            numerator={1}
            denominator={odds}
          /></td
        >
      </tr>
    </tbody>
  </table>
  <button on:click={incrementChain} aria-label="Increment Chain">&plus;</button>
</div>

<style lang="less">
  @import '../../../../style/palette';
  @import '../../../../style/positioning';

  input {
    text-align: center;
    border: none;
    background: none;
    font-weight: bold;
    color: contrast(@darkest-indigo);
    font-size: 1.1em;
    padding: 0;
    max-width: 60px;
  }

  input:hover {
    background-color: @darker-indigo;
    color: contrast($background-color);
  }

  input:focus-visible {
    background-color: @indigo;
    color: contrast($background-color);
  }

  .counter {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    justify-content: center;
  }

  button {
    height: 87px;
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
