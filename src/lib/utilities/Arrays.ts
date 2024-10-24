export function range(start: number, end: number, endInclusive: boolean = false): number[] {
	const size = (endInclusive ? end : end - 1) - start + 1
	return Array.from(Array(size).keys()).map(number => number + start)
}
