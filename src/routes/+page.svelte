<script lang='ts'>
  import ManageTrackers from '$lib/ManageTrackers.svelte';
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import { base } from '$app/paths';
</script>

<title>Shiny Hunter</title>

<header>
  <HeaderMenu>
    <a class='navigation selected' href='{base}/'>Home</a>
    <a class='navigation' href='{base}/about'>About</a>
    <a class='navigation' href='{base}/credits'>Credits</a>
  </HeaderMenu>
  <h1>Shiny Hunter</h1>
</header>

<div id='trackers'>
  <ManageTrackers/>
</div>

<style>
  :root {
    padding: 15px;
    padding-top: 38.1833px;
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
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 0;
    top: 0;
    padding: 15px;
    width: 100%;
  }

  header h1 {
    font-size: 28.7px;
  }
</style>