<script lang="ts">
	export let checked = false;
	export let id: string | undefined = undefined;
</script>

<div class="toggle">
	<label class="switch" {id}>
		<input type="checkbox" bind:checked/>
		<span class="slider round"/>
	</label>
</div>

<style>
  .toggle {
    display: flex;
    justify-content: space-between;
  }

  label {
    color: var(--primary-medium);
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

  .switch > input {
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
    background-color: var(--primary-darker);
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: var(--font-color);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 26px 26px;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: var(--primary-lighter);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
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