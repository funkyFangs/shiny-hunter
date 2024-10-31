<script lang="ts">
  export let checked = false
  export let id: string | undefined = undefined
  export let offText: string = ''
  export let offColor: string = 'var(--primary-darker)'
  export let onText: string = ''
  export let onColor: string = 'var(--primary-lighter)'

  $: backgroundColor = checked ? onColor : offColor
</script>

<label class="toggle" class:checked style="background-color: {backgroundColor}">
  <input {id} type="checkbox" bind:checked />
  <span>{checked ? onText : offText}</span>
</label>

<style>
  .toggle {
    width: 3em;
    cursor: pointer;
    background-color: var(--primary-darker);
    padding: var(--padding-length);
    border-radius: 1em;
    display: flex;
    flex-direction: row;
    transition: background-color 0.25s ease-out;
  }

  .toggle.checked {
    background-color: var(--primary-lighter);
    justify-content: right;
  }

  .toggle:not(.checked) {
    justify-content: left;
  }

  input[type='checkbox'] {
    display: none;
  }

  span {
    border-radius: 50%;
    background-color: var(--font-color);
    color: var(--primary-darkest);
    width: 1.5em;
    height: 1.5em;
    display: inline-block;
    text-align: center;
    user-select: none;
  }
</style>
