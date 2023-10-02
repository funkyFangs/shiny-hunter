<script lang='ts'>
  import { writable } from 'svelte/store';
  import type { Tracker } from '$lib/tracker/Tracker';

  const loadedTrackersJson = localStorage.getItem('trackers');
  const loadedTrackers = writable<Tracker[]>(loadedTrackersJson ? JSON.parse(loadedTrackersJson) : [])
</script>

