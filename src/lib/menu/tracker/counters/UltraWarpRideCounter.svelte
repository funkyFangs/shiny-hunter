<script lang="ts">
  import Odds from '$lib/menu/tracker/counters/Odds.svelte'
  import { sanitizeInteger } from '$lib/utilities/Strings'

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
        <th scope="col">Rarity</th>
        <th scope="col">Distance</th>
        <th scope="col">Count</th>
        <th scope="col">Odds</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <select bind:value={rarity}>
            <option value={null} hidden selected></option>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </td>
        <td><input type="number" min="0" id="distance" bind:value={distance} /></td>
        <td><input type="number" min="0" id="count" bind:value={count} /></td>
        <td>
          {#if odds !== undefined}
            <Odds
              inputs={['distance', 'count']}
              numerator={odds}
              denominator={100}
              showFraction={false}
              accuracy={0}
            />
          {:else}
            <span>-</span>
          {/if}
        </td>
      </tr>
    </tbody>
  </table>
  <button on:click={increment} disabled={odds === undefined} aria-label="Increment Counter"
    >&plus;</button
  >
</div>

<style>
  input,
  select {
    text-align: center;
    font-weight: bold;
    color: var(--font-color);
    height: 28px;
    background: none;
  }

  input {
    border: none;
    padding: 0;
  }

  #count {
    background: none;
    max-width: 60px;
  }

  #distance {
    max-width: 75px;
  }

  #count:focus,
  #distance,
  select {
    background-color: var(--primary-light);
    color: var(--font-color);
  }

  #counter {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    justify-content: center;
    max-width: calc(100vw - 4 * var(--gap-length));
  }

  #counter > button {
    height: 70px;
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
