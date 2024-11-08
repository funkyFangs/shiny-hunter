<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    open = $bindable(false),
    title = $bindable('Kebab menu'),
    ariaLabel = $bindable(title),
    ariaControls = $bindable(''),
    menuControls = []
  }: {
    open?: boolean
    title?: string
    ariaLabel?: string
    ariaControls?: string
    menuControls: Snippet[]
  } = $props()

  // Close menu on focus out
  let menu = $state<HTMLMenuElement>()
  function onFocusOut(event: FocusEvent) {
    const focusedElement = event.relatedTarget! as Element
    if (menu && !menu.contains(focusedElement)) {
      open = false
    }
  }
</script>

<button
  type="button"
  class:open
  onclick={() => (open = !open)}
  {title}
  aria-label={ariaLabel}
  aria-controls={ariaControls}
  onfocusout={onFocusOut}>⋮</button
>

{#if open && menuControls.length}
  <menu bind:this={menu}>
    {#each menuControls as control}
      <li>{@render control()}</li>
    {/each}
  </menu>
{/if}

<style>
  button {
    background: none;
    transition: 0.125s ease-out;
    padding: 0;
    width: 37px;
  }

  button:hover,
  button.open {
    background-color: var(--primary-dark);
  }

  button {
    transition: 0.25s ease-out;
    font-size: 1.6rem;
    color: var(--font-color);
  }

  menu {
    margin: var(--padding-length) 0 0 0;
    transform: translateX(calc(-100% + 37px));
    position: fixed;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: left;
    border-radius: var(--border-radius);
    background-color: var(--font-color);
    color: var(--primary-darkest);
    list-style: none;
  }

  li {
    text-wrap: nowrap;
    width: 100%;
  }

  menu > li:first-child {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  menu > li:last-child {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }

  li:hover {
    background-color: var(--accent);
  }

  li ~ li {
    border-top: 1px solid lightgray;
  }
</style>
