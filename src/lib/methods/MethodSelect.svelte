<script context='module' lang='ts'>
  import { readonly, writable } from 'svelte/store'

  const writableSelectedMethod = writable<Method>(undefined)
  export const selectedMethod = readonly(writableSelectedMethod)
</script>

<script lang='ts'>
  import { onDestroy } from 'svelte'
  import { selectedGame } from '../games/GamesSelect.svelte'
  import { Method } from './Method'

  const methods$ = writable<Array<Method>>([])

  const unsubscribe = selectedGame.subscribe(game => {
    if (game) {
      fetch(game.methodsFile)
        // Convert to JSON array
        .then(response => response.json() as Promise<Array<Method>>)
        // Map JSON values into Method instances
        .then(array => array.map(method =>
            new Method(method.displayName,
                       method.singularUnit,
                       method.pluralUnit,
                       method.odds)))
        .then(methods => methods$.set(methods))
        .catch(() => methods$.set([]))
    }
  })

  onDestroy(unsubscribe)
</script>

<div id='methodSelect'>
  <label for='method'>Method</label>

  <select bind:value={$writableSelectedMethod} disabled={$methods$.length <= 0} id='method'>
    <option selected style='display:none'/>
    {#each $methods$ as method}
      <option value={method}>{method.displayName}</option>
    {/each}
  </select>
</div>