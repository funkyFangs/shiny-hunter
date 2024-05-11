<script lang="ts">
  import { browser } from "$app/environment";
  import { localWritable } from "./StoreUtilities";
  import { base } from "$app/paths";

  enum Theme {
    DARK = "ridge-dark.css",
    LIGHT = "ridge-light.css",
  }

  const isDark = localWritable(
    "isDark",
    browser && window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
</script>

<svelte:head>
  <link rel="stylesheet" href="{base}/{$isDark ? Theme.DARK : Theme.LIGHT}" />
</svelte:head>

<div class="toggle">
  <label for="theme-toggle">Theme</label>
  <label class="switch" id="theme-toggle">
    <input type="checkbox" bind:checked={$isDark} />
    <span class="slider round" />
  </label>
</div>

<style>
  .toggle {
    display: flex;
    justify-content: space-between;
  }

  label {
    color: var(--background);
    position: relative;
    display: inline-block;
    height: 60px;
    margin-right: 16px;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin: 0;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--background-dim);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background: url("/sun.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 26px 26px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: var(--background-dim);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    background: url("/moon.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 26px 26px;
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
