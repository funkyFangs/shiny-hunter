export async function fetchWithCache(input: RequestInfo | URL, cacheName: string, fetchCallback: typeof fetch = fetch): Promise<Response> {
	const cache = await caches.open(cacheName)
	const cachedResponse = await cache.match(input)

	if (cachedResponse) {
		return cachedResponse
	}
	else {
		const fetchResponse = await fetchCallback(input);
		if (fetchResponse.ok) {
			await cache.put(input, fetchResponse.clone())
			return fetchResponse
		}
		else {
			throw new TypeError('bad response status')
		}
	}
}