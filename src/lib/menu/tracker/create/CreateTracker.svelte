<script lang="ts">
  import { type Version } from '$lib/api/VersionResource'
  import { type Generation } from '$lib/api/GenerationResource'
  import { type HuntingMethod } from '$lib/api/HuntingMethod'
  import { type PokemonSpecies } from '$lib/api/PokemonSpeciesResource'
  import { type Pokemon } from '$lib/api/PokemonResource'
  import type { PokemonForm } from '$lib/api/PokemonFormResource'
  import SelectVersion from '$lib/menu/tracker/create/SelectVersion.svelte'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'
  import SelectHuntingMethod from '$lib/menu/tracker/create/SelectHuntingMethod.svelte'
  import SliderToggle from '$lib/menu/controls/SliderToggle.svelte'
  import type { CreatedHuntTracker } from '$lib/api/HuntTracker'
  import SelectPokemonSpecies from '$lib/menu/tracker/create/SelectPokemonSpecies.svelte'
  import SelectPokemon from '$lib/menu/tracker/create/SelectPokemon.svelte'
  import SelectPokemonForm from '$lib/menu/tracker/create/SelectPokemonForm.svelte'
  import { getSupportedPokemon } from '$lib/api/VarietyResource'
  import { fade } from 'svelte/transition'

  /* ============================================================================================ *\
	 *  Inputs																																											*
	\* ============================================================================================ */

  let {
    generations,
    created
  }: {
    generations: Generation[]
    created: (tracker: CreatedHuntTracker) => void
  } = $props()

  /* ============================================================================================ *\
	 *  Form  																																											*
	\* ============================================================================================ */

  let selectedVersion = $state<Version>()
  let selectedVersionGroup = $state<VersionGroup>()
  let selectedGeneration = $state<Generation>()
  let selectedPokemonSpecies = $state<PokemonSpecies>()
  let selectedPokemon = $state<Pokemon>()
  let selectedPokemonForm = $state<PokemonForm>()
  let isFemale = $state(false)
  let selectedHuntingMethod: HuntingMethod | undefined = $state()
  let shinyCharm: boolean = $state(false)

  const readyToSubmit = $derived(
    selectedVersion &&
      selectedPokemonSpecies &&
      selectedPokemon &&
      selectedPokemonForm &&
      selectedHuntingMethod
  )

  $effect(() => {
    if (selectedPokemonSpecies && selectedGeneration && selectedVersionGroup) {
      const supportedPokemon = getSupportedPokemon(
        selectedPokemonSpecies,
        selectedGeneration,
        selectedVersionGroup
      )
      if (supportedPokemon.length === 1) {
        selectedPokemon = supportedPokemon[0]
      }
    }
  })

  $effect(() => {
    if (selectedPokemon && selectedPokemon.forms.length === 1) {
      selectedPokemonForm = selectedPokemon.forms[0]
    }
  })

  function onSubmit() {
    const supportedPokemon = getSupportedPokemon(
      selectedPokemonSpecies!,
      selectedGeneration!,
      selectedVersionGroup!
    )

    created({
      method: selectedHuntingMethod!,
      pokemonSpecies: selectedPokemonSpecies!,
      pokemon: supportedPokemon.length === 1 ? undefined : (selectedPokemon ?? undefined),
      pokemonForm:
        selectedPokemon!.forms!.length === 1 ? undefined : (selectedPokemonForm ?? undefined),
      female: selectedPokemonSpecies!.hasGenderDifferences ? isFemale : undefined,
      version: selectedVersion!.name,
      versionGroup:
        selectedVersionGroup!.name === selectedVersion!.name
          ? undefined
          : selectedVersionGroup!.name,
      generation: selectedGeneration!.id,
      shinyCharm: selectedGeneration!.id >= 5 ? shinyCharm : undefined
    })
  }
</script>

<div id="create-tracker">
  <table>
    <tbody>
      <tr>
        <th scope="row"><label for="version">Version</label></th>
        <td>
          <SelectVersion
            {generations}
            bind:selectedVersion
            selectVersionGroup={(versionGroup) => (selectedVersionGroup = versionGroup)}
            selectGeneration={(generation) => (selectedGeneration = generation)}
          />
        </td>
      </tr>

      {#if selectedGeneration && selectedGeneration.id >= 5}
        <tr transition:fade>
          <th scope="row"><label for="shiny-charm">Shiny Charm</label></th>
          <td><SliderToggle id="shiny-charm" bind:checked={shinyCharm} /></td>
        </tr>
      {/if}

      {#if selectedVersion && selectedVersionGroup && selectedGeneration}
        <tr transition:fade>
          <th scope="row"><label for="hunting-method">Hunting Method</label></th>
          <td>
            <SelectHuntingMethod
              {selectedVersion}
              {selectedVersionGroup}
              {selectedGeneration}
              bind:selectedHuntingMethod
            />
          </td>
        </tr>

        <tr transition:fade>
          <th scope="row"><label for="pokemon-species">Pokemon Species</label></th>
          <td>
            <SelectPokemonSpecies
              {generations}
              generation={selectedGeneration}
              bind:selectedPokemonSpecies
            />
          </td>
        </tr>

        {#if selectedPokemonSpecies}
          {#if selectedPokemonSpecies.hasGenderDifferences && selectedGeneration.id > 2}
            <tr transition:fade>
              <th scope="row"><label for="gender">Gender</label></th>
              <td>
                <SliderToggle
                  id="gender"
                  offText="♂"
                  offColor="#5BCEFA"
                  onText="♀"
                  onColor="#F5A9B8"
                  bind:checked={isFemale}
                />
              </td>
            </tr>
          {/if}

          {#if getSupportedPokemon(selectedPokemonSpecies, selectedGeneration, selectedVersionGroup).length > 1}
            <tr transition:fade>
              <th scope="row"><label for="pokemon">Pokemon</label></th>
              <td>
                <SelectPokemon
                  pokemonSpecies={selectedPokemonSpecies}
                  generation={selectedGeneration}
                  versionGroup={selectedVersionGroup}
                  bind:selectedPokemon
                />
              </td>
            </tr>
          {/if}

          {#if selectedPokemon && selectedPokemon.forms.length > 1}
            <tr transition:fade>
              <th scope="row"><label for="pokemon-form">Pokemon Form</label></th>
              <td>
                <SelectPokemonForm {selectedPokemon} bind:selectedPokemonForm />
              </td>
            </tr>
          {/if}
        {/if}
      {/if}
    </tbody>
  </table>

  <button id="submit" class="primary-button" disabled={!readyToSubmit} onclick={onSubmit}
    >Create Hunt Tracker</button
  >
</div>

<style>
  #create-tracker {
    /* Positioning */
    display: flex;
    padding: var(--gap-length);
    justify-content: center;
    align-content: center;
    gap: var(--gap-length);

    /* Decoration */
    border-radius: var(--border-radius);

    /* Palette */
    background-color: var(--primary-medium);
    flex-direction: column;
  }

  #submit {
    width: fit-content;
    margin: auto;
    height: 38px;
    font-weight: bold;
    font-size: 15pt;
  }

  td {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
