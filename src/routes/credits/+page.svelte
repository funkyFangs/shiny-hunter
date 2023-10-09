<script>
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import ThemeToggle from '$lib/utilities/ThemeToggle.svelte';
</script>

<div class='content'>
  <h1>Credits</h1>

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

<HeaderMenu>
  <li><a class='navigation' href='/'>Home</a></li>
  <li><a class='navigation' href='/about'>About</a></li>
  <li><ThemeToggle/></li>
</HeaderMenu>

<style>
  .navigation {
    color: var(--background);
    position: relative;
    display: inline-block;
    height: 60px;
  }

  .content {
    position: fixed;
    left: 20%;
    right: 20%;
  }

  ul {
    list-style: none;
    padding: 0px;
  }

  h1 {
    margin-bottom: 20px;
  }

  h2 {
    margin-bottom: 15px;
    margin-top: 15px;
  }

  h1 {
    margin-bottom: 20px;
  }

  h3 {
    margin-bottom: 10px;
    margin-top: 10px;
  }
</style>