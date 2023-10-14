<script context='module'>
  import Toggle from '$lib/utilities/Toggle.svelte';
  import { localWritable } from './StoreUtilities';

  export const showShinyForm = localWritable('showShiny', true);
  export const showNormalForm = localWritable('showNormal', false);
</script>

<script>
  import { Hamburger } from 'svelte-hamburgers';
  import ThemeToggle from '$lib/utilities/ThemeToggle.svelte';
  import { browser } from '$app/environment';

  export let open = false
</script>

<div class='sidebar' class:open>
  <ul>
    <slot/>
    <li><ThemeToggle/></li>
    <li><Toggle id='showShiny' checked={showShinyForm} label='Shiny Form'/></li>
    <li><Toggle id='showNormal' checked={showNormalForm} label='Normal Form'/></li>
    <li><button disabled={!browser} on:click={() => localStorage.clear()}>Clear Cache</button></li>
  </ul>
</div>

<Hamburger bind:open --padding=0px --display=inline/>

<style>
  .sidebar {
    height: 100%;
    width: 300px;
    position: fixed;
    top: 0;
    left: -100%;
    background: var(--background-inverse);
    transition: left 0.3s ease-in-out;
    font-size: 24px;
    padding: 20px;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .open {
    left: 0;
    box-shadow: 50px 0px 75px rgba(0, 0, 0, 0.5);
  }
</style>