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

<style lang="less">
  @import '../../../../style/palette';

  input {
    height: 36px;
    text-align: center;
    width: fit-content;
    background-color: @indigo;
    color: contrast($background-color);
  }

  input:hover {
    background-color: lighten(@indigo, 5%);
    color: contrast($background-color);
  }

  input:active {
    background-color: lighten(@indigo, 10%);
    color: contrast($background-color);
  }
</style>
