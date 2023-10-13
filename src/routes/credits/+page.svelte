<script>
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import { base } from '$app/paths';
</script>

<header>
  <HeaderMenu>
    <li><a class='navigation' href='{base}'>Home</a></li>
    <li><a class='navigation' href='{base}/about'>About</a></li>
    <li><a class='navigation selected' href='{base}/credits'>Credits</a></li>
  </HeaderMenu>
  <h1>Credits</h1>
</header>

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

  .navigation:hover, .navigation.selected {
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

  ul {
    list-style: none;
    padding: 0px;
  }
</style>