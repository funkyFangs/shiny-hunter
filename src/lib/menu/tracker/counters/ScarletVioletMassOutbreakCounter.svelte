<script lang="ts">
  import Odds from '$lib/menu/tracker/counters/odds/Odds.svelte'
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { getScarletVioletMassOutbreakOdds } from '$lib/menu/tracker/counters/odds/Odds'
  import { range } from '$lib/utilities/Arrays'

  let {
    index,
    huntTracker,
    sparklingPowerLevel = $bindable(),
    count = $bindable()
  }: {
    index: number
    huntTracker: HuntTracker
    sparklingPowerLevel: number
    count: number
  } = $props()

  function incrementCount() {
    count += 1
  }

  let odds = $derived(getScarletVioletMassOutbreakOdds(huntTracker))
</script>

<div id="counter">
  <table>
    <thead>
      <tr>
        <th scope="col"><label for="count-{index}">Encounters</label></th>
        <th scope="col"><label for="sparkling-power-level-{index}">Sparkling Power</label></th>
        <th scope="col"><label for="odds-{index}">Odds</label></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="number" min="0" id="count-{index}" bind:value={count} /></td>
        <td>
          <select id="sparkling-power-level-{index}" bind:value={sparklingPowerLevel}>
            {#each range(0, 4) as level}
              <option value={level}>{level}</option>
            {/each}
          </select>
        </td>
        <td><Odds id="odds-{index}" numerator={odds.numerator} denominator={odds.denominator} /></td
        >
      </tr>
    </tbody>
  </table>
  <button onclick={incrementCount} aria-label="Increment Number Battled">&plus;</button>
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

  select:hover,
  button:hover {
    background-color: lighten(@indigo, 5%);
    color: contrast($background-color);
  }

  select:active,
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

  select {
    background-color: @indigo;
    color: contrast($background-color);
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
