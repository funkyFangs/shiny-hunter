import { localStorageWritable } from '$lib/storage/StorageWritable';
import { HISTORY, type HuntTracker } from '$lib/api/HuntTracker';

export function load() {
	return {
		history: localStorageWritable<HuntTracker[]>(HISTORY, [])
	}
}