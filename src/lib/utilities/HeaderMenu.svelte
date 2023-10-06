<script>
  import { Hamburger } from 'svelte-hamburgers';

  export let open = false
</script>

<header class='header-menu'>
  <div class='sidebar' class:open>
    <ul>
      <slot/>
    </ul>
  </div>

  <div class='hamburger'>
    <Hamburger bind:open/>
  </div>
</header>

<style>
  .sidebar {
    height: 100%;
    width: 300px;
    position: absolute;
    top: 0;
    left: -100%;
    background: var(--background-inverse);
    transition: left 0.3s ease-in-out;
    font-size: 24px;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin-top: 100px;
    margin-left: 45px;
  }

  .hamburger {
    position: fixed;
    top: 0;
    left: 0;
    margin-top: 16px;
    margin-left: 16px;
  }

  .open {
    left: 0;
    box-shadow: 50px 0px 75px rgba(0, 0, 0, 0.5);
  }
</style>