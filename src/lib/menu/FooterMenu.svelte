<script lang="ts">
  let {
    links
  }: {
    links: {
      href: string
      content?: string
    }[]
  } = $props()
</script>

<footer>
  {#if links.length}
    <nav>
      {#each links as link}
        <a href={link.href}>{link.content ?? link.href}</a>
      {/each}
    </nav>
  {/if}
</footer>

<style lang="less">
  @import '../../style/palette';
  @import '../../style/positioning';

  footer {
    position: absolute;
    width: 100%;
    height: @top-bar-height;
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 2;

    /* Palette */
    background-color: @shark;
    box-shadow: 10px 0 50px 0 rgba(0, 0, 0, 0.3);
  }

  a:hover {
    color: @riptide;
  }

  a,
  a:active {
    color: contrast(@shark);
  }

  nav {
    display: flex;
    flex-direction: row;
    gap: @gap-length;
    font-size: 1.25rem;
  }
</style>
