import { get, writable, type Writable, type Updater } from 'svelte/store';
import { browser } from '$app/environment';

export function localWritable<Data>(key: string, data: Data): Writable<Data> {
  const store = writable(browser && localStorage[key]
    ? JSON.parse(localStorage[key])
    : data);

  const { subscribe, set } = store;

  return {
    subscribe,
    set: (data: Data) => {
      if (browser) {
        if (data === undefined)
        {
          localStorage.removeItem(key);
        }
        else
        {
          localStorage[key] = JSON.stringify(data);
        }
      }
      set(data);
    },
    update: (updater: Updater<Data>) => {
      const data = updater(get(store));
      if (browser) {
        if (data === undefined)
        {
          localStorage.removeItem(key);
        }
        else
        {
          localStorage[key] = JSON.stringify(data);
        }
      }
      set(data)
    }
  }
}