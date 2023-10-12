<script lang='ts'>
  import ManageTrackers from '$lib/tracker/ManageTrackers.svelte';
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
</script>

<title>Shiny Hunter</title>

<header>
  <HeaderMenu>
    <li><a class='navigation selected' href='/'>Home</a></li>
    <li><a class='navigation' href='/about'>About</a></li>
    <li><a class='navigation' href='/credits'>Credits</a></li>
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