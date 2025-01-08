<script lang="ts">
  import { navigating } from '$app/state'
  import '../app.less'
  import HeaderMenu from '$lib/menu/HeaderMenu.svelte'
  import { Circle2 } from 'svelte-loading-spinners'
  import { SpritePreference } from '$lib/menu/SpritePreference'
  import SliderSwitch from '$lib/menu/controls/SliderSwitch.svelte'
  import { base } from '$app/paths'
  import FooterMenu from '$lib/menu/FooterMenu.svelte'
  import SideBar from '$lib/menu/SideBar.svelte'

  let { data, children } = $props()
  let open: boolean = $state(false)
  const { spritePreference, showNormal, promptOnClose, keepHistory, showFraction, showPercentage } =
    data

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

  const menuControls = [
    spritePreferenceSnippet,
    showNormalSnippet,
    promptOnCloseSnippet,
    keepHistorySnippet,
    showFractionSnippet,
    showPercentageSnippet,
    clearCacheSnippet
  ]
</script>

{#snippet spritePreferenceSnippet()}
  <label class="unselectable" for="sprite-preference">Sprite Preference</label>
  <select id="sprite-preference" bind:value={$spritePreference}>
    {#each Object.values(SpritePreference) as spritePreference}
      <option value={spritePreference}>{spritePreference}</option>
    {/each}
  </select>
{/snippet}

{#snippet showNormalSnippet()}
  <label class="unselectable" for="show-normal">Show Normal Sprites</label>
  <SliderSwitch bind:checked={$showNormal} id="show-normal" />
{/snippet}

{#snippet promptOnCloseSnippet()}
  <label class="unselectable" for="prompt-on-close">Prompt On Close</label>
  <SliderSwitch bind:checked={$promptOnClose} id="prompt-on-close" />
{/snippet}

{#snippet keepHistorySnippet()}
  <label class="unselectable" for="keep-history">Keep History</label>
  <SliderSwitch bind:checked={$keepHistory} id="keep-history" />
{/snippet}

{#snippet showFractionSnippet()}
  <label class="unselectable" for="show-fraction">Show Fraction</label>
  <SliderSwitch bind:checked={$showFraction} id="show-fraction" />
{/snippet}

{#snippet showPercentageSnippet()}
  <label class="unselectable" for="show-percentage">Show Percentage</label>
  <SliderSwitch bind:checked={$showPercentage} id="show-percentage" />
{/snippet}

{#snippet clearCacheSnippet()}
  <button disabled={localStorage.length === 0} onclick={clearCache}>Clear Cache</button>
{/snippet}

<HeaderMenu title="Shiny Hunter" bind:open />

{#if open}
  <SideBar items={menuControls} />
{/if}

<main>
  {#if navigating.to}
    <div>
      <Circle2 colorOuter="red" colorCenter="black" colorInner="white" size="100" unit="px" />
    </div>
  {:else}
    {@render children()}
  {/if}
</main>

<FooterMenu {links} />

<style lang="less">
  @import '../style/palette';
  @import '../style/positioning';

  select,
  label,
  button {
    /* Fonts */
    font-size: 150%;
  }

  button {
    width: 100%;
    background-color: @shark;
    color: contrast($background-color);
    transition-property: color;
  }

  button:hover {
    color: @riptide;
  }

  button:active {
    color: contrast(@shark);
  }

  main {
    padding: calc(@top-bar-height + @gap-length) @gap-length;
    margin: auto;
    max-width: 1500px;
  }

  main > div {
    z-index: 1;
    position: absolute;
    top: calc(50vh - 50px);
    left: calc(50vw - 50px);
  }

  #sprite-preference {
    background-color: @shark;
    color: contrast($background-color);
    transition-property: color;
  }

  #sprite-preference:hover {
    color: @riptide;
  }

  #sprite-preference:active {
    color: white;
  }
</style>
