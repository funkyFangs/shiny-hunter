<script>
  import { navigating } from '$app/stores'
  import '../app.css'
  import HeaderMenu from '$lib/menu/HeaderMenu.svelte'
  import { Circle2 } from 'svelte-loading-spinners'
  import { SpritePreference } from '$lib/menu/SpritePreference'
  import SliderToggle from '$lib/menu/controls/SliderToggle.svelte'
  import { base } from '$app/paths'
  import FooterMenu from '$lib/menu/FooterMenu.svelte'

  let { data, children } = $props()
  const { spritePreference, showNormal } = data

  const links = [
    {
      href: `${base}/`,
      content: 'Trackers'
    },
    {
      href: `${base}/history`,
      content: 'History'
    },
    {
      href: `${base}/about`,
      content: 'About'
    },
    {
      href: `${base}/credits`,
      content: 'Credits'
    }
  ]

  function clearCache() {
    const confirmed = confirm(
      'Deleting the cache will remove all of your hunt trackers, preferences, and hunt history. Do you want to proceed?'
    )
    if (confirmed) {
      localStorage.clear()
      window.location.reload()
    }
  }
</script>

{#snippet spritePreferenceSnippet()}
  <label for="sprite-preference">Sprite Preference</label>
  <select id="sprite-preference" bind:value={$spritePreference}>
    {#each Object.values(SpritePreference) as spritePreference}
      <option value={spritePreference}>{spritePreference}</option>
    {/each}
  </select>
{/snippet}

{#snippet showNormalSnippet()}
  <label for="show-normal">Show Normal Sprites</label>
  <SliderToggle bind:checked={$showNormal} id="show-normal" />
{/snippet}

{#snippet clearCacheSnippet()}
  <button class="primary-button" disabled={localStorage.length === 0} onclick={clearCache}
    >Clear Cache</button
  >
{/snippet}

<HeaderMenu
  title="Shiny Hunter"
  items={[spritePreferenceSnippet, showNormalSnippet, clearCacheSnippet]}
/>

<main>
  {#if $navigating}
    <div>
      <Circle2 colorOuter="red" colorCenter="black" colorInner="white" size="100" unit="px" />
    </div>
  {:else}
    {@render children()}
  {/if}
</main>

<FooterMenu {links} />

<style>
  select,
  label,
  button {
    /* Fonts */
    font-size: 150%;
  }

  main {
    padding: calc(var(--top-bar-height) + var(--gap-length)) var(--gap-length);
    margin: auto;
    max-width: 1500px;
    max-height: calc(100vh - 2 * var(--top-bar-height));
  }

  main > div {
    z-index: 1;
    position: absolute;
    top: calc(50vh - 50px);
    left: calc(50vw - 50px);
  }
</style>
