<script>
  import { navigating } from '$app/stores'
  import '../app.css'
  import HeaderMenu from '$lib/menu/HeaderMenu.svelte'
  import { Circle2 } from 'svelte-loading-spinners'
  import { SpritePreference } from '$lib/menu/SpritePreference'
  import SliderToggle from '$lib/menu/controls/SliderToggle.svelte'
  import { base } from '$app/paths'

  export let data
  const { spritePreference, showNormal } = data
</script>

<HeaderMenu title="Shiny Hunter">
  <ul>
    <li><span><a href="{base}/">Trackers</a></span></li>
    <li><span><a href="{base}/history">History</a></span></li>
    <li><span><a href="{base}/about">About</a></span></li>
    <li><span><a href="{base}/credits">Credits</a></span></li>
    <li>
      <label for="sprite-preference">Sprite Preference</label>
      <select id="sprite-preference" bind:value={$spritePreference}>
        {#each Object.values(SpritePreference) as spritePreference}
          <option value={spritePreference}>{spritePreference}</option>
        {/each}
      </select>
    </li>
    <li>
      <label for="show-normal">Show Normal Sprites</label>
      <SliderToggle bind:checked={$showNormal} id="show-normal" />
    </li>
  </ul>
</HeaderMenu>

<main>
  {#if $navigating}
    <div>
      <Circle2 colorOuter="red" colorCenter="black" colorInner="white" size="100" unit="px" />
    </div>
  {:else}
    <slot />
  {/if}
</main>

<style>
  ul {
    /* Positioning */
    margin: 0;
    padding: 0;

    /* Decoration */
    list-style-type: none;
  }

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  li + li {
    /* Positioning */
    margin-top: var(--gap-length);
  }

  span,
  select,
  label {
    /* Fonts */
    font-size: 150%;
    font-weight: bold;
  }

  main {
    padding: calc(var(--top-bar-height) + var(--gap-length)) var(--gap-length);
    margin: auto;

    @media (width > 500px) {
      max-width: 1500px;
    }
  }

  main > div {
    z-index: 1;
    position: absolute;
    top: calc(50vh - 50px);
    left: calc(50vw - 50px);
  }
</style>
