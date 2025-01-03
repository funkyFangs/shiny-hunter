export function range(start: number, end: number, endInclusive: boolean = false): number[] {
  const size = (endInclusive ? end : end - 1) - start + 1
  return Array.from(Array(size).keys()).map((number) => number + start)
}

export function distinct<Element>(elements: Element[]): Element[] {
  const encounteredElements = new Set<Element>([])
  return elements.filter((element) => {
    const isEncountered = encounteredElements.has(element)
    encounteredElements.add(element)
    return !isEncountered
  })
}
