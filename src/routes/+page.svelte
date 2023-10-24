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
    transition-property: padding;
    transition-duration: 0.25s;
  }

  @media (max-width: 1001px) {
    :root {
      padding: var(--spacing-s);
    }
  }

  @media (min-width: 1001px) {
    :root {
      padding: var(--spacing-m);
    }
  }

  #trackers {
    max-width: var(--max-width);
    margin: 0 auto;
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
    position: sticky;
    margin-bottom: 15px;
  }

  header h1 {
    font-size: 2em;
  }
</style>