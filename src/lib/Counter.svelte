<script lang="ts">
  import { base } from "$app/paths";
  import {
    trackers,
    selectedTracker,
    selectedTrackerIndex,
  } from "$lib/Tracker";

  function increment() {
    if ($selectedTrackerIndex !== undefined) {
      $trackers[$selectedTrackerIndex].count += 1;
      trackers.update((trackers) => trackers);
    }
  }

  function decrement() {
    if ($selectedTrackerIndex !== undefined) {
      $trackers[$selectedTrackerIndex].count = Math.max(
        $trackers[$selectedTrackerIndex].count - 1,
        0,
      );
      trackers.update((trackers) => trackers);
    }
  }

  function set(count: number) {
    if ($selectedTrackerIndex !== undefined) {
      $trackers[$selectedTrackerIndex].count = count;
      trackers.update((trackers) => trackers);
    }
  }
</script>

{#if $selectedTracker}
  <!-- Counter -->
  <div id="counter">
    <!-- Count -->
    <div id="count">
      <label id="count">
        <input
          id="count-input"
          type="number"
          min={0}
          value={$selectedTracker.count}
          on:change={(event) => set(Number(event.currentTarget.value))}
        />
        {$selectedTracker.count == 1
          ? $selectedTracker.method.singularUnit
          : $selectedTracker.method.pluralUnit}
      </label>
    </div>

    <!-- Odds -->
    <div id="odds">
      {(
        $selectedTracker.method.odds[
          Math.max(
            0,
            Math.min(
              $selectedTracker.count,
              $selectedTracker.method.odds.length - 1,
            ),
          )
        ] * ($selectedTracker.shinyCharm ? 3 : 1)
      ).toFixed(3)}% Chance
    </div>

    <!-- Count Controls -->
    <div id="controls">
      <button id="increment" on:click={increment} title="Increment">+</button>
      <button id="reset" on:click={() => set(0)} title="Reset"
        ><img src="{base}/loop.png" alt="The reset button" /></button
      >
      <button id="decrement" on:click={decrement} title="Decrement">−</button>
    </div>
  </div>
{/if}

<style>
  #counter {
    font-size: 30px;
  }

  #counter * ~ * {
    margin-top: 10px;
  }

  #count {
    display: flex;
    justify-content: space-around;
  }

  #count input {
    padding: 0;
    appearance: textfield;
    background: none;
    text-align: center;
    width: 150px;
    font-weight: 600;
    margin-right: 10px;
  }

  #count input:focus {
    background-color: var(--background);
  }

  #odds {
    text-align: center;
  }

  #controls {
    display: flex;
  }

  #controls button {
    padding: 10px;
    margin: 0px;
    background-color: var(--background-dim);
    color: var(--main);
    display: inline;
  }

  #reset img {
    vertical-align: middle;
    padding: none;
  }

  #controls button:hover {
    background-color: var(--background);
  }

  #controls button ~ button {
    margin-left: 10px;
  }

  #increment,
  #decrement {
    width: 42.5%;
  }

  #reset {
    width: 15%;
  }

  #reset img {
    height: 30px;
  }
</style>
