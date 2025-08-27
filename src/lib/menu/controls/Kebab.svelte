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
    {#each menuControls as control (control)}
      <li>{@render control()}</li>
    {/each}
  </menu>
{/if}

<style lang="less">
  @import '../../../style/palette';
  @import '../../../style/positioning';

  button {
    background: none;
    transition: 0.125s ease-out;
    padding: 0;
    width: 37px;
  }

  button:hover,
  button.open {
    background-color: @darker-indigo;
  }

  button {
    transition: 0.25s ease-out;
    font-size: 1.6rem;
    color: contrast(@darker-indigo);
  }

  menu {
    margin: @padding-length 0 0 0;
    transform: translateX(calc(-100% + 37px));
    position: fixed;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: left;
    border-radius: @border-radius;
    background-color: contrast($color);
    color: @shark;
    list-style: none;
  }

  li {
    text-wrap: nowrap;
    width: 100%;
  }

  menu > li:first-child {
    border-top-left-radius: @border-radius;
    border-top-right-radius: @border-radius;
  }

  menu > li:last-child {
    border-bottom-left-radius: @border-radius;
    border-bottom-right-radius: @border-radius;
  }

  li:hover {
    background-color: @riptide;
  }

  li ~ li {
    border-top: 1px solid lightgray;
  }
</style>
