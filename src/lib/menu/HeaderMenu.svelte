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
	import { Hamburger } from 'svelte-hamburgers';

	export let title: string

	let open: boolean
</script>

<header>
	<Hamburger --color="var(--font-color)" bind:open/>
	<a href="/"><h1>{title}</h1></a>
</header>

{#if open}
	<nav transition:fly={{x: '-100%'}}>
		<slot/>
	</nav>
{/if}

<style>
  header {
    /* Positioning */
    position: fixed;
    width: 100%;
    height: var(--top-bar-height);
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    /* Palette */
    background-color: var(--primary-darkest);
    box-shadow: 0 0 50px 10px rgba(0, 0, 0, 0.3);
  }

  nav {
		/* Positioning */
		position: fixed;
    height: 100%;
    width: var(--side-bar-width);
    padding: var(--gap-length);
    top: var(--top-bar-height);
		max-width: 100vw;

		/* Palette */
    background-color: var(--primary-dark);
  }

  header > a {
		margin: 0 calc(100% - 100vw + var(--gap-length)) 0 0;
  }
</style>
