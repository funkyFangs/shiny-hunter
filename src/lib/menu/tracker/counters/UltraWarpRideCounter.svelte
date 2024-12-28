<script lang="ts">
  import Odds from '$lib/menu/tracker/counters/Odds.svelte'
  import { sanitizeInteger } from '$lib/utilities/Strings'

  export let index: number
  export let count: number = 0
  export let furthestDistance: number = 0

  let rarity: 0 | 1 | 2 | 3 | undefined
  let distance: number | undefined

  $: count = sanitizeInteger(count)
  $: distance = distance === undefined ? undefined : sanitizeInteger(distance)
  $: furthestDistance = sanitizeInteger(furthestDistance)

  function increment() {
    count += 1
    if (distance! > furthestDistance) {
      furthestDistance = distance!
    }

    rarity = undefined
    distance = undefined
  }

  function getOdds(
    rarity: 0 | 1 | 2 | 3 | undefined,
    distance: number | undefined
  ): number | undefined {
    if (
      rarity === undefined ||
      distance === undefined ||
      // Rarities 1-3 only appear after certain distances, so odds cannot be displayed
      ((rarity === 1 || rarity === 2) && distance < 1000) ||
      (rarity === 3 && distance < 2500)
    ) {
      return undefined
    } else if (rarity === 0) {
      return 1
    } else {
      const d = Math.min(9, Math.floor(distance / 500 - 1))
      switch (rarity) {
        case 1:
          return 1 + d
        case 2:
          return 1 + 2 * d
        case 3:
          return 4 * d
      }
    }
  }

  $: odds = getOdds(rarity, distance)
</script>

<div id="counter">
  <table>
    <thead>
      <tr>
        <th scope="col"><label for="rarity-{index}">Rarity</label></th>
        <th scope="col"><label for="distance-{index}">Distance</label></th>
        <th scope="col"><label for="count-{index}">Count</label></th>
        <th scope="col"><label for="odds-{index}">Odds</label></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <select id="rarity-{index}" bind:value={rarity}>
            <option value={null} hidden selected></option>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </td>
        <td
          ><input
            id="distance-{index}"
            class="distance"
            type="number"
            min="0"
            bind:value={distance}
          /></td
        >
        <td><input id="count-{index}" class="count" type="number" min="0" bind:value={count} /></td>
        <td>
          {#if odds !== undefined}
            <Odds
              id="odds-{index}"
              inputs={[`distance-${index}`, `count-${index}`]}
              numerator={odds}
              denominator={100}
              showFraction={false}
              accuracy={0}
            />
          {:else}
            <span id="odds-{index}" aria-label="The undefined odds for finding a shiny Pokémon"
              >-</span
            >
          {/if}
        </td>
      </tr>
    </tbody>
  </table>
  <button on:click={increment} disabled={odds === undefined} aria-label="Increment Counter"
    >&plus;</button
  >
</div>

<style lang="less">
  @import '../../../../style/palette';
  @import '../../../../style/positioning';

  input,
  select {
    text-align: center;
    font-weight: bold;
    color: contrast(@darkest-indigo);
    height: 28px;
    background: none;
  }

  input {
    border: none;
    padding: 0;
  }

  input:hover {
    background-color: @darker-indigo;
    color: contrast($background-color);
  }

  .count {
    background: none;
    max-width: 60px;
  }

  .distance {
    max-width: 75px;
    background: none;
  }

  #counter {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    justify-content: center;
    max-width: calc(100vw - 4 * @gap-length);
  }

  button {
    height: 70px;
    font-size: 1.5em;
  }

  button,
  .distance,
  .count:focus-visible,
  select {
    background-color: @indigo;
    color: contrast($background-color);
  }

  .distance:hover,
  select:hover,
  button:hover {
    background-color: lighten(@indigo, 5%);
    color: contrast($background-color);
  }

  .distance:active,
  select:active,
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
