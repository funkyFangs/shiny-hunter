<script lang="ts">
  import { type Version } from '$lib/api/VersionResource'
  import { type Generation } from '$lib/api/GenerationResource'
  import { HuntingMethod } from '$lib/api/HuntingMethod'
  import { type PokemonSpecies } from '$lib/api/PokemonSpeciesResource'
  import { type Pokemon } from '$lib/api/PokemonResource'
  import type { PokemonForm } from '$lib/api/PokemonFormResource'
  import SelectVersion from '$lib/menu/tracker/create/SelectVersion.svelte'
  import type { VersionGroup } from '$lib/api/VersionGroupResource'
  import SelectHuntingMethod from '$lib/menu/tracker/create/hunting-method/SelectHuntingMethod.svelte'
  import SliderSwitch from '$lib/menu/controls/SliderSwitch.svelte'
  import type { CreatedHuntTracker } from '$lib/api/HuntTracker'
  import SelectPokemonSpecies from '$lib/menu/tracker/create/SelectPokemonSpecies.svelte'
  import SelectPokemon from '$lib/menu/tracker/create/SelectPokemon.svelte'
  import SelectPokemonForm from '$lib/menu/tracker/create/SelectPokemonForm.svelte'
  import { getSupportedPokemon } from '$lib/api/VarietyResource'
  import Input from '$lib/menu/tracker/create/Input.svelte'
  import Select from '$lib/menu/tracker/create/Select.svelte'

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

  let count: number = $state(0)
  let selectedVersion = $state<Version>()
  let selectedVersionGroup = $state<VersionGroup>()
  let selectedGeneration = $state<Generation>()
  let selectedPokemonSpecies = $state<PokemonSpecies>()
  let selectedPokemon = $state<Pokemon>()
  let selectedPokemonForm = $state<PokemonForm>()
  let isFemale = $state(false)
  let selectedHuntingMethod: HuntingMethod | undefined = $state()
  let shinyCharm: boolean = $state(false)
  let lure: boolean = $state(false)
  let sparklingPowerLevel: 0 | 1 | 2 | 3 = $state(0)
  let researchLevel: 'Less than 10' | '10' | 'Perfect' = $state('Less than 10')
  let isMassive: boolean = $state(false)

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
      count,
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
      shinyCharm: selectedGeneration!.id >= 5 ? shinyCharm : undefined,
      lure: selectedVersionGroup!.name === 'lets-go-pikachu-lets-go-eevee' ? lure : undefined,
      researchLevel: selectedVersion!.name === 'legends-arceus' ? researchLevel : undefined,
      isMassive: selectedVersion!.name === 'legends-arceus' ? isMassive : undefined,
      sparklingPowerLevel:
        selectedVersionGroup!.name === 'scarlet-violet' ? sparklingPowerLevel : undefined
    })
  }
</script>

<form id="create-tracker" onsubmit={onSubmit}>
  <label for="version">Version</label>
  <SelectVersion
    id="version"
    {generations}
    bind:selectedVersion
    selectVersionGroup={(versionGroup) => (selectedVersionGroup = versionGroup)}
    selectGeneration={(generation) => (selectedGeneration = generation)}
  />

  {#if selectedGeneration && selectedGeneration.id >= 5}
    <label for="shiny-charm">Shiny Charm</label>
    <SliderSwitch id="shiny-charm" bind:checked={shinyCharm} />
  {/if}

  {#if selectedVersionGroup && selectedVersionGroup.name === 'lets-go-pikachu-lets-go-eevee'}
    <label for="lure">Lure</label>
    <SliderSwitch id="lure" bind:checked={lure} />
  {/if}

  {#if selectedVersion && selectedVersionGroup && selectedGeneration}
    <label for="hunting-method">Hunting Method</label>
    <SelectHuntingMethod
      id="hunting-method"
      {selectedVersion}
      {selectedVersionGroup}
      {selectedGeneration}
      bind:selectedHuntingMethod
    />

    {#if selectedHuntingMethod === HuntingMethod.BRILLIANT_POKEMON}
      <label for="number-battled">No. Battled</label>
      <Input id="number-battled" type="number" bind:value={count} />
    {/if}

    {#if selectedHuntingMethod === HuntingMethod.MASS_OUTBREAK}
      {#if selectedVersionGroup && selectedVersionGroup.name === 'scarlet-violet'}
        <label for="number-battled">Sparkling Power Level</label>
        <Input id="number-battled" type="number" min={0} max={3} bind:value={sparklingPowerLevel} />
      {:else}
        <label for="research-level">Research Level</label>
        <Select
          id="research-level"
          bind:value={researchLevel}
          options={['Less than 10', '10', 'Perfect']}
        />

        <label for="is-massive">Is Massive Mass Outbreak</label>
        <SliderSwitch id="is-massive" bind:checked={isMassive} />
      {/if}
    {/if}

    <label for="pokemon-species">Pokémon Species</label>
    <SelectPokemonSpecies
      id="pokemon-species"
      {generations}
      {selectedGeneration}
      {selectedVersionGroup}
      selectPokemonSpecies={(pokemonSpecies) => (selectedPokemonSpecies = pokemonSpecies)}
    />

    {#if selectedPokemonSpecies}
      {#if selectedPokemonSpecies.hasGenderDifferences && selectedGeneration.id > 3}
        <label for="gender">Gender</label>
        <SliderSwitch
          id="gender"
          offText="♂"
          offColor="#5BCEFA"
          onText="♀"
          onColor="#F5A9B8"
          bind:checked={isFemale}
        />
      {/if}

      {#if getSupportedPokemon(selectedPokemonSpecies, selectedGeneration, selectedVersionGroup).length > 1}
        <label for="pokemon">Pokémon</label>
        <SelectPokemon
          id="pokemon"
          pokemonSpecies={selectedPokemonSpecies}
          generation={selectedGeneration}
          versionGroup={selectedVersionGroup}
          bind:selectedPokemon
        />
      {/if}

      {#if selectedPokemon && selectedPokemon.forms.length > 1}
        <label for="pokemon-form">Pokémon Form</label>
        <SelectPokemonForm id="pokemon-form" {selectedPokemon} bind:selectedPokemonForm />
      {/if}
    {/if}
  {/if}

  <button form="create-tracker" id="submit" disabled={!readyToSubmit}>Create Hunt Tracker</button>
</form>

<style lang="css">
  #create-tracker {
    /* Positioning */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--l-gap);
    align-items: center;
  }

  label {
    text-align: right;
    font-size: 1.2rem;
    color: whitesmoke;
  }

  #submit {
    width: fit-content;
    margin: auto;
    height: 38px;
    font-weight: bold;
    font-size: 15pt;
    grid-column: 1 / 3;

    background-color: var(--color-indigo-500);
    color: whitesmoke;
  }

  #submit:hover {
    background-color: var(--color-indigo-400);
    color: whitesmoke;
  }

  #submit:active {
    background-color: var(--color-indigo-300);
    color: whitesmoke;
  }

  #submit:disabled {
    background-color: #677ea6;
    color: black;
  }
</style>
