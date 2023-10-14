<script lang='ts'>
  import { writable } from 'svelte/store';

  export let checked = writable(false);
  export let label: string | undefined = undefined;
  export let id: string;
</script>

<div class='toggle'>
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <label class='switch' id={id}>
    <input type='checkbox' bind:checked={$checked}/>
    <span class='slider round'/>
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
    background-color: #ffffff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 26px 26px;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: var(--button);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
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