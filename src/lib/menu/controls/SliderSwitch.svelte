<script lang="ts">
  export let checked = false
  export let id: string | undefined = undefined
  export let offText: string = ''
  export let offColor: string = '#1F2123'
  export let onText: string = ''
  export let onColor: string = '#4875C6'

  $: backgroundColor = checked ? onColor : offColor
</script>

<button
  {id}
  type="button"
  role="switch"
  aria-checked={checked}
  onclick={() => (checked = !checked)}
  class:checked
  style="background-color: {backgroundColor}"
>
  <span>{checked ? onText : offText}</span>
</button>

<style lang="less">
  @import '../../../style/animation';
  @import '../../../style/palette';
  @import '../../../style/positioning';

  [role='switch'] {
    width: 3rem;
    cursor: pointer;
    background-color: @shark;
    padding: @padding-length;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;

    span {
      border-radius: 50%;
      background-color: white;
      transition: background-color @transition-duration @transition-timing-function;
      color: black;
      width: 1.5em;
      height: 1.5em;
      display: inline-block;
      text-align: center;
      user-select: none;
    }
  }

  [role='switch'][aria-checked='true'] {
    justify-content: right;
  }

  [role='switch'][aria-checked='false'] {
    justify-content: left;
  }

  [role='switch']:hover > span {
    background-color: @riptide;
  }
</style>
