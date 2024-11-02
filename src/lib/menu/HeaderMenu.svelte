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
  import { base } from '$app/paths'
  import type { Snippet } from 'svelte'

  let {
    title,
    items = []
  }: {
    title: string
    items: Snippet[]
  } = $props()

  let open = $state(false)
</script>

<header>
  <Hamburger --color="var(--font-color)" bind:open />
  <a href="{base}/">{title}</a>
</header>

{#if open && items.length}
  <menu transition:fly={{ x: '-100%' }}>
    {#each items as item}
      <li>{@render item()}</li>
    {/each}
  </menu>
{/if}

<style>
  header {
    /* Positioning */
    position: absolute;
    width: 100%;
    height: var(--top-bar-height);
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    z-index: 2;

    /* Palette */
    background-color: var(--primary-darkest);
    box-shadow: 0 0 50px 10px rgba(0, 0, 0, 0.3);
  }

  menu {
    /* Positioning */
    position: fixed;
    height: 100%;
    width: var(--side-bar-width);
    max-width: 100vw;
    padding: var(--gap-length);
    top: var(--top-bar-height);
    margin: 0;
    z-index: 2;

    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--gap-length);

    /* Palette */
    background-color: var(--primary-dark);
  }

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  header > a {
    margin: 0 calc(100% - 100vw + var(--gap-length)) 0 0;
    font-size: 2rem;
  }
</style>
