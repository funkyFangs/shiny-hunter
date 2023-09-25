<script>
  import GameSelect, { selectedGame } from '$lib/games/GamesSelect.svelte';
  import PokemonSelect from '$lib/pokemon/PokemonSelect.svelte'
</script>

<title>Shiny Hunter</title>

<h1>Shiny Hunter</h1>
<GameSelect/>
<PokemonSelect/>

{#if selectedGame == undefined}
<p>Bummer, you should pick a a game!</p>
{:else}
<p>Woohoo! That game is from generation {$selectedGame?.generation}</p>
{/if}