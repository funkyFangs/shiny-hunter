<!--
@component
# Description
`Fraction` is a component which displays a fraction.
It can also reduce the fraction to simplest form and display the fraction's approximate percentage.

## Fields
|Field|Description|Default|Required|
|:-:|-|:-:|:-:|
|numerator|This is the upper-half of the fraction.|N/A|Yes|
|denominator|This is the lower-half of the fraction.|N/A|Yes|
|showPercentage|This determines whether or not the approximate percentage is displayed.|`true`|No|
|accuracy|This is the number of digits to round to for the approximate percentage.|`3`|No|
|reduce|This determines whether or not the fraction should be reduced to simplest form.|`true`|No|
|id|This is the HTML ID for the root element of the component.|`null`|No|

# Examples
If you wanted to display the fraction 50/100 in simplest form with an approximate percentage, you could declare the following.
```svelte
<Fraction
  numerator={50}
  denominator={100}
/>
```

If you wanted to display the previous example without reducing the fraction to simplest form, you would include the `reduce` field as follows.
```svelte
<Fraction
  numerator={50}
  denominator={100}
  reduce={false}
/>
```

If you wanted the percentage of the previous example to be rounded to the nearest whole number, you would add the `accuracy` field
like so.
```svelte
<Fraction
  numerator={50}
  denominator={100}
  reduce={false}
  accuracy={0}
/>
```

Finally, if you wanted to hide the percentage for the previous example, you could set the `showPercentage` field as such.
```svelte
<Fraction
  numerator={50}
  denominator={100}
  showPercentage={false}
/>
```
-->
<script lang="ts">
  function gcd(first: number, second: number) {
    if (!second) {
      return first
    }

    return gcd(second, first % second)
  }

  let {
    numerator,
    denominator,
    id,
    inputs = [],
    showFraction = true,
    showPercentage = true,
    accuracy = 3,
    reduce = true
  }: {
    numerator: number
    denominator: number
    id: string
    inputs?: string[] | string
    showPercentage?: boolean
    showFraction?: boolean
    accuracy?: number
    reduce?: boolean
  } = $props()

  function getDecimalValue(numerator: number, denominator: number) {
    return denominator === 0
      ? numerator < 0
        ? Number.NEGATIVE_INFINITY
        : Number.POSITIVE_INFINITY
      : numerator / denominator
  }

  let divisor = $derived(reduce ? gcd(numerator, denominator) : 1)
  let decimalValue = $derived(getDecimalValue(numerator, denominator))
</script>

<output {id} for={Array.isArray(inputs) ? inputs.join(' ') : inputs}>
  {#if showFraction}
    <div aria-label="The likelihood of finding a shiny Pokémon as a fraction" class="fraction">
      <span aria-label="The numerator of the fraction">{numerator / divisor}</span>
      <span aria-label="The denominator of the fraction">{denominator / divisor}</span>
    </div>
  {/if}
  {#if showPercentage}
    <span aria-label="The likelihood of finding a shiny Pokémon as a percentage">
      {#if showFraction}
        (~{(decimalValue * 100).toFixed(accuracy)}%)
      {:else}
        {(decimalValue * 100).toFixed(accuracy)}%
      {/if}
    </span>
  {/if}
</output>

<style lang="less">
  @import '../../../../../style/palette';

  output {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    justify-content: center;
  }

  .fraction {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .fraction > span + span {
    border-top: 1px solid contrast(@darkest-indigo);
  }
</style>
