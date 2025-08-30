<script lang="ts">
  import Odds from '$lib/menu/tracker/counters/odds/Odds.svelte'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { getLegendsArceusMassOutbreakOdds } from '$lib/menu/tracker/counters/odds/Odds'
  import { fade } from 'svelte/transition'

  let {
    huntTracker,
    researchLevel = $bindable(),
    count = $bindable(),
    showPercentage,
    showFraction
  }: {
    huntTracker: HuntTracker
    researchLevel: 'Less than 10' | '10' | 'Perfect'
    count: number
    showPercentage: boolean
    showFraction: boolean
  } = $props()

  function incrementCount() {
    count += 1
  }

  let odds = $derived(getLegendsArceusMassOutbreakOdds(huntTracker))
  let id = $derived(huntTracker.id)
  let showOdds = $derived(showFraction || showPercentage)
</script>

<div class="counter-container">
  <table>
    <thead>
      <tr>
        <th scope="col"><label for="count-{id}">Encounters</label></th>
        <th scope="col"><label for="research-level-{id}">Research Level</label></th>
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
          <select id="research-level-{id}" bind:value={researchLevel}>
            {#each ['Less than 10', '10', 'Perfect'] as level (level)}
              <option value={level}>{level}</option>
            {/each}
          </select>
        </td>
        {#if showOdds}
          <td transition:fade={{ duration: 200 }}
            ><Odds
              id="odds-{id}"
              numerator={odds.numerator}
              denominator={odds.denominator}
              {showFraction}
              {showPercentage}
            /></td
          >
        {/if}
      </tr>
    </tbody>
  </table>
  <button onclick={incrementCount} aria-label="Increment Number Encountered">&plus;</button>
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
