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
