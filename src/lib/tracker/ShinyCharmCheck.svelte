<script lang='ts' context='module'>
  import { writable } from 'svelte/store';

  export const shinyCharm = writable<boolean>(false);
</script>

<script lang='ts'>
  import { selectedGame } from '$lib/games/GameSelect.svelte';

  $: if ($selectedGame === undefined || !$selectedGame.supportsShinyCharm) {
    shinyCharm.set(false);
  }
</script>

<label>
  Shiny Charm
  <input disabled={!$selectedGame || !$selectedGame.supportsShinyCharm} type='checkbox' bind:checked={$shinyCharm}/>
</label>

<style>
  input {
    margin-left: 10px;
  }
</style>