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
