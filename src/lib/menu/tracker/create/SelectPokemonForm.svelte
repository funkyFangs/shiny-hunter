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
  {#each selectedPokemon.forms as pokemonForm (pokemonForm.formName)}
    <option value={pokemonForm}>{delimitedTitleCase(pokemonForm.name)}</option>
  {/each}
</select>

<style lang="css">
  select {
    height: 36px;
    text-align: center;
    width: fit-content;
    background-color: var(--color-indigo-500);
    color: whitesmoke;

    &:active,
    &:hover {
      color: black;
    }

    &:hover {
      background-color: var(--color-indigo-400);
    }

    &:active {
      background-color: var(--color-indigo-300);
    }
  }
</style>
