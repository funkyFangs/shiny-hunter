<script lang="ts">
  let {
    type,
    id,
    max,
    min,
    value = $bindable()
  }: {
    type: string
    id: string
    max?: number
    min?: number
    value: string | number
  } = $props()
</script>

<input {id} {max} {min} {type} bind:value />

<style lang="css">
  input {
    height: 36px;
    text-align: center;
    width: fit-content;
    background-color: var(--color-indigo-500);
    color: whitesmoke;
  }

  input:hover {
    background-color: var(--color-indigo-400);
    color: black;
  }

  input:active {
    background-color: var(--color-indigo-300);
    color: black;
  }
</style>
