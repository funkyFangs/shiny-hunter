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

<style>
  footer {
    position: absolute;
    width: 100%;
    height: var(--top-bar-height);
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 2;

    background-color: var(--primary-darkest);
  }

  nav {
    display: flex;
    flex-direction: row;
    gap: var(--gap-length);
    font-size: 1.25rem;
  }
</style>
