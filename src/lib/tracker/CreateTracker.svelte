<script lang='ts'>
  import GameSelect, { selectedGame } from '$lib/games/GameSelect.svelte';
  import PokemonSelect, { selectedPokemon } from '$lib/pokemon/PokemonSelect.svelte';
  import MethodSelect, { selectedMethod } from '$lib/methods/MethodSelect.svelte';
  import { trackers } from './ManageTrackers.svelte';
  import { Tracker } from '$lib/tracker/Tracker';

  function createTracker() {
    const tracker = new Tracker($selectedGame!, $selectedPokemon!, $selectedMethod!);
    trackers.update(trackers => [...trackers, tracker]);
    selectedGame.set(undefined);
    selectedPokemon.set(undefined);
    selectedMethod.set(undefined);
  }
</script>

<form id='create-tracker'>
  <GameSelect/>
  <PokemonSelect/>
  <MethodSelect/>
  <button disabled={!($selectedGame && $selectedPokemon && $selectedMethod)} on:click={createTracker}>Create Tracker</button>
</form>