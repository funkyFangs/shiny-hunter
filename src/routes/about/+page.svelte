<script lang='ts'>
  import HeaderMenu from '$lib/utilities/HeaderMenu.svelte';
  import ThemeToggle from '$lib/utilities/ThemeToggle.svelte';
</script>

<title>About</title>

<div class='content'>
  <h1>About</h1>
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
</div>

<HeaderMenu>
  <li><a class='navigation' href='/'>Home</a></li>
  <li><a class='navigation' href='/credits'>Credits</a></li>
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

  h1 {
    margin-bottom: 20px;
  }

  h2 {
    margin-bottom: 15px;
    margin-top: 15px;
  }

  ul {
    list-style: none;
    margin-left: 30px;
    padding: 0px;
  }
</style>