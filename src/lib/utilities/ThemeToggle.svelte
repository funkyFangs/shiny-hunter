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

<label for='theme-toggle'>Theme</label>
<label class='switch' id='theme-toggle'>
  <input type='checkbox' bind:checked={$isDark}/>
  <span class='slider round'/>
</label>

<style>
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
    background-color: var(--background-alt);
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background: url('/sun.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 26px 26px;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: var(--background-alt);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    background: url('/moon.png');
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