export function delimitedFormat(source: string, formatter: (token: string) => string, delimiter = '-', separator: string = ' ') {
	return source.split(delimiter).map(formatter).join(separator)
}

export function delimitedTitleCase(source: string, delimiter: string = '-', separator: string = ' ') {
	return delimitedFormat(source, titleCase, delimiter, separator)
}

export function titleCase(token: string): string {
	const length = token?.length ?? 0
	switch (length) {
		case 0:
			return token
		case 1:
			return token.toUpperCase()
		default:
			return token.charAt(0).toUpperCase() + token.substring(1)
	}
}

const ROMAN_NUMERALS = Object.entries({
	m: 1000,
	cm: 900,
	d: 500,
	cd: 400,
	c: 100,
	xc: 90,
	l: 50,
	xl: 40,
	x: 10,
	ix: 9,
	v: 5,
	iv: 4,
	i: 1
})

export function toRomanNumerals(value: number) {
	let romanNumerals = '';
	for (const [romanNumeral, romanNumeralValue] of ROMAN_NUMERALS) {
		while (value >= romanNumeralValue) {
			romanNumerals += romanNumeral;
			value -= romanNumeralValue;
		}
	}
	return romanNumerals;
}

export function sanitizeInteger(integer: string | number) {
	return Number(String(integer).replaceAll(/^0+(?=0)|\D/g, ''))
}