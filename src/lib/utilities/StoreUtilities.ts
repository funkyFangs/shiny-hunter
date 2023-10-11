import { writable, get, type Writable, type Updater } from 'svelte/store';
import { browser } from '$app/environment';

export function localWritable<Data>(key: string, data: Data): Writable<Data> {
  const store = writable(data);
  const { subscribe, set } = store;

  if (browser && localStorage.storable) {
    set(JSON.parse(localStorage[key]));
  }

  return {
    subscribe,
    set: (data: Data) => {
      if (browser) {
        localStorage[key] = JSON.stringify(data);
      }
      set(data);
    },
    update: (updater: Updater<Data>) => {
      const data = updater(get(store));
      if (browser) {
        localStorage[key] = JSON.stringify(data);
      }
      set(data)
    }
  }
}