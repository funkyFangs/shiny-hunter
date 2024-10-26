<script lang="ts">
	import { fade } from 'svelte/transition'
	import Device from 'svelte-device-info'

	export let title: string
	export let id: string | undefined = undefined

	let isClicked: boolean = false
	let isHovered: boolean = false
	let x: number
	let y: number
	let width: number

	function onMouseEnter(event: MouseEvent) {
		isHovered = true
		onMouseMove(event)
	}

	function onMouseMove(event: MouseEvent) {
		if (!isClicked) {
			x = event.x
			y = event.y
		}
	}

	function onMouseLeave() {
		isHovered = false
	}

	function onClick() {
		if (!Device.canHover) {
			isClicked = !isClicked
		}
	}

	function onKeyPress(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isClicked = false
			isHovered = false
		}
	}

	$: style = `top: ${y + 28}px; left: ${x - width}px`
</script>

<svelte:window
	on:keydown={onKeyPress}
/>

<button
	on:mouseenter={onMouseEnter}
	on:mousemove={onMouseMove}
	on:mouseleave={onMouseLeave}
	on:click={onClick}
>
	<slot/>
</button>

{#if (isHovered && Device.canHover) || isClicked}
	<span
		bind:clientWidth={width}
		transition:fade={{duration: 250}}
		role="tooltip"
		id={id}
		{style}
	>{title}</span>
{/if}

<style>
	button {
		background: none;
		padding: 0;
	}

	span {
    /* Positioning */
		position: absolute;
		padding: 5px;
		max-width: 15em;
		border-radius: var(--border-radius);
		text-align: justify;

    /* Palette */
		background: var(--accent);
		color: var(--primary-darkest);
	}
</style>
