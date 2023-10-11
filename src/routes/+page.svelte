<script lang='ts'>
  import { browser } from '$app/environment';
  import ManageTrackers from '$lib/tracker/ManageTrackers.svelte';
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import ThemeToggle from '$lib/utilities/ThemeToggle.svelte';
</script>

<title>Shiny Hunter</title>

<header>
  <HeaderMenu>
    <li><a href='/about'>About</a></li>
    <li><a href='/credits'>Credits</a></li>
    <li><ThemeToggle/></li>
    <li><button disabled={!browser} on:click={() => localStorage.clear()}>Clear Cache</button></li>
  </HeaderMenu>
  <h1>Shiny Hunter</h1>
</header>

<ManageTrackers/>

<style>
  :root {
    padding: 15px;
  }

  header {
    padding-bottom: 15px;
  }

  header a {
    color: var(--background);
    position: relative;
    display: inline-block;
    height: 60px;
  }

  header h1 {
    font-size: 28.7px;
    display: inline;
  }
</style>