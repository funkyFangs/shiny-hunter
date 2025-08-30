<script lang="ts">
  import type { Snippet } from 'svelte'
  import { fly } from 'svelte/transition'

  let { items }: { items: Snippet[] } = $props()
</script>

<menu transition:fly={{ x: '-100%' }}>
  {#each items as item (item)}
    <li>{@render item()}</li>
  {/each}
</menu>

<style lang="css">
  menu {
    /* Positioning */
    position: fixed;
    height: calc(100% - 2.5 * var(--h-top-bar));
    width: var(--w-side-bar);
    max-width: 100vw;
    padding: var(--l-gap);
    top: var(--h-top-bar);
    margin: 0;
    z-index: 3;

    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--l-gap);

    /* Palette */
    background-color: var(--color-asparagus-500);
    color: whitesmoke;
  }

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
