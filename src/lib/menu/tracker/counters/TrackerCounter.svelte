<script lang="ts">
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { HuntingMethod } from '$lib/api/HuntingMethod'
  import PokeRadarCounter from '$lib/menu/tracker/counters/PokeRadarCounter.svelte'
  import StaticCounter from '$lib/menu/tracker/counters/StaticCounter.svelte'
  import ConsecutiveFishingCounter from '$lib/menu/tracker/counters/ConsecutiveFishingCounter.svelte'
  import UltraWarpRideCounter from '$lib/menu/tracker/counters/UltraWarpRideCounter.svelte'
  import SosBattleCounter from '$lib/menu/tracker/counters/SosBattleCounter.svelte'

  let {
    huntTracker = $bindable(),
    index
  }: {
    huntTracker: HuntTracker
    index: number
  } = $props()
</script>

{#if huntTracker.method === HuntingMethod.ODD_EGG}
  <StaticCounter
    {index}
    bind:count={huntTracker.count}
    label="Eggs"
    numerator={14}
    denominator={100}
  />
{:else if huntTracker.method === HuntingMethod.POKE_RADAR && huntTracker.chain}
  <PokeRadarCounter
    {index}
    bind:chains={huntTracker.count}
    bind:currentChainLength={huntTracker.chain.current}
    bind:maxChainLength={huntTracker.chain.max}
    generation={huntTracker.generation}
    shinyCharm={huntTracker.shinyCharm ?? false}
  />
{:else if huntTracker.method === HuntingMethod.MASUDA_METHOD}
  {#if huntTracker.generation <= 4}
    <StaticCounter {index} bind:count={huntTracker.count} label="Eggs" numerator={5} />
  {:else if huntTracker.generation === 5}
    <StaticCounter {index} bind:count={huntTracker.count} label="Eggs" numerator={6} />
  {:else}
    <StaticCounter
      {index}
      bind:count={huntTracker.count}
      label="Eggs"
      numerator={6}
      denominator={4096}
    />
  {/if}
{:else if huntTracker.method === HuntingMethod.CONSECUTIVE_FISHING && huntTracker.chain}
  <ConsecutiveFishingCounter
    {index}
    bind:chains={huntTracker.count}
    bind:currentChainLength={huntTracker.chain.current}
    bind:maxChainLength={huntTracker.chain.max}
    shinyCharm={huntTracker.shinyCharm}
  />
{:else if huntTracker.method === HuntingMethod.FRIEND_SAFARI}
  {#if huntTracker.shinyCharm}
    <StaticCounter
      {index}
      bind:count={huntTracker.count}
      label="Encounters"
      numerator={5}
      denominator={4096}
    />
  {:else}
    <StaticCounter
      {index}
      bind:count={huntTracker.count}
      label="Encounters"
      numerator={7}
      denominator={4096}
    />
  {/if}
{:else if huntTracker.method === HuntingMethod.HIDDEN_POKEMON}
  {#if huntTracker.generation <= 5}
    <StaticCounter {index} bind:count={huntTracker.count} label="Encounters" />
  {:else}
    <StaticCounter {index} bind:count={huntTracker.count} label="Encounters" denominator={4096} />
  {/if}
{:else if huntTracker.method === HuntingMethod.SOS_BATTLE && huntTracker.chain}
  <SosBattleCounter
    {index}
    bind:chains={huntTracker.count}
    bind:currentChainLength={huntTracker.chain.current}
    bind:maxChainLength={huntTracker.chain.max}
    bind:shinyCharm={huntTracker.shinyCharm}
    isSunOrMoon={huntTracker.versionGroup === 'sun-moon'}
  />
{:else if huntTracker.method === HuntingMethod.ULTRA_WARP_RIDE && huntTracker.chain}
  <UltraWarpRideCounter
    {index}
    bind:count={huntTracker.count}
    bind:furthestDistance={huntTracker.chain.max}
  />
{:else if huntTracker.generation <= 5}
  <StaticCounter {index} bind:count={huntTracker.count} label="Encounters" />
{:else}
  <StaticCounter {index} bind:count={huntTracker.count} label="Encounters" denominator={4096} />
{/if}
