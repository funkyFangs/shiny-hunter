<script lang="ts">
  import { fade } from 'svelte/transition'

  export let title: string
  export let id: string | undefined = undefined

  let isClicked: boolean = false

  function onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isClicked = false
    }
  }
</script>

<svelte:window on:keydown={onKeyPress} />

<button
  type="button"
  onclick={() => (isClicked = !isClicked)}
  onfocusout={() => (isClicked = false)}
>
  <slot />
</button>

{#if isClicked}
  <span transition:fade={{ duration: 250 }} role="tooltip" {id}>{title}</span>
{/if}

<style lang="less">
  @import '../../../style/palette';
  @import '../../../style/positioning';

  button {
    background: none;
    padding: 0;
  }

  span {
    /* Positioning */
    position: fixed;
    padding: 5px;
    max-width: 15em;
    border-radius: @border-radius;
    text-align: justify;
    transform: translateY(calc(50% + 34px / 2 + @padding-length)) translateX(-50%);

    /* Palette */
    background-color: @riptide;
    color: contrast($background-color);
  }
</style>
