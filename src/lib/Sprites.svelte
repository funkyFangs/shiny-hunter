<script lang="ts">
  import {
    showNormalForm,
    showShinyForm,
  } from "$lib/utilities/HeaderMenu.svelte";
  import {
    selectedTracker,
    selectedTrackerIndex,
    trackers,
  } from "$lib/Tracker";
  import { base } from "$app/paths";
  import { defaultImage } from "$lib/utilities/SpriteUtilities";
  import { selectedVariant } from "$lib/Pokemon";

  const DEFAULT_SPRITE = `${base}/images/Default.gif`;
</script>

<!-- Sprites -->
{#if $selectedTracker && ($showShinyForm || $showNormalForm)}
  {#if $selectedTracker.pokemon.variants?.length && $selectedVariant}
    <div id="variants">
      <div id="sprites">
        {#if $showShinyForm}
          <img
            class="sprite"
            src="{$selectedTracker.game
              .imageFolder}/{$selectedVariant.shinyImage}.{$selectedTracker.game
              .imageExtension}"
            alt="The shiny sprite for {$selectedVariant.displayName}"
            title="Shiny {$selectedTracker.pokemon
              .displayName} ({$selectedVariant.displayName})"
            on:error={(event) => defaultImage(event, DEFAULT_SPRITE)}
          />
        {/if}

        {#if $showNormalForm}
          <img
            class="sprite"
            src="{$selectedTracker.game
              .imageFolder}/{$selectedVariant.image}.{$selectedTracker.game
              .imageExtension}"
            alt="The sprite for {$selectedVariant.displayName}"
            title="{$selectedTracker.pokemon
              .displayName} ({$selectedVariant.displayName})"
            on:error={(event) => defaultImage(event, DEFAULT_SPRITE)}
          />
        {/if}
      </div>

      <div id="variant-inputs">
        {#each $selectedTracker.pokemon.variants as _, index}
          <input
            class="variant"
            name="variants"
            type="radio"
            value={index}
            bind:group={$trackers[$selectedTrackerIndex].selectedVariant}
          />
        {/each}
      </div>

      <h2>{$selectedVariant.displayName}</h2>
    </div>
  {:else}
    <div id="sprites">
      {#if $showShinyForm}
        <img
          class="sprite"
          src="{$selectedTracker.game.imageFolder}/{$selectedTracker.pokemon
            .shinyImage}.{$selectedTracker.game.imageExtension}"
          alt="The shiny sprite for {$selectedTracker.pokemon.displayName}"
          title="Shiny {$selectedTracker.pokemon.displayName}"
          on:error={(event) => defaultImage(event, DEFAULT_SPRITE)}
        />
      {/if}

      {#if $showNormalForm}
        <img
          class="sprite"
          src="{$selectedTracker.game.imageFolder}/{$selectedTracker.pokemon
            .image}.{$selectedTracker.game.imageExtension}"
          alt="The sprite for {$selectedTracker.pokemon.displayName}"
          title={$selectedTracker.pokemon.displayName}
          on:error={(event) => defaultImage(event, DEFAULT_SPRITE)}
        />
      {/if}
    </div>
  {/if}
{/if}

<style>
  #sprites {
    justify-content: space-around;
    display: flex;
  }

  .sprite {
    height: auto;
    width: 75%;
    max-height: 500px;
    max-width: 500px;
    padding: 15px;
    image-rendering: pixelated;
    object-fit: contain;
  }

  .variant {
    appearance: none;
    background-color: var(--muted);
    border-radius: 50%;
    border: none;
    transition: 0.2s all linear;
    width: 20px;
    height: 20px;
  }

  .variant:checked {
    background-color: var(--main);
    width: 26px;
    height: 26px;
  }

  #variants * {
    display: flex;
    justify-content: center;
  }

  #variants h2 {
    margin-top: 15px;
  }

  #variants {
    margin-bottom: 15px;
  }
</style>
