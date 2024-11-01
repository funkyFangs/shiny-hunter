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
  import Fraction from '$lib/menu/tracker/counters/Odds.svelte'
  import { sanitizeInteger } from '$lib/utilities/Strings'

  export let count: number = 0
  export let label: string = 'Count'
  export let numerator: number = 1
  export let denominator: number = 8192

  $: count = sanitizeInteger(count)
</script>

<div id="counter">
  <table>
    <thead>
      <tr>
        <th><label for="count">{label}</label></th>
        <th><label for="odds">Odds</label></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input id="count" type="number" min="0" bind:value={count} /></td>
        <td><Fraction id="odds" bind:numerator bind:denominator /></td>
      </tr>
    </tbody>
  </table>
  <button on:click={() => (count += 1)}>&plus;</button>
</div>

<style>
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

  input {
    text-align: center;
    border: none;
    background: none;
    font-weight: bold;
    color: var(--font-color);
    font-size: 1.1em;
    max-width: 90px;
    padding: 0;
  }

  input:focus {
    background-color: var(--primary-light);
  }

  label {
    font-weight: bold;
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
