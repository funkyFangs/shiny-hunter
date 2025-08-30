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
      {#each links as link (link.href)}
        <a href={link.href}>{link.content ?? link.href}</a>
      {/each}
    </nav>
  {/if}
</footer>

<style lang="css">
  footer {
    position: fixed;
    width: 100%;
    height: var(--h-top-bar);
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 2;

    /* Palette */
    background-color: var(--color-shark);
    box-shadow: 10px 0 50px 0 rgba(0, 0, 0, 0.3);

    > nav {
      display: flex;
      flex-direction: row;
      gap: var(--l-gap);
      font-size: 1.25rem;

      & a {
        color: whitesmoke;

        &:hover:not(:active) {
          color: var(--color-riptide);
        }
      }
    }
  }
</style>
