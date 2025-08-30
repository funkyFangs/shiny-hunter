<!--
@component
# Description
`StaticCounter` is a general-purpose component for tracking a count for shiny hunts with constant odds.

## Fields
|Field|Description|Default|Required|
|:-:|-|:-:|:-:|
|count|This is the current value of the counter. It is intended to be bound to other variables for further use.|`0`|No|
|label|This describes what the count represents for display purposes.|`"Count"`|No|
|numerator|This is the upper-half of the fraction representing the probability.|`1`|No|
|denominator|This is the lower-half off the fraction representing the probability.|`8192`|No|

## Example
If you wanted to count the number of "attempts" with a probability of 1/2, you could declare a `StaticCounter` as follows.
```svelte
<StaticCounter
  bind:count={value}
  label="Attempts"
  numerator={1}
  denominator={2}
/>
```
-->
<script lang="ts">
  import Odds from '$lib/menu/tracker/counters/odds/Odds.svelte'
  import type { Fraction } from '$lib/menu/tracker/counters/odds/Odds'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { fade } from 'svelte/transition'

  let {
    huntTracker,
    count = $bindable(),
    label = 'Count',
    odds,
    showFraction = true,
    showPercentage = true
  }: {
    huntTracker: HuntTracker
    count: number
    label: string
    odds: Fraction
    showFraction: boolean
    showPercentage: boolean
  } = $props()

  function incrementCount() {
    count += 1
  }

  let id = $derived(huntTracker.id)
  let showOdds = $derived(showFraction || showPercentage)
</script>

<div class="counter-container">
  <table>
    <thead>
      <tr>
        <th scope="col"><label for="count-{id}">{label}</label></th>
        {#if showOdds}
          <th scope="col" transition:fade={{ duration: 200 }}
            ><label for="odds-{id}">Odds</label></th
          >
        {/if}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="number" min="0" id="count-{id}" bind:value={count} /></td>
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
  <button onclick={incrementCount} aria-label="Increment {label}">&plus;</button>
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

  button:hover {
    background-color: var(--color-indigo-400);
    color: black;
  }

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
