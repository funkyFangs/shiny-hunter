<script>
  import GameSelect, { selectedGame } from '$lib/games/GameSelect.svelte';
  import PokemonSelect, { selectedPokemon } from '$lib/pokemon/PokemonSelect.svelte';
  import MethodSelect, { selectedMethod } from '$lib/methods/MethodSelect.svelte';
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import ThemeToggle from '$lib/utilities/ThemeToggle.svelte';
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
    <img class='sprite' src={$selectedGame.imageFolder + '/' + $selectedPokemon.image} alt='The sprite for {$selectedPokemon.displayName}'/>
    <img class='sprite' src={$selectedGame.imageFolder + '/' + $selectedPokemon.shinyImage} alt='The shiny sprite for {$selectedPokemon.displayName}'/>
  {/if}
</div>

<HeaderMenu>
  <li><a href='/about'>About</a></li>
  <li><a href='/credits'>Credits</a></li>
  <li><ThemeToggle/></li>
</HeaderMenu>

<style>
  a {
    color: var(--background);
    position: relative;
    display: inline-block;
    height: 60px;
  }

  .content {
    position: fixed;
    left: 20%;
    right: 20%;
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
    image-rendering: pixelated;
  }
</style>