<script lang='ts'>
  import { browser } from '$app/environment';
  import { storable } from './Storable';

  enum Theme {
    DARK = '/ridge-dark.css',
    LIGHT = '/ridge-light.css'
  }

  const isDark = storable('isDark',
    // If platform supports localStorage & window
    browser
      // If theme is not stored
      ? localStorage['isDark'] === undefined
        // Then determine if OS prefers a theme
        ? window.matchMedia('(prefers-color-scheme: true)').matches
        // Else get stored theme
        : localStorage['isDark'] == 'true'
      // Else default to light theme
      : false);
</script>

<svelte:head>
  <link rel='stylesheet' href={$isDark ? Theme.DARK : Theme.LIGHT}/>
</svelte:head>

<div id='themeToggle'>
  <label for='input'>Dark Mode</label>
  <input type='checkbox' bind:checked={$isDark}/>
  <span/>
</div>

<style>
  label {
    color: var(--background);
  }
</style>