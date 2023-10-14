<script lang='ts'>
  import ManageTrackers from '$lib/ManageTrackers.svelte';
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import { base } from '$app/paths';
</script>

<title>Shiny Hunter</title>

<header>
  <HeaderMenu>
    <li><a class='navigation selected' href='{base}/'>Home</a></li>
    <li><a class='navigation' href='{base}/about'>About</a></li>
    <li><a class='navigation' href='{base}/credits'>Credits</a></li>
  </HeaderMenu>
  <h1>Shiny Hunter</h1>
</header>

<ManageTrackers/>

<style>
  :root {
    padding: 15px;
  }

  .navigation {
    color: var(--background);
    position: relative;
    display: inline-block;
    height: 60px;
  }

  .navigation.selected {
    color: var(--background-bright);
  }

  header {
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }

  header h1 {
    font-size: 28.7px;
  }
</style>