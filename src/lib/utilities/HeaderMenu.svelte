<script context="module">
  import Toggle from "$lib/utilities/Toggle.svelte";
  import { localWritable } from "./StoreUtilities";

  export const showShinyForm = localWritable("showShiny", true);
  export const showNormalForm = localWritable("showNormal", false);
</script>

<script>
  import { Hamburger } from "svelte-hamburgers";
  import ThemeToggle from "$lib/utilities/ThemeToggle.svelte";
  import { browser } from "$app/environment";

  export let open = false;

  function clearCache() {
    if (localStorage.length) {
      localStorage.clear();
      location.reload();
    }
  }
</script>

<div class="sidebar" class:open>
  <div class="content">
    <slot />
    <ThemeToggle />
    <Toggle id="showShiny" checked={showShinyForm} label="Shiny Form" />
    <Toggle id="showNormal" checked={showNormalForm} label="Normal Form" />
    <button id="clear-cache" disabled={!browser} on:click={clearCache}
      >Clear Cache</button
    >
  </div>
</div>

<Hamburger bind:open --padding="0px" --display="inline" />

<style>
  .sidebar {
    transition: left 0.3s ease-in-out;
    font-size: 24px;
    height: 100%;
    width: 350px;
    position: fixed;
    top: 0;
    left: -100%;
    background: var(--background-inverse);
  }

  .content {
    display: grid;
    grid-template-columns: repeat(1);
    transition-property: margin;
    transition-duration: 0.25s;
  }

  @media (max-width: 1001px) {
    .content {
      margin: 15px;
      margin-top: 75px;
    }
  }

  @media (min-width: 1001px) {
    .content {
      margin: 30px;
      margin-top: 90px;
    }
  }

  #clear-cache {
    align-self: center;
  }

  .open {
    left: 0;
    box-shadow: 50px 0px 75px rgba(0, 0, 0, 0.5);
  }
</style>
