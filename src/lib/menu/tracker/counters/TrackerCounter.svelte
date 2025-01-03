<script lang="ts">
  import type { HuntTracker } from '$lib/api/HuntTracker'
  import { HuntingMethod } from '$lib/api/HuntingMethod'
  import StaticCounter from '$lib/menu/tracker/counters/StaticCounter.svelte'
  import UltraWarpRideCounter from '$lib/menu/tracker/counters/UltraWarpRideCounter.svelte'
  import ChainCounter from '$lib/menu/tracker/counters/ChainCounter.svelte'
  import {
    getChainMethodDetails,
    getStaticMethodDetails
  } from '$lib/menu/tracker/counters/odds/Odds'
  import BrilliantPokemonCounter from '$lib/menu/tracker/counters/BrilliantPokemonCounter.svelte'
  import ScarletVioletMassOutbreakCounter from '$lib/menu/tracker/counters/ScarletVioletMassOutbreakCounter.svelte'
  import LegendsArceusMassOutbreakCounter from '$lib/menu/tracker/counters/LegendsArceusMassOutbreakCounter.svelte'

  let {
    huntTracker = $bindable(),
    index
  }: {
    huntTracker: HuntTracker
    index: number
  } = $props()
</script>

{#if huntTracker.method === HuntingMethod.ULTRA_WARP_RIDE && huntTracker.chain}
  <UltraWarpRideCounter
    {index}
    bind:count={huntTracker.count}
    bind:furthestDistance={huntTracker.chain.max}
  />
{:else if huntTracker.method === HuntingMethod.BRILLIANT_POKEMON}
  <BrilliantPokemonCounter {index} {huntTracker} bind:count={huntTracker.count} />
{:else if huntTracker.method === HuntingMethod.MASS_OUTBREAK}
  {#if huntTracker.versionGroup === 'scarlet-violet' && huntTracker.sparklingPowerLevel !== undefined}
    <ScarletVioletMassOutbreakCounter
      {index}
      {huntTracker}
      bind:count={huntTracker.count}
      bind:sparklingPowerLevel={huntTracker.sparklingPowerLevel}
    />
  {:else if huntTracker.researchLevel && huntTracker.isMassive !== undefined}
    <LegendsArceusMassOutbreakCounter
      {index}
      {huntTracker}
      bind:count={huntTracker.count}
      bind:researchLevel={huntTracker.researchLevel}
    />
  {/if}
{:else if huntTracker.chain}
  {@const details = getChainMethodDetails(huntTracker)}
  <ChainCounter
    {index}
    {huntTracker}
    bind:currentChain={huntTracker.chain.current}
    currentChainLabel={details.currentChainsLabel}
    bind:maxChain={huntTracker.chain.max}
    bind:count={huntTracker.count}
    chainLabel={details.chainsLabel}
    getOdds={details.oddsFunction}
  />
{:else}
  {@const details = getStaticMethodDetails(huntTracker)}
  <StaticCounter {index} bind:count={huntTracker.count} label={details.label} odds={details.odds} />
{/if}
