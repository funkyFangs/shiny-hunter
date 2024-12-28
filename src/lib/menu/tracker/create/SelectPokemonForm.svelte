<script lang="ts">
  import type { PokemonForm } from '$lib/api/PokemonFormResource'
  import { delimitedTitleCase } from '$lib/utilities/Strings'
  import type { Pokemon } from '$lib/api/PokemonResource'

  let {
    selectedPokemon,
    id = 'pokemon-form',
    selectedPokemonForm = $bindable()
  }: {
    selectedPokemon: Pokemon
    id?: string
    selectedPokemonForm?: PokemonForm
  } = $props()

  $effect(() => {
    if (selectedPokemon.forms.length === 1) {
      selectedPokemonForm = selectedPokemon.forms[0]
    }
  })
</script>

<select bind:value={selectedPokemonForm} {id} required>
  {#each selectedPokemon.forms as pokemonForm}
    <option value={pokemonForm}>{delimitedTitleCase(pokemonForm.name)}</option>
  {/each}
</select>

<style lang="less">
  @import '../../../../style/palette';

  select {
    height: 36px;
    text-align: center;
    width: fit-content;
    background-color: @indigo;
    color: contrast($background-color);
  }

  select:hover {
    background-color: lighten(@indigo, 5%);
    color: contrast($background-color);
  }

  select:active {
    background-color: lighten(@indigo, 10%);
    color: contrast($background-color);
  }
</style>
