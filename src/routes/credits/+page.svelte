<script>
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import { base } from '$app/paths';
</script>

<header>
  <HeaderMenu>
    <a class='navigation' href='{base}/'>Home</a>
    <a class='navigation' href='{base}/about'>About</a>
    <a class='navigation selected' href='{base}/credits'>Credits</a>
  </HeaderMenu>
  <h1>Credits</h1>
</header>

<div id='content'>
  <h2>Assets</h2>

  <h3>Sprites & Icons</h3>

  <nav>
    <ul>
      <li><a target='_blank' rel='noopener noreferrer' class='attribution' href='https://bulbapedia.bulbagarden.net/wiki/Main_Page'>Bulbapedia</a></li>
      <li><a target='_blank' rel='noopener noreferrer' class='attribution' href='https://www.pokencyclopedia.info/en/index.php'>Pokencyclopedia</a></li>
    </ul>
  </nav>

  <h3>Web Icons</h3>

  <nav>
    <ul>
      <li><a target='_blank' rel='noopener noreferrer' class='attribution' href='https://www.flaticon.com/free-icons/miscellaneous'>Freepik - Flaticon</a></li>
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