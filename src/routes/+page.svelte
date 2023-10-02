<script>
  import GameSelect, { selectedGame } from '$lib/games/GameSelect.svelte';
  import PokemonSelect, { selectedPokemon } from '$lib/pokemon/PokemonSelect.svelte';
  import MethodSelect, { selectedMethod } from '$lib/methods/MethodSelect.svelte';
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
</script>

<HeaderMenu>
  <a href='/about'>About</a>
</HeaderMenu>

<title>Shiny Hunter</title>

<h1>Shiny Hunter</h1>

<GameSelect/>
<PokemonSelect/>
<MethodSelect/>

<style>
  
</style>