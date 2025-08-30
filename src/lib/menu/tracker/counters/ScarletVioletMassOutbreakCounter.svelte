<script lang="ts">
  import Odds from '$lib/menu/tracker/counters/odds/Odds.svelte'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { getScarletVioletMassOutbreakOdds } from '$lib/menu/tracker/counters/odds/Odds'
  import { range } from '$lib/utilities/Arrays'
  import { fade } from 'svelte/transition'

  let {
    huntTracker,
    sparklingPowerLevel = $bindable(),
    count = $bindable(),
    showFraction,
    showPercentage
  }: {
    huntTracker: HuntTracker
    sparklingPowerLevel: number
    count: number
    showPercentage: boolean
    showFraction: boolean
  } = $props()

  function incrementCount() {
    count += 1
  }

  let odds = $derived(getScarletVioletMassOutbreakOdds(huntTracker))
  let id = $derived(huntTracker.id)
  let showOdds = $derived(showFraction || showPercentage)
</script>

<div class="counter-container">
  <table>
    <thead>
      <tr>
        <th scope="col"><label for="count-{id}">Encounters</label></th>
        <th scope="col"><label for="sparkling-power-level-{id}">Sparkling Power</label></th>
        {#if showOdds}
          <th transition:fade={{ duration: 200 }} scope="col"
            ><label for="odds-{id}">Odds</label></th
          >
        {/if}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="number" min="0" id="count-{id}" bind:value={count} /></td>
        <td>
          <select id="sparkling-power-level-{id}" bind:value={sparklingPowerLevel}>
            {#each range(0, 4) as level (level)}
              <option value={level}>{level}</option>
            {/each}
          </select>
        </td>
        {#if showOdds}
          <td transition:fade={{ duration: 200 }}>
            <Odds
              id="odds-{id}"
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
  <button onclick={incrementCount} aria-label="Increment Number Battled">&plus;</button>
</div>

<style lang="css">
  .counter-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: center;
  }

  input:hover {
    background-color: var(--color-indigo-700);
    color: whitesmoke;
  }

  button {
    font-size: 1.5em;
    background-color: var(--color-indigo-500);
    color: whitesmoke;
  }

  select:hover,
  button:hover {
    background-color: var(--color-indigo-400);
    color: black;
  }

  select:active,
  button:active {
    background-color: var(--color-indigo-300);
    color: black;
  }

  input {
    text-align: center;
    border: none;
    background: none;
    font-weight: bold;
    color: whitesmoke;
    font-size: 1.1em;
    max-width: 90px;
    padding: 0;
  }

  select {
    background-color: var(--color-indigo-500);
    color: whitesmoke;
  }

  input:focus-visible {
    background-color: var(--color-indigo-500);
    color: whitesmoke;
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
