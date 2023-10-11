<script>
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import ThemeToggle from '$lib/utilities/ThemeToggle.svelte';
  import { browser } from '$app/environment';
</script>

<header>
  <HeaderMenu>
    <li><a href='/'>Home</a></li>
    <li><a href='/about'>About</a></li>
    <li><ThemeToggle/></li>
    <li><button disabled={!browser} on:click={() => localStorage.clear()}>Clear Cache</button></li>
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

  header h1 {
    font-size: 28.7px;
    display: inline;
  }

  header a {
    color: var(--background);
    position: relative;
    display: inline-block;
    height: 60px;
  }

  header {
    padding-bottom: 15px;
  }

  ul {
    list-style: none;
    padding: 0px;
  }
</style>