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

  let {
    index,
    count = $bindable(),
    label = 'Count',
    odds
  }: {
    index: number
    count: number
    label: string
    odds: Fraction
  } = $props()

  function incrementCount() {
    count += 1
  }
</script>

<div id="counter">
  <table>
    <thead>
      <tr>
        <th scope="col"><label for="count-{index}">{label}</label></th>
        <th scope="col"><label for="odds-{index}">Odds</label></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="number" min="0" id="count-{index}" bind:value={count} /></td>
        <td><Odds id="odds-{index}" numerator={odds.numerator} denominator={odds.denominator} /></td
        >
      </tr>
    </tbody>
  </table>
  <button onclick={incrementCount} aria-label="Increment {label}">&plus;</button>
</div>

<style lang="less">
  @import '../../../../style/palette';
  @import '../../../../style/positioning';

  #counter {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    justify-content: center;
  }

  input:hover {
    background-color: @darker-indigo;
    color: contrast($background-color);
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

  input {
    text-align: center;
    border: none;
    background: none;
    font-weight: bold;
    color: white;
    font-size: 1.1em;
    max-width: 90px;
    padding: 0;
  }

  input:focus-visible {
    background-color: @indigo;
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
