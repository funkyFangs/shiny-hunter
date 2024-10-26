<!--
@component
# Description
`PokeRadarCounter` is a specialized counter for tracking a chain length and the number of chains using the Poké Radar method.

## Fields
|Field|Description|Default|Required|
|:-:|-|:-:|:-:|
|chains|This is the number of chains that have been completed. When a chain resets, this value increases by 1.|`0`|No|
|currentChainLength|This is the length of the current chain.|`0`|No|
|maxChainLength|This is the length of the longest chain for this tracker.|`0`|No|
|generation|This is the numeric value for a Pokémon generation. The probabilities for a shiny Pokémon using the Poké Radar change between generations.|N/A|Yes|
|shinyCharm|This determines whether or not the shiny charm is in effect. Including this value will double the probability of finding a shiny Pokémon.|`false`|No|

## Example
If you wanted to track a Poké Radar hunt in Pokémon X with the shiny charm equipped, you could declare the following.
```svelte
<PokeRadarCounter
  bind:chains
  bind:chainLength
  generation={6}
  shinyCharm={true}
/>
```
-->
<script lang="ts">
	import Fraction from '$lib/menu/tracker/counters/Odds.svelte';
	import { sanitizeInteger } from '$lib/utilities/Strings';

	export let chains: number = 0
	export let currentChainLength: number = 0
	export let maxChainLength: number = 0
	export let generation: number
	export let shinyCharm: boolean = false

	$: chains = sanitizeInteger(chains)
	$: currentChainLength = sanitizeInteger(currentChainLength)

	function incrementChain() {
		currentChainLength += 1
		maxChainLength = Math.max(currentChainLength, maxChainLength)
	}

	function resetChain() {
		currentChainLength = 0
		chains += 1
	}

	/**
	 * Computes the probability of finding a shiny Pokémon given a chain length
	 * @param chainLength the length of the chain
	 * @see https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9_Radar#Shiny_probability
	 */
	function getOdds(chainLength: number) {
		let odds = Math.ceil(65535 / (8200 - Math.min(chainLength, 40) * 200))
		if (generation >= 6) {
			odds *= 2
		}
		if (shinyCharm) {
			odds *= 2
		}
		return odds
	}

	$: odds = getOdds(currentChainLength)
</script>

<div id="counter">
	<button on:click={resetChain} disabled={currentChainLength === 0}>&#10227;</button>
	<table>
		<thead>
			<tr>
				<th><label for="chain-length">Chain Length</label></th>
				<th><label for="chains">Number of Chains</label></th>
				<th><label for="odds">Odds</label></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input id="chain-length" bind:value={currentChainLength}/></td>
				<td><input id="chains" bind:value={chains}/></td>
				<td><Fraction id="odds" numerator={odds} denominator={65536}/></td>
			</tr>
		</tbody>
	</table>
	<button on:click={incrementChain}>&plus;</button>
</div>

<style>
  input {
    text-align: center;
    border: none;
    background: none;
    font-weight: bold;
    color: var(--font-color);
    font-size: 1.1em;
    padding: 0;
		max-width: 60px;
  }

	input:focus {
		background-color: var(--primary-light);
	}

	#counter {
		display: flex;
		flex-direction: row;
		gap: 5px;
		align-items: center;
		justify-content: center;
		max-width: calc(100vw - 4 * var(--gap-length))
	}

	#counter > button {
    height: 87px;
		font-size: 1.5em;
	}
</style>