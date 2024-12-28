<div id="container">
  <h1>Credits</h1>

  <section>
    <h2>PokéAPI</h2>

    <p>
      This project uses <a href="https://pokeapi.co">PokéAPI</a> for data related to Pokémon as well
      as their sprites.
    </p>
  </section>

  <section>
    <h2>Bulbapedia</h2>

    <p>
      The details of various shiny hunting methods and computation of their probabilities was
      sourced from
      <a href="https://bulbapedia.bulbagarden.net">Bulbapedia</a>.
    </p>
  </section>

  <section>
    <h2>Serebii</h2>

    <p>
      Details regarding shiny locks were sourced from <a href="https://www.serebii.net">Serebii</a>.
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
  h2,
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
