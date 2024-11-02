<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    open = $bindable(false),
    title = $bindable('Kebab menu'),
    ariaLabel = $bindable(title),
    ariaControls = $bindable(''),
    menu = []
  }: {
    open?: boolean
    title?: string
    ariaLabel?: string
    ariaControls?: string
    menu: Snippet[]
  } = $props()
</script>

<button
  class:open
  onclick={() => (open = !open)}
  {title}
  aria-label={ariaLabel}
  aria-controls={ariaControls}><span>⋮</span></button
>

{#if open && menu.length}
  <menu>
    {#each menu as control}
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

  button > span {
    transition: 0.25s ease-out;
    font-size: 1.6rem;
    color: var(--font-color);
  }

  button.open > span {
    transform: rotate(90deg);
  }

  menu {
    margin: 0;
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
