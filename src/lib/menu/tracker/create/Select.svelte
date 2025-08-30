<script lang="ts">
  let {
    options,
    id,
    value = $bindable()
  }: {
    options: unknown[]
    id: string
    value: string
  } = $props()
</script>

<select {id} bind:value>
  {#each options as option (option)}
    <option value={option}>{option}</option>
  {/each}
</select>

<style lang="css">
  select {
    height: 36px;
    text-align: center;
    width: fit-content;
    background-color: var(--color-indigo-500);
    color: whitesmoke;
  }

  select:hover {
    background-color: var(--color-indigo-400);
    color: black;
  }

  select:active {
    background-color: var(--color-indigo-300);
    color: black;
  }
</style>
