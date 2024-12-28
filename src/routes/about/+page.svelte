<div id="container">
  <section>
    <h1>About</h1>

    <p>
      Shiny Hunter is a progressive web application built for hunting shiny Pokémon. With this
      application, you can:
    </p>

    <ul>
      <li>Hunt for shiny Pokémon with accurate tracking of probability</li>
      <li>Use controls tailored to the desired hunting method</li>
      <li>Keep track of multiple hunts with a tabbed interface</li>
      <li>View the version-specific sprites for each hunt</li>
      <li>Keep a record of previous hunts</li>
      <li>Install it on a mobile device directly from the web browser</li>
    </ul>

    <p>
      This application is a remake of an existing application that was made as a beginner's project
      for learning web development. Its purpose is to improve upon the mistakes that were previously
      made as well as create an accessible and convenient tool for avid shiny hunters.
    </p>
  </section>

  <section>
    <h1>Development</h1>
    <p>
      Shiny Hunter was developed by <a href="https://funky-fangs.carrd.co">funkyFangs</a>. It was
      built with <a href="https://kit.svelte.dev">SvelteKit</a> and uses
      <a href="https://pokeapi.co">PokéAPI</a>
      for functionality and display.
    </p>

    <p>
      Check it out on <a href="https://github.com/funkyFangs/shiny-hunter-v2">GitHub</a>.
    </p>
  </section>
</div>

<style lang="less">
  @import '../../style/animation';
  @import '../../style/palette';
  @import '../../style/positioning';

  #container {
    /* Positioning */
    padding: @gap-length;
    border-radius: @border-radius;

    /* Palette */
    background-color: @dark-indigo;
  }

  p,
  h1,
  li,
  a:hover {
    /* Palette */
    color: contrast(@indigo);
  }

  a,
  a:active {
    /* Palette */
    color: @riptide;
  }
</style>
