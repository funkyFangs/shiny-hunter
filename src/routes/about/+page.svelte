<script lang="ts">
  import HeaderMenu from "$lib/utilities/HeaderMenu.svelte";
  import { base } from "$app/paths";
</script>

<title>About</title>

<header>
  <HeaderMenu>
    <a class="navigation" href="{base}/">Home</a>
    <a class="navigation selected" href="{base}/about">About</a>
    <a class="navigation" href="{base}/credits">Credits</a>
  </HeaderMenu>
  <h1>About</h1>
</header>

<div id="content">
  <p>
    This is a passion project initially created to help teach myself Svelte,
    along with the help of Maxzilla.
  </p>

  <h2>Contributors</h2>
  <ul>
    <li>funkyFangs</li>
    <li>Maxzilla</li>
  </ul>

  <h2>Links</h2>
  <nav>
    <ul>
      <li>
        <a href="https://www.github.com/funkyFangs/shiny-hunter">GitHub</a>
      </li>
    </ul>
  </nav>
</div>

<style>
  :root {
    padding: var(--spacing-m);
  }

  #content {
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
