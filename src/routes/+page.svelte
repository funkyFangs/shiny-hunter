<script>
  import GameSelect, { selectedGame } from '$lib/games/GamesSelect.svelte';
  import PokemonSelect, { selectedPokemon } from '$lib/pokemon/PokemonSelect.svelte'
</script>

<title>Shiny Hunter</title>

<h1>Shiny Hunter</h1>
<GameSelect/>
<PokemonSelect/>

<!-- A quick and dirty little renderer to demonstrate the store is working as expected -->
{#if $selectedGame}
  <p>
    Selected Game: {$selectedGame.displayName}<br/>
    {#if $selectedPokemon}
      Selected Pokemon: {$selectedPokemon.displayName}<br/>
      Icon: <img src={$selectedGame?.iconFolder + '/' + $selectedPokemon.icon}/><br/>
      Image: <img src={$selectedGame?.imageFolder + '/' + $selectedPokemon?.image}/><br/>
      Shiny Image: <img src={$selectedGame?.imageFolder + '/' + $selectedPokemon?.shinyImage}/><br/>

      {#if $selectedPokemon?.variants?.length}
        Variants: {$selectedPokemon.variants}
      {/if}
    {/if}
  </p>
{/if}