<script lang="ts">
  import type { Snippet } from 'svelte'
  import { fly } from 'svelte/transition'

  let { items }: { items: Snippet[] } = $props()
</script>

<menu transition:fly={{ x: '-100%' }}>
  {#each items as item}
    <li>{@render item()}</li>
  {/each}
</menu>

<style lang="less">
  @import '../../style/palette';
  @import '../../style/positioning';

  menu {
    /* Positioning */
    position: fixed;
    height: calc(100% - 2.5 * @top-bar-height);
    width: @side-bar-width;
    max-width: 100vw;
    padding: @gap-length;
    top: @top-bar-height;
    margin: 0;
    z-index: 3;

    list-style: none;
    display: flex;
    flex-direction: column;
    gap: @gap-length;

    /* Palette */
    background-color: @asparagus;
    color: contrast($background-color);
  }

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
