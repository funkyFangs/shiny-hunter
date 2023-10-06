<script>
  import GameSelect, { selectedGame } from '$lib/games/GameSelect.svelte';
  import PokemonSelect, { selectedPokemon } from '$lib/pokemon/PokemonSelect.svelte';
  import MethodSelect, { selectedMethod } from '$lib/methods/MethodSelect.svelte';
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
</script>

<title>Shiny Hunter</title>

<div class='content'>
  <h1>Shiny Hunter</h1>

  <table>
    <tr>
      <td><strong>Game</strong></td>
      <td><GameSelect/></td>
    </tr>
    <tr>
      <td><strong>Pokemon</strong></td>
      <td><PokemonSelect/></td>
    </tr>
    <tr>
      <td><strong>Method</strong></td>
      <td><MethodSelect/></td>
    </tr>
  </table>

  {#if $selectedGame && $selectedPokemon}
    <img class='sprite' src={$selectedGame.imageFolder + '/' + $selectedPokemon.image} alt='The sprite of the selected Pokemon'/>
    <img class='sprite' src={$selectedGame.imageFolder + '/' + $selectedPokemon.shinyImage} alt='The shiny sprite of the selected Pokemon'/>
  {/if}
</div>

<HeaderMenu>
  <a href='/about'>About</a>
</HeaderMenu>

<style>
  .content {
    position: fixed;
    left: 25%;
    margin-left: 25px;
    right: 25%;
    margin-right: 25px;
  }

  td {
    font-size: 20px;
  }

  table {
    width: 60%;
  }

  .sprite {
    display: block;
    width: 300px;
    margin: auto;
  }
</style>