<script context='module' lang='ts'>
  import { readonly, writable } from 'svelte/store'

  export const selectedMethod = writable<Method | undefined>(undefined);
</script>

<script lang='ts'>
  import { onDestroy } from 'svelte'
  import { selectedGame } from '../games/GameSelect.svelte'
  import { Method } from './Method'

  const methods$ = writable<Array<Method>>([])

  const unsubscribe = selectedGame.subscribe(game => {
    if (game) {
      fetch(game.methodsFile)
        // Convert to JSON array
        .then(response => response.json() as Promise<Array<Method>>)
        // Map JSON values into Method instances
        .then(array => array.map(({displayName, singularUnit, pluralUnit, odds}) =>
          new Method(displayName, singularUnit, pluralUnit, odds)))
        .then(methods => methods$.set(methods))
        .catch(() => methods$.set([]))
    }
  })

  onDestroy(unsubscribe)
</script>

<div id='select-method'>
  <label for='method'>Method</label>
  <select bind:value={$selectedMethod} disabled={$methods$.length <= 0} id='method'>
    <option selected style='display:none'/>
    {#each $methods$ as method}
      <option value={method}>{method.displayName}</option>
    {/each}
  </select>
</div>

<style>
  select {
    background-color: var(--background);
    margin-bottom: 10px;
  }

  #select-method * {
    display: inline-block;
  }

  label {
    margin-right: 10px;
  }
</style>