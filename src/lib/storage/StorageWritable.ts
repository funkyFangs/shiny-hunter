import { get, type Updater, type Writable, writable } from 'svelte/store';
import { browser } from '$app/environment';

function storageWritable<Data>(storage: Storage, key: string, data?: Data): Writable<Data> {
	const store = writable<Data>(
		browser && storage?.[key]
			? JSON.parse(storage[key])
			: data
	);
	const { subscribe, set } = store;

	return {
		subscribe,
		set: (data: Data) => {
			if (browser) {
				if (data === undefined) {
					storage.removeItem(key);
				} else {
					storage[key] = JSON.stringify(data);
				}
			}
			set(data);
		},
		update: (updater: Updater<Data>) => {
			const data = updater(get(store));
			if (browser) {
				if (data === undefined) {
					storage.removeItem(key);
				} else {
					storage[key] = JSON.stringify(data);
				}
			}
			set(data);
		},
	}
}

export function localStorageWritable<Data>(key: string, data: Data): Writable<Data> {
	return storageWritable(localStorage, key, data)
}
