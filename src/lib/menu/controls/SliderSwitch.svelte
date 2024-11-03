<script lang="ts">
  export let checked = false
  export let id: string | undefined = undefined
  export let offText: string = ''
  export let offColor: string = 'var(--primary-darker)'
  export let onText: string = ''
  export let onColor: string = 'var(--primary-lighter)'

  $: backgroundColor = checked ? onColor : offColor
</script>

<button
  {id}
  type="button"
  role="switch"
  aria-checked={checked}
  onclick={() => (checked = !checked)}
  class:checked
  style="background-color: {backgroundColor}"
>
  <span>{checked ? onText : offText}</span>
</button>

<style>
  [role='switch'] {
    width: 3rem;
    cursor: pointer;
    background-color: var(--primary-darker);
    padding: var(--padding-length);
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    transition: background-color 0.25s ease-out;
  }

  [role='switch'][aria-checked='true'] {
    justify-content: right;
  }

  [role='switch'][aria-checked='false'] {
    justify-content: left;
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
