<script lang="ts">
  let {
    open = $bindable(false),
    title = $bindable('Kebab menu'),
    ariaLabel = $bindable(title),
    ariaControls = $bindable('')
  }: {
    open?: boolean
    title?: string
    ariaLabel?: string
    ariaControls?: string
  } = $props()
</script>

<button
  class:open
  onclick={() => (open = !open)}
  {title}
  aria-label={ariaLabel}
  aria-controls={ariaControls}>⋮</button
>

<style>
  button {
    background: none;
    transition: 0.25s ease-out;
    font-size: 2rem;
    color: var(--font-color);
    padding: var(--padding-length);
    width: calc(45.6px + 2 * var(--padding-length));
  }

  button.open {
    transform: rotate(90deg);
  }
</style>
