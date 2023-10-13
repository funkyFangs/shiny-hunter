<script lang='ts'>
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import { base } from '$app/paths';
</script>

<title>About</title>

<header>
  <HeaderMenu>
    <li><a class='navigation' href='{base}'>Home</a></li>
    <li><a class='navigation selected' href='{base}/about'>About</a></li>
    <li><a class='navigation' href='{base}/credits'>Credits</a></li>
  </HeaderMenu>
  <h1>About</h1>
</header>

<p>
  This is a passion project initially created to help teach myself Svelte, along with the help of Maxzilla. 
</p>

<h2>Contributors</h2>
<ul>
  <li>funkyFangs</li>
  <li>Maxzilla</li>
</ul>

<h2>Links</h2>
<nav>
  <ul>
    <li><a href='https://www.github.com/funkyFangs/shiny-hunter'>GitHub</a></li>
  </ul>
</nav>

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

  header h1 {
    font-size: 28.7px;
  }

  header {
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
  }

  ul {
    list-style: none;
    margin-left: 30px;
    padding: 0px;
  }
</style>