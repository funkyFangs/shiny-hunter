<!--
@component
# Description
`HeaderMenu` is a component which provides a top-bar menu with a title and closeable navigation menu.

## Fields
|Field|Description|Default|Required|
|:-:|-|:-:|:-:|
|title|This is the title displayed in the header menu.|N/A|Yes|

# Examples
If you wanted to display a header menu titled "My Application" with an anchor called "Home" which goes to "/", you could declare the following.
```svelte
<HeaderMenu title="My Application">
	<ul>
		<li><a href="/">Home</a></li>
	</ul>
</HeaderMenu>
```
-->
<script lang="ts">
  import { fly } from 'svelte/transition'
  import { Hamburger } from 'svelte-hamburgers'
  import type { Snippet } from 'svelte'

  let {
    title,
    items = []
  }: {
    title: string
    items: Snippet[]
  } = $props()

  let open = $state(false)
  let color = $state('white')

  function onMouseEnter() {
    color = '#89E4DF'
  }

  function onMouseLeave() {
    color = 'white'
  }
</script>

<header>
  <div role="graphics-object" onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
    <Hamburger --color={color} --hover-opacity="1" bind:open />
  </div>
  <h1 id="title" class="unselectable">{title}</h1>
</header>

{#if open && items.length}
  <menu transition:fly={{ x: '-100%' }}>
    {#each items as item}
      <li>{@render item()}</li>
    {/each}
  </menu>
{/if}

<style lang="less">
  @import '../../style/palette';
  @import '../../style/positioning';

  header {
    /* Positioning */
    position: fixed;
    width: 100%;
    height: @top-bar-height;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    z-index: 2;

    /* Palette */
    background-color: @shark;
    box-shadow: 0 0 50px 10px rgba(0, 0, 0, 0.3);

    h1 {
      color: contrast($background-color);
    }
  }

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

  #title {
    margin: 0 @gap-length 0 0;
    font-weight: normal;
  }
</style>
