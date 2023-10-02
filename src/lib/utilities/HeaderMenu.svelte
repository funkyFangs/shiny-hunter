<script>
  import { Hamburger } from 'svelte-hamburgers';

  let open = false
</script>

<header>
  <Hamburger bind:open/>
  {#if open}
    <slot/>
  {/if}
  <hr/>
</header>