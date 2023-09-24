/**
 * @param source the source of values to iterate over
 * @param groupExtractor a function which extracts the group value from a value
 * @returns a map grouping the supplied values by the derived groups
 */
export function groupBy<GROUP, VALUE>(source: Iterable<VALUE>, groupExtractor: (value: VALUE) => GROUP): Map<GROUP, Array<VALUE>> {
  let map = new Map<GROUP, Array<VALUE>>()
  for (const value of source) {
    const group = groupExtractor(value)

    // Create empty array if group has not been encountered
    if (!map.has(group)) {
      map.set(group, [])
    }

    // Push value to array
    map.get(group)!.push(value)
  }
  return map
}